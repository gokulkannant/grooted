import type { ActiveQuest, PlotClass, QuestDefinition, QuestProfile } from "@/types/quest";

const nanoAndUp: PlotClass[] = ["nano", "micro", "macro"];

export const questPool: QuestDefinition[] = [
  {
    id: "leaf-check",
    title: "Leaf Check",
    description: "Upload a clear photo of your plant leaves for a quick health scan.",
    type: "scan",
    difficulty: "easy",
    minLevel: 1,
    plotClasses: nanoAndUp,
    baseXp: 25,
    farmPoints: 10,
  },
  {
    id: "morning-water",
    title: "Morning Water",
    description: "Water one plant and log the care task before noon.",
    type: "care",
    difficulty: "easy",
    minLevel: 1,
    maxLevel: 6,
    plotClasses: nanoAndUp,
    baseXp: 20,
    farmPoints: 8,
  },
  {
    id: "sunlight-shift",
    title: "Sunlight Shift",
    description: "Rotate a pot or move one plant toward better light.",
    type: "care",
    difficulty: "easy",
    minLevel: 1,
    maxLevel: 8,
    plotClasses: ["nano", "micro"],
    baseXp: 15,
    farmPoints: 6,
  },
  {
    id: "zone-pulse",
    title: "Zone Pulse",
    description: "Open the map and check your local farming zone.",
    type: "map",
    difficulty: "easy",
    minLevel: 2,
    plotClasses: nanoAndUp,
    baseXp: 15,
    farmPoints: 5,
  },
  {
    id: "healthy-roots",
    title: "Healthy Roots",
    description: "Complete an AI scan and keep the plant health score above 75.",
    type: "health",
    difficulty: "medium",
    minLevel: 4,
    plotClasses: nanoAndUp,
    baseXp: 45,
    farmPoints: 18,
    healthGate: 75,
  },
  {
    id: "three-task-combo",
    title: "Three Task Combo",
    description: "Complete any three daily farming tasks today.",
    type: "care",
    difficulty: "medium",
    minLevel: 4,
    plotClasses: nanoAndUp,
    baseXp: 50,
    farmPoints: 20,
  },
  {
    id: "growth-proof",
    title: "Growth Proof",
    description: "Upload a progress photo that shows the current growth phase.",
    type: "milestone",
    difficulty: "medium",
    minLevel: 5,
    plotClasses: nanoAndUp,
    baseXp: 55,
    farmPoints: 22,
    plantDifficultyMultiplier: 1.4,
  },
  {
    id: "plant-scholar",
    title: "Plant Scholar",
    description: "Learn one care tip about your current crop and complete the quiz.",
    type: "learning",
    difficulty: "easy",
    minLevel: 3,
    plotClasses: nanoAndUp,
    baseXp: 25,
    farmPoints: 8,
  },
  {
    id: "balcony-master",
    title: "Balcony Master",
    description: "Keep one balcony or indoor plant above 85 health after a scan.",
    type: "health",
    difficulty: "hard",
    minLevel: 8,
    plotClasses: ["nano"],
    baseXp: 80,
    farmPoints: 32,
    healthGate: 85,
    plantDifficultyMultiplier: 1.6,
  },
  {
    id: "neighbor-nudge",
    title: "Neighbor Nudge",
    description: "Send encouragement to a nearby grower from the map.",
    type: "community",
    difficulty: "medium",
    minLevel: 6,
    plotClasses: nanoAndUp,
    baseXp: 35,
    farmPoints: 14,
  },
  {
    id: "flower-watch",
    title: "Flower Watch",
    description: "Scan a flowering or fruiting plant and log what changed.",
    type: "milestone",
    difficulty: "hard",
    minLevel: 9,
    plotClasses: ["micro", "macro"],
    baseXp: 90,
    farmPoints: 36,
    plantDifficultyMultiplier: 1.8,
  },
  {
    id: "quality-over-quantity",
    title: "Quality Over Quantity",
    description: "Keep your average plant health above 90 for today's scan.",
    type: "health",
    difficulty: "hard",
    minLevel: 12,
    plotClasses: nanoAndUp,
    baseXp: 100,
    farmPoints: 42,
    healthGate: 90,
    plantDifficultyMultiplier: 2,
  },
];

export function getQuestTitleForLevel(level: number): string {
  if (level >= 16) return "Local Legend";
  if (level >= 8) return "Cultivator";
  if (level >= 4) return "Rooted";
  return "Sprout";
}

function getTodayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

function getTomorrowIso(date = new Date()): string {
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}

function seededScore(seed: string): number {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

function isQuestEligible(quest: QuestDefinition, profile: QuestProfile): boolean {
  const isLevelReady = profile.level >= quest.minLevel;
  const isBelowCap = !quest.maxLevel || profile.level <= quest.maxLevel;
  const isPlotMatch = quest.plotClasses.includes(profile.plotClass);

  return isLevelReady && isBelowCap && isPlotMatch;
}

export function buildDailyQuests(profile: QuestProfile, date = new Date()): ActiveQuest[] {
  const todayKey = getTodayKey(date);
  const eligibleQuests = questPool
    .filter((quest) => isQuestEligible(quest, profile))
    .sort((a, b) => seededScore(`${todayKey}-${a.id}`) - seededScore(`${todayKey}-${b.id}`));

  return eligibleQuests.slice(0, 3).map((quest) => {
    const multiplier = quest.plantDifficultyMultiplier ?? 1;
    const healthFactor = Math.max(0.4, profile.averageHealthScore / 100);

    return {
      ...quest,
      instanceId: `${todayKey}-${quest.id}`,
      assignedAt: date.toISOString(),
      expiresAt: getTomorrowIso(date),
      rewardXp: Math.round(quest.baseXp * multiplier * healthFactor),
    };
  });
}
