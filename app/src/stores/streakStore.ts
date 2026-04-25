import { create } from "zustand";
import type { StreakLog, StreakStats } from "@/types/streak";

type StreakState = {
  logs: StreakLog[];
  stats: StreakStats;
  addLog: (log: StreakLog) => void;
  reset: () => void;
};

const initialStats: StreakStats = { current: 0, longest: 0 };

export const useStreakStore = create<StreakState>((set) => ({
  logs: [],
  stats: initialStats,
  addLog: (log) =>
    set((state) => ({
      logs: [log, ...state.logs],
      stats: {
        current: state.stats.current + 1,
        longest: Math.max(state.stats.longest, state.stats.current + 1),
        lastLoggedAt: log.loggedAt,
      },
    })),
  reset: () => set({ logs: [], stats: initialStats }),
}));
