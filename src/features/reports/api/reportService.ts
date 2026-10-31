import { axiosClient } from "@/lib/api/axios";
import { API_CONFIG } from "@/lib/api/config";
import { REPORT_ENDPOINTS } from "./endpoints";
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

/** Download the report as an Excel (.xlsx) file in the browser. */
export async function downloadReportExcel(runId: string): Promise<void> {
  if (API_CONFIG.useMock) {
    throw new Error("Excel export needs the live backend (mock mode is on).");
  }
  const res = await axiosClient.get<Blob>(REPORT_ENDPOINTS.EXPORT_EXCEL(runId), {
    responseType: "blob",
    timeout: 120000,
  });
  const url = URL.createObjectURL(res.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = `report-${runId}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
