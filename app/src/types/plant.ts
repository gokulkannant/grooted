export type HealthStatus =
  | "healthy"
  | "needs_water"
  | "wilting"
  | "dead"
  | "needs_attention"
  | "at_risk"
  | "diseased"
  | "unknown";

export type Species = {
  id: string;
  commonName: string;
  scientificName?: string;
};

export type Plant = {
  id: string;
  name: string;
  species: Species;
  health: HealthStatus;
  plantedAt: string;
  imageUrl?: string;
};

export type ScanResult = {
  species: Species;
  confidence: number;
  health: HealthStatus;
  healthScore: number;
  disease?: {
    id?: string;
    name: string;
    confidence: number;
    description?: string;
    treatment: {
      biological: string[];
      chemical: string[];
      prevention: string[];
    };
  };
  recommendations: string[];
  scanSessionId?: string;
  capturedAt?: string;
  fallbackUsed?: boolean;
  source?: "openai" | "openai_kindwise" | "kindwise";
};
