import { get, post } from "@/lib/apiClient";
import type { StreakLog, StreakStats } from "@/types/streak";

export const StreakService = {
  logs: () => get<StreakLog[]>("/streak/logs"),
  stats: () => get<StreakStats>("/streak/stats"),
  createLog: (log: Omit<StreakLog, "id" | "loggedAt">) => post<StreakLog>("/streak/logs", log),
};
