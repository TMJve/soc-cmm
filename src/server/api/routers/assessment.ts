// src/server/api/routers/assessment.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// NEW: Define the shape of the expected response from the Ollama API
type OllamaResponse = {
  response: string;
  // Ollama sends other properties, but we only care about this one
};

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
        subdomains: z.record(z.object({
          name: z.string(),
          score: z.number(),
        })),
      })
    )
    .mutation(async ({ input }) => {
      const { domainName, score, subdomains } = input;

      const scoreSummary = Object.values(subdomains)
        .map(sub => `- ${sub.name}: ${sub.score.toFixed(2)}`)
        .join('\n');

      const prompt = `
        You are a world-class cybersecurity consultant providing strategic advice to improve a Security Operations Center (SOC).

        A user has just completed a SOC-CMM assessment. Here are their results for the "${domainName}" domain:
        - Overall Domain Score: ${score.toFixed(2)} / 5.00
        - Subdomain Scores:
        ${scoreSummary}

        Based ONLY on these scores, analyze their performance. Identify the lowest-scoring subdomains as the highest-priority areas for improvement.

        Provide a prioritized and actionable roadmap. Be specific, professional, and practical. Structure your response into three clear sections:
        1.  **Next 1 Month (Immediate Actions):** Focus on foundational, quick wins.
        2.  **Next Quarter (Strategic Initiatives):** Focus on broader process improvements.
        3.  **Next 6-12 Months (Long-Term Goals):** Focus on mature capabilities and optimization.
      `;

      try {
        const response = await fetch('http://localhost:11434/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama3.1',
            prompt: prompt,
            stream: false,
          }),
        });

        if (!response.ok) {
          throw new Error(`Ollama API responded with status ${response.status}`);
        }

        // FIX: Use a type assertion to tell TypeScript the shape of the data
        const data = await response.json() as OllamaResponse;
        
        return data.response; // This is now type-safe

      } catch (error) {
        console.error("Ollama request failed:", error);
        throw new Error("Failed to get AI recommendations from local Ollama instance.");
      }
    }),
});