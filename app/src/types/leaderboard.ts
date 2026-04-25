export type Season = {
  id: string;
  name: string;
  startsAt: string;
  endsAt: string;
};

export type Ranking = {
  userId: string;
  displayName: string;
  rank: number;
  points: number;
};

export type FarmPoints = {
  total: number;
  season: number;
};
