import { createTRPCRouter } from "~/server/api/trpc";
import { assessmentRouter } from "~/server/api/routers/assessment";

/**
 * This is the main tRPC router for the server.
 */
export const appRouter = createTRPCRouter({
  assessment: assessmentRouter,
});

/**
 * Export type definition of API
 */
export type AppRouter = typeof appRouter;
