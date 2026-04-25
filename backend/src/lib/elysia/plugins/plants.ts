import { Elysia } from "elysia";

export const plantsPlugin = new Elysia({ prefix: "/plants" })
  .get("/", () => ({ message: "TODO: list user plants" }))
  .get("/:id", () => ({ message: "TODO: get plant detail" }))
  .post("/", () => ({ message: "TODO: add plant" }))
  .post("/scan", () => ({ message: "TODO: AI plant scan" }))
  .put("/:id", () => ({ message: "TODO: update plant" }))
  .delete("/:id", () => ({ message: "TODO: delete plant" }));
