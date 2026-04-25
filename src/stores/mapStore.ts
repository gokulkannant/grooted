import { create } from "zustand";
import type { FarmZone, SeedDrop, Territory } from "@/types/map";

type MapState = {
  nearbyZones: FarmZone[];
  seedDrops: SeedDrop[];
  territories: Territory[];
  setMapData: (data: Partial<Pick<MapState, "nearbyZones" | "seedDrops" | "territories">>) => void;
  reset: () => void;
};

export const useMapStore = create<MapState>((set) => ({
  nearbyZones: [],
  seedDrops: [],
  territories: [],
  setMapData: (data) => set(data),
  reset: () => set({ nearbyZones: [], seedDrops: [], territories: [] }),
}));
