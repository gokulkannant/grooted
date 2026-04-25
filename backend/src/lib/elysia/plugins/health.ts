import { Elysia } from "elysia";

export const healthPlugin = new Elysia({ prefix: "/health" }).get("/", () => ({
  status: "ok",
  service: "grooted-backend",
  timestamp: new Date().toISOString(),
}));
