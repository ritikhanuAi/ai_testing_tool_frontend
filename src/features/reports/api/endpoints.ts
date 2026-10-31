export const REPORT_ENDPOINTS = {
  DETAIL: (runId: string) => `/reports/${runId}`,
  EXPORT_EXCEL: (runId: string) => `/reports/${runId}/export.xlsx`,
} as const;
