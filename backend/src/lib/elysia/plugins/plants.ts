import { Elysia } from "elysia";
import { analyzePlantImage, type PlantScanInput } from "@/lib/openaiPlantAnalysis";

export const plantsPlugin = new Elysia({ prefix: "/plants" })
  .get("/", () => ({ message: "TODO: list user plants" }))
  .get("/:id", () => ({ message: "TODO: get plant detail" }))
  .post("/", () => ({ message: "TODO: add plant" }))
  .post("/scan", async ({ body, set }) => {
    try {
      const analysis = await analyzePlantImage(body as PlantScanInput);

      return {
        ok: true,
        analysis,
      };
    } catch (error) {
      set.status = 400;

      return {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Plant analysis failed unexpectedly.",
      };
    }
  })
  .put("/:id", () => ({ message: "TODO: update plant" }))
  .delete("/:id", () => ({ message: "TODO: delete plant" }));
