import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const assessmentRouter = createTRPCRouter({
  submitAnswers: publicProcedure
    .input(
      z.array(
        z.object({
          questionId: z.string(),
          domain: z.string(),
          score: z.number().min(0).max(5),
        })
      )
    )
    .mutation(async ({ input, ctx }) => {
      // TODO: Save to DB when ready
      console.log("Received answers:", input);
      return { success: true };
    }),
});
