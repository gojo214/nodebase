import { z } from 'zod';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import prisma from '@/lib/db';
import { inngest } from '@/inngest/client';

export const appRouter = createTRPCRouter({
  generateText: protectedProcedure
    .input(z.object({
      prompt: z.string().min(1, "Prompt cannot be empty").max(2000, "Prompt too long"),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        // Send event to Inngest to trigger the generative-text function
        const response = await inngest.send({
          name: "ai/generate-text",
          data: {
            userPrompt: input.prompt,
            userId: ctx.auth.user.id,
            timestamp: new Date(),
          }
        });

        console.log("Text generation job queued:", response);
        return { 
          success: true, 
          message: "Text generation queued",
          jobId: response.ids?.[0]
        };
      } catch (error) {
        console.error("Failed to queue text generation:", error);
        throw error;
      }
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;