import { useQuery } from "@tanstack/react-query";
import * as reportService from "../api/reportService";

export function useReportSummary(runId: string) {
  return useQuery({
    queryKey: ["report", runId],
    queryFn: () => reportService.getReport(runId),
    enabled: !!runId,
  });
}
