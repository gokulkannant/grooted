export type Badge = {
  id: string;
  label: string;
  unlockedAt: string;
};

export type User = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
};

export type Profile = User & {
  badges: Badge[];
  level: number;
  farmPoints: number;
};
