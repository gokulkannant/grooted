import { get } from "@/lib/apiClient";
import type { Ranking, Season } from "@/types/leaderboard";

export const LeaderboardService = {
  currentSeason: () => get<Season>("/leaderboard/season"),
  rankings: () => get<Ranking[]>("/leaderboard"),
};
