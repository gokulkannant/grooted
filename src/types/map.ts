export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Territory = {
  id: string;
  ownerId: string;
  name: string;
  center: Coordinates;
  radiusMeters: number;
  points: number;
};

export type FarmZone = Territory & {
  rank: number;
};

export type SeedDrop = {
  id: string;
  location: Coordinates;
  expiresAt: string;
  rewardPoints: number;
};
