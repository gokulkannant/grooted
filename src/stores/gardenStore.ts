import { create } from "zustand";
import type { Plant } from "@/types/plant";

type GardenState = {
  plants: Plant[];
  isLoading: boolean;
  setPlants: (plants: Plant[]) => void;
  addPlant: (plant: Plant) => void;
  reset: () => void;
};

export const useGardenStore = create<GardenState>((set) => ({
  plants: [],
  isLoading: false,
  setPlants: (plants) => set({ plants }),
  addPlant: (plant) => set((state) => ({ plants: [plant, ...state.plants] })),
  reset: () => set({ plants: [], isLoading: false }),
}));
