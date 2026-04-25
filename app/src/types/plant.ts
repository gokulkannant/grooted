export type HealthStatus = "healthy" | "needs_water" | "wilting" | "dead";

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
  recommendations: string[];
};
