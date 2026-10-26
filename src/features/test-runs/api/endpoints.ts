export const TEST_RUN_ENDPOINTS = {
  LIST: "/test-runs",
  TRIGGER: "/test-runs",
  DETAIL: (id: string) => `/test-runs/${id}`,
  CANCEL: (id: string) => `/test-runs/${id}/cancel`,
} as const;
