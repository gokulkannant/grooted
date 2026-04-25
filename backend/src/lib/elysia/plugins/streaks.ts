import { Elysia } from "elysia";

export const streaksPlugin = new Elysia({ prefix: "/streaks" })
  .get("/", () => ({ message: "TODO: get streak stats" }))
  .post("/log", () => ({ message: "TODO: submit daily log (photo/video)" }))
  .get("/history", () => ({ message: "TODO: get streak history" }))
  .get("/calendar", () => ({ message: "TODO: get streak calendar" }));
