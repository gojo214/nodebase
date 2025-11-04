import Client from "@/components/client";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Home() {
  const queryClient = getQueryClient();
  
  void queryClient.prefetchQuery(trpc.getUsers.queryOptions());
  return (
   <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Client/>
      </HydrationBoundary>
   </div>
  );
}
