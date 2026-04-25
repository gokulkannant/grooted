const OPENAI_API_KEY = process.env["OPENAI_API_KEY"] ?? "";
const OPENAI_MODEL = process.env["OPENAI_PLANT_MODEL"] ?? "gpt-4.1-mini";

const SUPPORTED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

export type PlantScanInput = {
  imageUrl?: string;
  imageBase64?: string;
  mimeType?: string;
  plantName?: string;
  plantType?: string;
  expectedGrowthStage?: string;
  daysSincePlanting?: number;
  userNotes?: string;
};

export type PlantAnalysisResult = {
  isPlant: boolean;
  confidence: number;
  plantTypeGuess: string;
  currentGrowthPhase:
    | "seed_setup"
    | "germination"
    | "seedling"
    | "vegetative"
    | "flowering"
    | "fruiting"
    | "harvest_ready"
    | "stressed_or_diseased"
    | "unknown";
  phaseReasoning: string;
  healthScore: number;
  healthStatus: "healthy" | "watch" | "needs_attention" | "critical" | "unknown";
  visibleSymptoms: string[];
  possibleCauses: string[];
  careRecommendations: string[];
  nextTask: {
    title: string;
    priority: "low" | "medium" | "high";
    dueIn: string;
  };
  uploadQuality: {
    rating: "good" | "usable" | "poor";
    feedback: string;
  };
  pointEligibility: {
    shouldAwardPoints: boolean;
    reason: string;
  };
  safetyNote: string;
};

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
};

function buildImageUrl(input: PlantScanInput): string {
  if (input.imageUrl) return input.imageUrl;

  if (!input.imageBase64) {
    throw new Error("Provide imageUrl or imageBase64.");
  }

  const mimeType = input.mimeType ?? "image/jpeg";

  if (!SUPPORTED_IMAGE_TYPES.has(mimeType)) {
    throw new Error("Unsupported image type. Use PNG, JPEG, or WEBP.");
  }

  const cleanBase64 = input.imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
  return `data:${mimeType};base64,${cleanBase64}`;
}

function extractOutputText(response: OpenAIResponse): string {
  if (response.output_text) return response.output_text;

  const text = response.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text)
    .find((value): value is string => Boolean(value));

  if (!text) {
    throw new Error("OpenAI response did not include text output.");
  }

  return text;
}

export async function analyzePlantImage(
  input: PlantScanInput,
): Promise<PlantAnalysisResult> {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const imageUrl = buildImageUrl(input);

  const plantContext = {
    plantName: input.plantName ?? null,
    plantType: input.plantType ?? null,
    expectedGrowthStage: input.expectedGrowthStage ?? null,
    daysSincePlanting: input.daysSincePlanting ?? null,
    userNotes: input.userNotes ?? null,
  };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      instructions:
        "You are GROOTED's plant scan assistant. Analyze the image for beginner-friendly plant growth stage and plant health signals. Do not claim certainty beyond the visible image. If the image is unclear or not a plant, say so. Give safe, general plant-care guidance only.",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Analyze this plant upload. Context: ${JSON.stringify(
                plantContext,
              )}`,
            },
            {
              type: "input_image",
              image_url: imageUrl,
              detail: "high",
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "plant_analysis",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            required: [
              "isPlant",
              "confidence",
              "plantTypeGuess",
              "currentGrowthPhase",
              "phaseReasoning",
              "healthScore",
              "healthStatus",
              "visibleSymptoms",
              "possibleCauses",
              "careRecommendations",
              "nextTask",
              "uploadQuality",
              "pointEligibility",
              "safetyNote",
            ],
            properties: {
              isPlant: { type: "boolean" },
              confidence: { type: "number" },
              plantTypeGuess: { type: "string" },
              currentGrowthPhase: {
                type: "string",
                enum: [
                  "seed_setup",
                  "germination",
                  "seedling",
                  "vegetative",
                  "flowering",
                  "fruiting",
                  "harvest_ready",
                  "stressed_or_diseased",
                  "unknown",
                ],
              },
              phaseReasoning: { type: "string" },
              healthScore: { type: "integer" },
              healthStatus: {
                type: "string",
                enum: ["healthy", "watch", "needs_attention", "critical", "unknown"],
              },
              visibleSymptoms: {
                type: "array",
                items: { type: "string" },
              },
              possibleCauses: {
                type: "array",
                items: { type: "string" },
              },
              careRecommendations: {
                type: "array",
                items: { type: "string" },
              },
              nextTask: {
                type: "object",
                additionalProperties: false,
                required: ["title", "priority", "dueIn"],
                properties: {
                  title: { type: "string" },
                  priority: {
                    type: "string",
                    enum: ["low", "medium", "high"],
                  },
                  dueIn: { type: "string" },
                },
              },
              uploadQuality: {
                type: "object",
                additionalProperties: false,
                required: ["rating", "feedback"],
                properties: {
                  rating: {
                    type: "string",
                    enum: ["good", "usable", "poor"],
                  },
                  feedback: { type: "string" },
                },
              },
              pointEligibility: {
                type: "object",
                additionalProperties: false,
                required: ["shouldAwardPoints", "reason"],
                properties: {
                  shouldAwardPoints: { type: "boolean" },
                  reason: { type: "string" },
                },
              },
              safetyNote: { type: "string" },
            },
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI analysis failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as OpenAIResponse;
  return JSON.parse(extractOutputText(data)) as PlantAnalysisResult;
}
