import { useQuery } from "@tanstack/react-query";
import { fetchBots, type BotsListResponse } from "@/lib/api";

export function useBots() {
  return useQuery<BotsListResponse>({
    queryKey: ["bots"],
    queryFn: fetchBots,
    refetchInterval: 5000,
    retry: 3,
    staleTime: 4000,
  });
}
