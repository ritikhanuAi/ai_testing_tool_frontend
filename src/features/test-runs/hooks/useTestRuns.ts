import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as testRunService from "../api/testRunService";
import {
  TriggerScanRequest,
  TestRunResponse,
  QuickScanRequest,
  WebsiteAnalyzeResponse,
} from "@/types/test-run";

export function useTestRuns() {
  return useQuery({
    queryKey: ["test-runs"],
    queryFn: testRunService.getTestRuns,
  });
}

export function useTestRun(id: string) {
  return useQuery({
    queryKey: ["test-run", id],
    queryFn: () => testRunService.getTestRun(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data as TestRunResponse | undefined;
      if (data && (data.status === "pending" || data.status === "running" || data.status === "queued")) {
        return 2000;
      }
      return false;
    },
  });
}

export function useTriggerScan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: TriggerScanRequest) => testRunService.triggerScan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-runs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["recent-activity"] });
    },
  });
}

export function useQuickScan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: QuickScanRequest) => testRunService.quickScan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-runs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["recent-activity"] });
      queryClient.invalidateQueries({ queryKey: ["websites"] });
    },
  });
}

export function useAnalyzeUrl() {
  return useMutation({
    mutationFn: (url: string) => testRunService.analyzeUrl(url),
  });
}

export function useCancelScan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => testRunService.cancelScan(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["test-runs"] });
      queryClient.invalidateQueries({ queryKey: ["test-run", id] });
    },
  });
}
