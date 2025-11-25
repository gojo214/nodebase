import { z } from "zod";
import { createTRPCRouter, premiumProcedure } from "../init";
import prisma from "@/lib/db";
import { inngest } from "@/inngest/client";

export const appRouter = createTRPCRouter({
  testAi: premiumProcedure.mutation(async () => {
    await inngest.send({
      name: "execute/ai",
    });
    return {
      success: true,
      message: "AI job queued",
    };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
