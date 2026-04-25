export type StreakLog = {
  id: string;
  plantId?: string;
  loggedAt: string;
  mediaUrl?: string;
  note?: string;
};

export type StreakStats = {
  current: number;
  longest: number;
  lastLoggedAt?: string;
};
