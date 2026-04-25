import { get, post } from "@/lib/apiClient";
import type { FarmZone, SeedDrop, Territory } from "@/types/map";

export const MapService = {
  nearbyZones: () => get<FarmZone[]>("/map/zones/nearby"),
  seedDrops: () => get<SeedDrop[]>("/map/seed-drops"),
  claimTerritory: (territoryId: string) => post<Territory>(`/map/territories/${territoryId}/claim`),
};
