import { Elysia } from "elysia";

export const usersPlugin = new Elysia({ prefix: "/users" })
  .get("/me", () => ({ message: "TODO: get current user profile" }))
  .put("/me", () => ({ message: "TODO: update profile" }))
  .get("/me/stats", () => ({ message: "TODO: get user stats (FP, rank, etc.)" }))
  .get("/:id", () => ({ message: "TODO: get public user profile" }));
