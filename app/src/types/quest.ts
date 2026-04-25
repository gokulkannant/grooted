export type PlotClass = "nano" | "micro" | "macro";

export type QuestType =
  | "care"
  | "scan"
  | "health"
  | "milestone"
  | "map"
  | "community"
  | "learning";

export type QuestDifficulty = "easy" | "medium" | "hard";

export type QuestDefinition = {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  difficulty: QuestDifficulty;
  minLevel: number;
  maxLevel?: number;
  plotClasses: PlotClass[];
  baseXp: number;
  farmPoints: number;
  plantDifficultyMultiplier?: number;
  healthGate?: number;
};

export type ActiveQuest = QuestDefinition & {
  instanceId: string;
  assignedAt: string;
  expiresAt: string;
  rewardXp: number;
};

export type QuestProfile = {
  level: number;
  plotClass: PlotClass;
  averageHealthScore: number;
};
