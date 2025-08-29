// src/server/api/routers/assessment.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const assessmentRouter = createTRPCRouter({
  submitAnswers: publicProcedure
    .input(
      // Use z.record and z.any() for flexibility on the backend
      z.object({
        answers: z.record(z.any()), 
      })
    )
    // FIX: Remove '_ctx' from the parameters
    .mutation(async ({ input }) => { 
      // TODO: Save to DB when ready
      console.log("Received answers:", input.answers);
      return { success: true };
    }),
});