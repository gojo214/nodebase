"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const trpc = useTRPC();
  const [message, setMessage] = useState<String>("");
  const testAi = useMutation(
    trpc.generateText.mutationOptions({
      onSuccess: ({ message, }) => {
        setMessage(message);
        toast.success("AI job queued");
      },
    })
  );
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
      <div>{JSON.stringify(message, null, 2)}</div>

      <Button
        disabled={testAi.isPending}
        onClick={() => testAi.mutate({ prompt: "what is 2+2?" })}
      >
        test AI
      </Button>
    </div>
  );
}