import prisma from "@/lib/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world", retries: 3 },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    //Fetching the video
    await step.sleep("fetching", "2s");

    //Transcribing
    await step.sleep("Transcribing", "2s");

    //Sending transcription to AI
    await step.sleep("sending to ai", "2s");

    await step.run("create-workflow",async () => {
        return await prisma.workflow.create({
            data: {
                name: "workflow-from-inngest",
            }
        })
    })
  }
);
