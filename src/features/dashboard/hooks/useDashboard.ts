import { useQuery } from "@tanstack/react-query";
import * as dashboardService from "../api/dashboardService";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: dashboardService.getDashboardSummary,
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ["recent-activity"],
    queryFn: dashboardService.getRecentActivity,
  });
}
