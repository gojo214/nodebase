import prisma from "@/lib/db";
import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

export const generativeText = inngest.createFunction(
  { id: "generate-text", retries: 3 },
  { event: "ai/generate-text" },
  async ({ event, step }) => {
    const { userPrompt } = event.data as { userPrompt: string };

    if (!userPrompt || userPrompt.trim().length === 0) {
      throw new Error("User prompt cannot be empty");
    }

    try {
      // Generate text using Google's Gemini model
      const { text } = await step.ai.wrap(
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
          prompt: userPrompt,
        }
      );

      console.log(
        "Generated text successfully:",
        text.substring(0, 100) + "..."
      );

      return {
        success: true,
        generatedText: text,
        tokenCount: text.split(" ").length,
      };
    } catch (error) {
      console.error("Failed to generate text:", error);
      throw error;
    }
  }
);
