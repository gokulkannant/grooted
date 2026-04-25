import { Elysia } from "elysia";

export const mapPlugin = new Elysia({ prefix: "/map" })
  .get("/territory", () => ({ message: "TODO: get territory map data" }))
  .get("/zones", () => ({ message: "TODO: get farm zones in radius" }))
  .get("/seed-drops", () => ({ message: "TODO: get active seed drops" }))
  .get("/green-zones", () => ({ message: "TODO: get partner green zones" }))
  .post("/claim", () => ({ message: "TODO: claim seed drop" }));
