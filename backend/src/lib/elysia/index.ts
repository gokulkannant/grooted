import { Elysia } from "elysia";
import { healthPlugin } from "./plugins/health";
import { authPlugin } from "./plugins/auth";
import { plantsPlugin } from "./plugins/plants";
import { streaksPlugin } from "./plugins/streaks";
import { mapPlugin } from "./plugins/map";
import { leaderboardPlugin } from "./plugins/leaderboard";
import { usersPlugin } from "./plugins/users";

/**
 * Main Elysia application
 * Consolidates all API routes with type safety via Eden Treaty
 */
export const app = new Elysia({ prefix: "/api" })
  .get("/", () => ({ message: "Grooted API v1 — Powered by Elysia" }))

  // Health checks
  .use(healthPlugin)

  // Authentication
  .use(authPlugin)

  // Core features
  .use(usersPlugin)
  .use(plantsPlugin)
  .use(streaksPlugin)
  .use(mapPlugin)
  .use(leaderboardPlugin);

export type App = typeof app;
