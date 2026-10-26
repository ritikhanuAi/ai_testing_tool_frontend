export const REPORT_ENDPOINTS = {
  DETAIL: (runId: string) => `/reports/${runId}`,
} as const;
