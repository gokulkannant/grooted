import { get, post } from "@/lib/apiClient";
import type { Plant, ScanResult } from "@/types/plant";

type ScanPayload = {
  imageBase64: string;
  scanSessionId?: string;
  plantId?: string;
  capturedAt?: string;
  latitude?: number;
  longitude?: number;
};

export const PlantService = {
  all: () => get<Plant[]>("/api/plants"),
  create: (plant: Pick<Plant, "name" | "species">) => post<Plant>("/api/plants", plant),
  scan: (payload: ScanPayload) => post<ScanResult>("/api/plants/scan", payload),
};
