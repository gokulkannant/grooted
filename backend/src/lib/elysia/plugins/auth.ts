import { Elysia } from "elysia";

export const authPlugin = new Elysia({ prefix: "/auth" })
  .post("/login", () => ({ message: "TODO: implement login" }))
  .post("/register", () => ({ message: "TODO: implement register" }))
  .post("/refresh", () => ({ message: "TODO: implement token refresh" }))
  .post("/logout", () => ({ message: "TODO: implement logout" }));
