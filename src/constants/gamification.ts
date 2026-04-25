export const points = {
  dailyLog: 25,
  aiScan: 10,
  plantAdded: 50,
  territoryClaim: 100,
} as const;

export const streakRules = {
  graceHours: 4,
  maxMissedDays: 1,
} as const;

export const seasonConfig = {
  durationDays: 30,
  leaderboardLimit: 100,
} as const;
