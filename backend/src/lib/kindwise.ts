const KINDWISE_API_KEY =
  process.env["KINDWISE_API_KEY"] ?? process.env["PLANT_ID_API_KEY"] ?? "";

const KINDWISE_IDENTIFICATION_URL = "https://plant.id/api/v3/identification";

type KindwiseBooleanResult = {
  binary?: boolean;
  probability?: number;
  threshold?: number;
};

type KindwiseSuggestion = {
  id?: string;
  name?: string;
  probability?: number;
  details?: {
    common_names?: string[] | null;
    description?: string | { value?: string } | null;
    local_name?: string | null;
    treatment?: {
      biological?: string[];
      chemical?: string[];
      prevention?: string[];
    };
  };
};

type PlantDiseaseTreatment = {
  biological: string[];
  chemical: string[];
  prevention: string[];
};

type KindwiseIdentification = {
  access_token?: string;
  result?: {
    is_plant?: KindwiseBooleanResult;
    is_healthy?: KindwiseBooleanResult;
    classification?: {
      suggestions?: KindwiseSuggestion[];
    };
    disease?: {
      suggestions?: KindwiseSuggestion[];
    };
  };
  status?: string;
};

export type PlantScanHealth = "healthy" | "needs_attention" | "at_risk" | "diseased" | "unknown";

export type NormalizedPlantScan = {
  accessToken?: string;
  species: {
    id: string;
    commonName: string;
    scientificName?: string;
  };
  confidence: number;
  health: PlantScanHealth;
  healthScore: number;
  disease?: {
    id?: string;
    name: string;
    confidence: number;
    description?: string;
    treatment: PlantDiseaseTreatment;
  };
  recommendations: string[];
  raw: {
    identification: KindwiseIdentification;
    healthAssessment: KindwiseIdentification;
  };
};

type ScanOptions = {
  latitude?: number;
  longitude?: number;
  language?: string;
};

const ensureConfigured = () => {
  if (!KINDWISE_API_KEY) {
    throw new Error("KINDWISE_API_KEY is not configured");
  }
};

export const isKindwiseConfigured = () => Boolean(KINDWISE_API_KEY);

const stripDataUrlPrefix = (imageBase64: string) =>
  imageBase64.replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "").trim();

const postKindwise = async (
  imageBase64: string,
  params: Record<string, string>,
  body: Record<string, unknown>,
): Promise<KindwiseIdentification> => {
  ensureConfigured();

  const url = new URL(KINDWISE_IDENTIFICATION_URL);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, {
    body: JSON.stringify({
      images: [stripDataUrlPrefix(imageBase64)],
      ...body,
    }),
    headers: {
      "Api-Key": KINDWISE_API_KEY,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  const payload = (await response.json().catch(() => ({}))) as KindwiseIdentification & {
    message?: string;
  };

  if (!response.ok) {
    throw new Error(payload.message ?? `Kindwise request failed with ${response.status}`);
  }

  return payload;
};

const firstSuggestion = (suggestions?: KindwiseSuggestion[]) => suggestions?.[0];

const readDescription = (
  description: string | { value?: string } | null | undefined,
) => {
  if (!description) return undefined;
  if (typeof description === "string") return description;
  return description.value;
};

const flattenTreatment = (treatment: PlantDiseaseTreatment) => {
  const biological = treatment.biological.slice(0, 2);
  const prevention = treatment.prevention.slice(0, 3);
  const chemical = treatment.chemical.slice(0, 1);
  return [...biological, ...prevention, ...chemical];
};

const calculateHealth = (
  isHealthy?: KindwiseBooleanResult,
  diseaseSuggestion?: KindwiseSuggestion,
): { health: PlantScanHealth; healthScore: number } => {
  const healthyProbability = isHealthy?.probability ?? 0;
  const diseaseProbability = diseaseSuggestion?.probability ?? 0;

  if (isHealthy?.binary) {
    return { health: "healthy", healthScore: Math.round(healthyProbability * 100) };
  }

  if (diseaseProbability >= 0.7) return { health: "diseased", healthScore: 20 };
  if (diseaseProbability >= 0.45) return { health: "at_risk", healthScore: 45 };
  if (diseaseProbability > 0) return { health: "needs_attention", healthScore: 65 };
  return { health: "unknown", healthScore: 50 };
};

export const scanPlantWithKindwise = async (
  imageBase64: string,
  options: ScanOptions = {},
): Promise<NormalizedPlantScan> => {
  const language = options.language ?? "en";
  const locationBody =
    typeof options.latitude === "number" && typeof options.longitude === "number"
      ? { latitude: options.latitude, longitude: options.longitude }
      : {};

  const identification = await postKindwise(
    imageBase64,
    { details: "common_names,url,taxonomy,description" },
    locationBody,
  );

  const healthAssessment = await postKindwise(
    imageBase64,
    { details: "description,treatment,common_names,classification,local_name", language },
    { ...locationBody, health: "only" },
  );

  const speciesSuggestion = firstSuggestion(
    identification.result?.classification?.suggestions,
  );
  const diseaseSuggestion = firstSuggestion(healthAssessment.result?.disease?.suggestions);
  const treatment = diseaseSuggestion?.details?.treatment ?? {};
  const normalizedTreatment = {
    biological: treatment.biological ?? [],
    chemical: treatment.chemical ?? [],
    prevention: treatment.prevention ?? [],
  };
  const { health, healthScore } = calculateHealth(
    healthAssessment.result?.is_healthy,
    diseaseSuggestion,
  );
  const diseaseName =
    diseaseSuggestion?.details?.local_name ?? diseaseSuggestion?.name ?? "Unknown issue";
  const diseaseDescription = readDescription(diseaseSuggestion?.details?.description);
  const recommendations =
    health === "healthy"
      ? ["Keep the current care routine.", "Scan again in a few days to track changes."]
      : flattenTreatment(normalizedTreatment);

  return {
    accessToken: healthAssessment.access_token,
    confidence: speciesSuggestion?.probability ?? 0,
    disease: diseaseSuggestion
      ? {
          confidence: diseaseSuggestion.probability ?? 0,
          description: diseaseDescription,
          id: diseaseSuggestion.id,
          name: diseaseName,
          treatment: normalizedTreatment,
        }
      : undefined,
    health,
    healthScore,
    raw: {
      healthAssessment,
      identification,
    },
    recommendations:
      recommendations.length > 0
        ? recommendations
        : ["Take one close-up leaf photo in good light and scan again."],
    species: {
      commonName:
        speciesSuggestion?.details?.common_names?.[0] ??
        speciesSuggestion?.name ??
        "Unknown plant",
      id: speciesSuggestion?.id ?? "unknown",
      scientificName: speciesSuggestion?.name,
    },
  };
};
