import { useQuery } from "@tanstack/react-query";
import { getAnalyticsSummary } from "../services/analyticsService";

export function useAnalyticsSummary(days = 14) {
  return useQuery({
    queryKey: ["analytics", "summary", days],
    queryFn: async () => (await getAnalyticsSummary(days)).data,

  });
}