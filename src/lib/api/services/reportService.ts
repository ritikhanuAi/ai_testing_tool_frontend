import { axiosClient } from "../axios";
import { API_CONFIG } from "../config";
import { REPORT_ENDPOINTS } from "../endpoints";
import { mockStore } from "@/lib/mock/store";
import { ResponseEnvelope } from "@/types/api";
import { ReportSummaryResponse } from "@/types/report";

export async function getReport(runId: string): Promise<ReportSummaryResponse> {
  if (API_CONFIG.useMock) {
    const report = await mockStore.getReport(runId);
    if (!report) throw new Error("Report not found");
    return report;
  }
  const res = await axiosClient.get<ResponseEnvelope<ReportSummaryResponse>>(
    REPORT_ENDPOINTS.DETAIL(runId)
  );
  return res.data.data;
}
