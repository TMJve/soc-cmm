// src/server/api/routers/assessment.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const assessmentRouter = createTRPCRouter({
  submitAnswers: publicProcedure
    .input(
      z.object({
        answers: z.record(z.any()), 
      })
    )
    .mutation(async ({ input }) => { 
      // TODO: Save to DB when ready
      console.log("Received answers:", input.answers);
      return { success: true };
    }),

  getRecommendations: publicProcedure
    .input(
      z.object({
        domainName: z.string(),
        score: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In the future, this is where the real AI/RAG logic will go.
      // For now, return mocked, placeholder recommendations.
      if (input.score < 2) {
        return `For the ${input.domainName} domain, a score of ${input.score.toFixed(2)} is critical.\n- Next 1 Month: Immediately review all processes and personnel training.\n- Next Quarter: Implement a foundational improvement plan.\n- Next 6 Months: Invest in new tooling and advanced training.`;
      }
      if (input.score < 3.5) {
        return `For the ${input.domainName} domain, a score of ${input.score.toFixed(2)} indicates areas for improvement.\n- Next 1 Month: Identify and document the top 3 weaknesses.\n- Next Quarter: Run targeted workshops to address these gaps.\n- Next 6 Months: Review and optimize the relevant processes.`;
      }
      return `For the ${input.domainName} domain, a score of ${input.score.toFixed(2)} is strong.\n- Next 1 Month: Solidify documentation for all current processes.\n- Next Quarter: Explore automation opportunities for existing workflows.\n- Next 6 Months: Conduct a review to ensure continued alignment with business goals.`;
    }),
});