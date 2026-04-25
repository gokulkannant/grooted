import { app } from "@/lib/elysia";

/**
 * Catch-all route for Elysia API
 * All HTTP methods routed through the Elysia app
 *
 * Following ElysiaJS Next.js integration:
 * https://elysiajs.com/integrations/nextjs.html
 */

export type App = typeof app;

export const GET = app.fetch;
export const POST = app.fetch;
export const PUT = app.fetch;
export const PATCH = app.fetch;
export const DELETE = app.fetch;
export const OPTIONS = app.fetch;
