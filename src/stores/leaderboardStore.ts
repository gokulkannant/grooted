import { create } from "zustand";
import type { Ranking, Season } from "@/types/leaderboard";

type LeaderboardState = {
  rankings: Ranking[];
  season?: Season;
  setLeaderboard: (rankings: Ranking[], season?: Season) => void;
  reset: () => void;
};

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  rankings: [],
  setLeaderboard: (rankings, season) => set({ rankings, season }),
  reset: () => set({ rankings: [], season: undefined }),
}));
