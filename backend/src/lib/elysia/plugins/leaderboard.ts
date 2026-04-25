import { Elysia } from "elysia";

export const leaderboardPlugin = new Elysia({ prefix: "/leaderboard" })
  .get("/", () => ({ message: "TODO: get global leaderboard" }))
  .get("/local", () => ({ message: "TODO: get local territory leaderboard" }))
  .get("/season", () => ({ message: "TODO: get current season info" }))
  .get("/badges", () => ({ message: "TODO: get legacy badges" }));
