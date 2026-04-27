import { Elysia } from "elysia";
import { getDb } from "@/lib/db";
import { uploadToR2, generatePhotoKey, isR2Configured } from "@/lib/r2";
import {
  analyzePlantImage,
  type PlantAnalysisResult,
  type PlantScanInput,
} from "@/lib/openaiPlantAnalysis";
import {
  isKindwiseConfigured,
  scanPlantWithKindwise,
  type NormalizedPlantScan,
  type PlantScanHealth,
} from "@/lib/kindwise";

type PlantScanBody = PlantScanInput & {
  scanSessionId?: string;
  plantId?: string;
  capturedAt?: string;
  latitude?: number;
  longitude?: number;
};

type ClientHealthStatus =
  | "healthy"
  | "needs_attention"
  | "at_risk"
  | "diseased"
  | "unknown";

type ScanProvider = "hybrid" | "openai" | "kindwise";

const isScanBody = (body: unknown): body is PlantScanBody =>
  typeof body === "object" &&
  body !== null &&
  ("imageBase64" in body || "imageUrl" in body);

const storeScanResult = async (scan: Record<string, unknown>, imageBase64?: string) => {
  let imageUrl: string | undefined;

  // Upload image to Cloudflare R2 — disabled until R2 credentials are configured
  // if (imageBase64) {
  //   if (!isR2Configured()) {
  //     console.log("⏭️  R2 not configured — skipping image upload");
  //   } else {
  //     try {
  //       const imageBuffer = Buffer.from(imageBase64, "base64");
  //       const key = generatePhotoKey("anonymous", "scan");
  //       imageUrl = await uploadToR2(key, imageBuffer, "image/jpeg");
  //       console.log(`✅ Image uploaded to R2: ${key}`);
  //     } catch (error) {
  //       console.warn("Failed to upload image to R2:", error);
  //     }
  //   }
  // }

  if (!process.env["DATABASE_URL"]) return { imageUrl };

  try {
    const db = await getDb();

    // Store the scan result
    const scanDoc = {
      ...scan,
      imageUrl,
      createdAt: new Date(),
    };
    await db.collection("plant_scans").insertOne(scanDoc);

    // Also create/update a plant document if we identified a species
    const species = scan.species as { commonName?: string; id?: string; scientificName?: string } | undefined;
    if (species?.commonName && species.commonName !== "Unknown plant") {
      const plantDoc = {
        name: species.commonName,
        species,
        health: scan.health ?? "unknown",
        healthScore: scan.healthScore ?? 50,
        imageUrl,
        latitude: scan.latitude ?? null,
        longitude: scan.longitude ?? null,
        scanSessionId: scan.scanSessionId,
        plantedAt: scan.capturedAt ?? new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await db.collection("plants").insertOne(plantDoc);
      console.log(`✅ Plant saved: ${species.commonName}`);
    }

    return { imageUrl };
  } catch (error) {
    console.warn("Failed to store plant scan result:", error);
    return { imageUrl };
  }
};

const shouldUseKindwiseFallback = (analysis: PlantAnalysisResult) => {
  const plantGuess = analysis.plantTypeGuess.trim().toLowerCase();

  return (
    !analysis.isPlant ||
    analysis.confidence < 0.68 ||
    plantGuess === "" ||
    plantGuess === "unknown" ||
    plantGuess === "unknown plant" ||
    analysis.currentGrowthPhase === "unknown"
  );
};

const diseaseConfidenceLabel = (confidence = 0) => {
  if (confidence >= 0.75) return "high confidence";
  if (confidence >= 0.45) return "medium confidence";
  if (confidence > 0) return "low confidence";
  return "unknown confidence";
};

const kindwiseContext = (result: NormalizedPlantScan) => {
  const disease = result.disease
    ? `Plant.id possible health signal: ${result.disease.name} (${Math.round(
        result.disease.confidence * 100,
      )}% confidence, ${diseaseConfidenceLabel(
        result.disease.confidence,
      )}). Treat this as supporting evidence, not a final diagnosis. Only present it as likely if the image visibly supports it; otherwise say "possible" or "worth checking". ${
        result.disease.description ?? ""
      }`
    : "Plant.id health signal: no specific disease suggestion returned.";

  return [
    `Plant.id species: ${result.species.commonName} (${result.species.scientificName ?? "scientific name unavailable"})`,
    `Plant.id species confidence: ${Math.round(result.confidence * 100)}%`,
    `Plant.id health status: ${result.health} with score ${result.healthScore}/100`,
    disease,
    `Plant.id care recommendations: ${result.recommendations.join("; ")}`,
  ].join("\n");
};

const analyzeWithOpenAi = (
  body: PlantScanBody,
  kindwiseResult?: NormalizedPlantScan,
) => {
  if (!kindwiseResult) return analyzePlantImage(body);

  const context = [body.userNotes, kindwiseContext(kindwiseResult)]
    .filter(Boolean)
    .join("\n\n");

  return analyzePlantImage({
    ...body,
    plantName: body.plantName ?? kindwiseResult.species.commonName,
    plantType:
      body.plantType ??
      kindwiseResult.species.scientificName ??
      kindwiseResult.species.commonName,
    userNotes: context,
  });
};

const mapOpenAiHealth = (
  health?: PlantAnalysisResult["healthStatus"],
): ClientHealthStatus => {
  if (!health) return "unknown";
  if (health === "healthy") return "healthy";
  if (health === "watch") return "at_risk";
  if (health === "critical") return "diseased";
  if (health === "needs_attention") return "needs_attention";
  return "unknown";
};

const mapKindwiseHealth = (health?: PlantScanHealth): ClientHealthStatus => {
  if (!health) return "unknown";
  return health;
};

const getScanProvider = (): ScanProvider => {
  const provider = process.env["PLANT_SCAN_PROVIDER"];
  if (provider === "openai" || provider === "kindwise") return provider;
  return "hybrid";
};

const mapKindwiseAnalysisStatus = (
  health?: PlantScanHealth,
): PlantAnalysisResult["healthStatus"] => {
  if (health === "healthy") return "healthy";
  if (health === "at_risk") return "watch";
  if (health === "needs_attention") return "needs_attention";
  if (health === "diseased") return "critical";
  return "unknown";
};

const kindwiseToAnalysis = (result: NormalizedPlantScan): PlantAnalysisResult => {
  const diseaseName = result.disease?.name;
  const diseaseDescription = result.disease?.description;
  const diseaseConfidence = result.disease?.confidence ?? 0;
  const hasHighDiseaseConfidence = diseaseConfidence >= 0.75;
  const hasMediumDiseaseConfidence = diseaseConfidence >= 0.45;
  const diseaseLabel = diseaseName
    ? `${diseaseName} (${Math.round(diseaseConfidence * 100)}% Plant.id confidence)`
    : undefined;
  const visibleSymptoms = hasHighDiseaseConfidence && diseaseLabel ? [diseaseLabel] : [];
  const possibleCauses =
    diseaseLabel && diseaseDescription
      ? [
          hasHighDiseaseConfidence
            ? `${diseaseLabel}: ${diseaseDescription}`
            : `Plant.id flagged ${diseaseLabel} as a possible issue, but this is not confirmed from the image alone. Check for matching symptoms before treating: ${diseaseDescription}`,
        ]
      : [];
  const conservativeCare = diseaseLabel
    ? [
        `Inspect the plant for symptoms that match ${diseaseName}, such as wilting, yellowing, soft roots, stem streaking, spots, or spreading leaf damage.`,
        "Take a close-up photo of the affected leaf, stem, and soil area and scan again before removing plants or applying treatments.",
        "Keep the plant isolated from nearby plants until you confirm whether the issue is spreading.",
      ]
    : [
        "Take another clear close-up photo of affected leaves if symptoms appear.",
        "Keep monitoring watering, light, and leaf color over the next few days.",
      ];
  const careRecommendations = hasHighDiseaseConfidence
    ? result.recommendations.slice(0, 4)
    : conservativeCare;
  const healthStatus = hasHighDiseaseConfidence
    ? mapKindwiseAnalysisStatus(result.health)
    : hasMediumDiseaseConfidence
      ? "watch"
      : result.health === "healthy"
        ? "healthy"
        : "unknown";
  const healthScore = hasHighDiseaseConfidence
    ? result.healthScore
    : hasMediumDiseaseConfidence
      ? Math.max(result.healthScore, 60)
      : result.health === "healthy"
        ? Math.max(result.healthScore, 82)
        : Math.max(result.healthScore, 50);

  return {
    careRecommendations,
    confidence: result.confidence,
    currentGrowthPhase: "unknown",
    healthScore,
    healthStatus,
    isPlant: result.species.id !== "unknown",
    nextTask: {
      dueIn: healthStatus === "healthy" ? "3 days" : "today",
      priority: healthStatus === "healthy" ? "low" : "medium",
      title:
        healthStatus === "healthy"
          ? "Keep monitoring the plant"
          : "Verify the possible issue with a closer scan",
    },
    phaseReasoning:
      "Growth phase is not available from the Kindwise-only response. Re-enable OpenAI/GPT refinement for growth-stage reasoning.",
    plantTypeGuess: result.species.commonName,
    pointEligibility: {
      reason:
        result.species.id !== "unknown"
          ? "Plant.id identified a plant from the live scan."
          : "Plant identity is uncertain.",
      shouldAwardPoints: result.species.id !== "unknown",
    },
    possibleCauses,
    safetyNote:
      "This result comes from Plant.id/Kindwise without GPT refinement. Treat disease names as possible leads unless confidence is high and symptoms are visible.",
    uploadQuality: {
      feedback:
        "Kindwise accepted the image for plant identification and health assessment.",
      rating: "usable",
    },
    visibleSymptoms,
  };
};

const normalizeResponse = (
  body: PlantScanBody,
  source: "openai" | "openai_kindwise" | "kindwise",
  openAiAnalysis?: PlantAnalysisResult,
  kindwiseResult?: NormalizedPlantScan,
) => {
  const analysis = openAiAnalysis ?? (kindwiseResult ? kindwiseToAnalysis(kindwiseResult) : undefined);
  const diseaseFromOpenAi =
    analysis &&
    analysis.healthStatus !== "healthy" &&
    (analysis.visibleSymptoms.length > 0 ||
      analysis.possibleCauses.length > 0)
      ? {
          confidence: analysis.confidence,
          description: analysis.possibleCauses.join("; "),
          name:
            analysis.visibleSymptoms[0] ??
            analysis.possibleCauses[0] ??
            "Visible plant stress",
          treatment: {
            biological: [],
            chemical: [],
            prevention: analysis.careRecommendations,
          },
        }
      : undefined;

  const species = kindwiseResult?.species ?? {
    commonName: analysis?.plantTypeGuess || "Unknown plant",
    id: "openai-guess",
  };
  const response = {
    analysis,
    capturedAt: body.capturedAt ?? new Date().toISOString(),
    confidence: kindwiseResult?.confidence ?? analysis?.confidence ?? 0,
    disease: kindwiseResult?.disease ?? diseaseFromOpenAi,
    fallbackUsed: Boolean(kindwiseResult),
    health: analysis
      ? mapOpenAiHealth(analysis.healthStatus)
      : mapKindwiseHealth(kindwiseResult?.health),
    healthScore: analysis?.healthScore ?? kindwiseResult?.healthScore ?? 50,
    ok: true,
    plantId: body.plantId,
    plantIdResult: kindwiseResult,
    recommendations:
      analysis?.careRecommendations ??
      kindwiseResult?.recommendations ?? [
        "Take one clear close-up photo of the leaves and scan again.",
      ],
    scanSessionId: body.scanSessionId ?? crypto.randomUUID(),
    source,
    species,
  };

  return response;
};

export const plantsPlugin = new Elysia({ prefix: "/plants" })
  .get("/", async () => {
    try {
      const db = await getDb();
      const plants = await db
        .collection("plants")
        .find({})
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();
      return { ok: true, plants };
    } catch {
      return { ok: true, plants: [] };
    }
  })
  .get("/:id", () => ({ message: "TODO: get plant detail" }))
  .post("/", () => ({ message: "TODO: add plant" }))
  .post("/scan", async ({ body, set }) => {
    if (!isScanBody(body)) {
      set.status = 400;
      return {
        ok: false,
        error: "imageBase64 or imageUrl is required",
      };
    }

    let openAiAnalysis: PlantAnalysisResult | undefined;
    let kindwiseResult: NormalizedPlantScan | undefined;
    let openAiError: string | undefined;
    let kindwiseError: string | undefined;
    let source: "openai" | "openai_kindwise" | "kindwise" = "openai";

    const provider = getScanProvider();

    // Provider modes:
    // - hybrid (recommended): Plant.id first for species/disease evidence, GPT finalizes UX.
    // - openai: GPT first, Plant.id only if GPT is uncertain or unavailable.
    // - kindwise: Plant.id only, useful for debugging the raw API behavior.
    if (provider === "kindwise") {
      if (!body.imageBase64) {
        set.status = 400;
        return {
          ok: false,
          error: "imageBase64 is required for Kindwise-only scans",
        };
      }

      if (!isKindwiseConfigured()) {
        set.status = 503;
        return {
          ok: false,
          error: "KINDWISE_API_KEY is not configured.",
        };
      }

      try {
        kindwiseResult = await scanPlantWithKindwise(body.imageBase64, {
          latitude: body.latitude,
          longitude: body.longitude,
        });

        const response = normalizeResponse(body, "kindwise", undefined, kindwiseResult);

        const { imageUrl } = await storeScanResult({
          ...response,
          latitude: body.latitude,
          longitude: body.longitude,
          errors: {},
        }, body.imageBase64);

        return { ...response, imageUrl, latitude: body.latitude, longitude: body.longitude };
      } catch (error) {
        set.status = 502;
        return {
          ok: false,
          error: error instanceof Error ? error.message : "Plant.id scan failed.",
        };
      }
    }

    if (provider === "hybrid" && body.imageBase64 && isKindwiseConfigured()) {
      try {
        kindwiseResult = await scanPlantWithKindwise(body.imageBase64, {
          latitude: body.latitude,
          longitude: body.longitude,
        });
        source = "openai_kindwise";
      } catch (error) {
        kindwiseError =
          error instanceof Error ? error.message : "Plant.id evidence lookup failed.";
      }
    }

    try {
      openAiAnalysis = await analyzeWithOpenAi(body, kindwiseResult);
    } catch (error) {
      openAiError =
        error instanceof Error ? error.message : "OpenAI plant analysis failed.";
    }

    const needsFallback =
      !openAiAnalysis || shouldUseKindwiseFallback(openAiAnalysis);

    if (
      provider === "openai" &&
      needsFallback &&
      body.imageBase64 &&
      isKindwiseConfigured()
    ) {
      try {
        kindwiseResult = await scanPlantWithKindwise(body.imageBase64, {
          latitude: body.latitude,
          longitude: body.longitude,
        });
        source = "kindwise";

        try {
          openAiAnalysis = await analyzeWithOpenAi(body, kindwiseResult);
          source = "openai_kindwise";
        } catch (error) {
          openAiError =
            error instanceof Error ? error.message : "OpenAI refinement failed.";
        }
      } catch (error) {
        kindwiseError =
          error instanceof Error ? error.message : "Plant.id fallback failed.";
      }
    }

    if (!openAiAnalysis && !kindwiseResult) {
      set.status = 502;
      return {
        ok: false,
        error:
          openAiError ??
          kindwiseError ??
          "Plant scan failed. Configure OPENAI_API_KEY or KINDWISE_API_KEY.",
      };
    }

    const response = normalizeResponse(
      body,
      source,
      openAiAnalysis,
      kindwiseResult,
    );

    const { imageUrl } = await storeScanResult({
      ...response,
      latitude: body.latitude,
      longitude: body.longitude,
      errors: {
        kindwise: kindwiseError,
        openAi: openAiError,
      },
    }, body.imageBase64);

    return { ...response, imageUrl, latitude: body.latitude, longitude: body.longitude };
  })
  .put("/:id", () => ({ message: "TODO: update plant" }))
  .delete("/:id", () => ({ message: "TODO: delete plant" }));
