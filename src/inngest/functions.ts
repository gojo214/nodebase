import prisma from "@/lib/db";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import * as Sentry from "@sentry/nextjs";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const helloWorld = inngest.createFunction(
  { id: "execute-ai", retries: 3 },
  { event: "execute/ai" },
  async ({ step }) => {
    Sentry.logger.info("User triggered test log", { log_source: "Sentry_test" })
    try {
      // Generate text using Google's Gemini model
      const { steps } = await step.ai.wrap(
        "gemini-generate-text",
        generateText,
        {
          model: google("gemini-2.5-flash"),
          system: `You are a helpful AI assistant. Provide clear, concise, and accurate responses.
        
            Guidelines:
            - Be professional and friendly
            - Structure your response clearly 
            - Provide examples when helpful
            - Ask clarifying questions if needed`,
          prompt: "what is 2 + 2?",
          experimental_telemetry: {
            isEnabled: true,
            recordInputs: true,
            recordOutputs: true,
          },
        }
      );

      console.log("Generated text successfully:", steps);

      return {
        success: true,
        steps,
      };
    } catch (error) {
      console.error("Failed to generate text:", error);
      throw error;
    }
  }
);
