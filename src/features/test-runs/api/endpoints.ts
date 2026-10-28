export const TEST_RUN_ENDPOINTS = {
  LIST: "/test-runs",
  TRIGGER: "/test-runs",
  QUICK_SCAN: "/test-runs/quick-scan",
  ANALYZE_URL: "/test-runs/analyze-url",
  DETAIL: (id: string) => `/test-runs/${id}`,
  CANCEL: (id: string) => `/test-runs/${id}/cancel`,
} as const;
