// src/server/api/root.ts

// The first import now also includes 'createCallerFactory'
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { assessmentRouter } from "~/server/api/routers/assessment";

/**
 * This is the main router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  assessment: assessmentRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const a = createCaller(createContext);
 * const res = await a.post.all();
 * ^? Post[]
 */
// This is the line that was missing
export const createCaller = createCallerFactory(appRouter);