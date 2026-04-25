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
  all: () => get<Plant[]>("/plants"),
  create: (plant: Pick<Plant, "name" | "species">) => post<Plant>("/plants", plant),
  scan: (payload: ScanPayload) => post<ScanResult>("/plants/scan", payload),
};
