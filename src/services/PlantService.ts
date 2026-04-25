import { get, post } from "@/lib/apiClient";
import type { Plant, ScanResult } from "@/types/plant";

export const PlantService = {
  all: () => get<Plant[]>("/plants"),
  create: (plant: Pick<Plant, "name" | "species">) => post<Plant>("/plants", plant),
  scan: (imageUri: string) => post<ScanResult>("/plants/scan", { imageUri }),
};
