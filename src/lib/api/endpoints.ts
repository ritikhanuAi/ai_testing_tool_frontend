/**
 * Centralized registry of backend REST API endpoint paths organized by feature/app domain.
 */

export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  ME: "/auth/me",
} as const;

export const WEBSITE_ENDPOINTS = {
  LIST: "/websites",
  CREATE: "/websites",
  DETAIL: (id: string) => `/websites/${id}`,
  VERIFY: (id: string) => `/websites/${id}/verify`,
  CREDENTIALS: (id: string) => `/websites/${id}/credentials`,
} as const;

export const SCAN_PROFILE_ENDPOINTS = {
  LIST: "/scan-profiles",
  CREATE: "/scan-profiles",
  DETAIL: (id: string) => `/scan-profiles/${id}`,
} as const;

export const TEST_PACK_ENDPOINTS = {
  LIST: "/test-packs",
  CREATE: "/test-packs",
  DETAIL: (id: string) => `/test-packs/${id}`,
  VALIDATE: "/test-packs/validate",
} as const;

export const TEST_RUN_ENDPOINTS = {
  LIST: "/test-runs",
  TRIGGER: "/test-runs",
  DETAIL: (id: string) => `/test-runs/${id}`,
  CANCEL: (id: string) => `/test-runs/${id}/cancel`,
} as const;

export const REPORT_ENDPOINTS = {
  DETAIL: (runId: string) => `/reports/${runId}`,
} as const;

export const DASHBOARD_ENDPOINTS = {
  SUMMARY: "/dashboard/summary",
  RECENT_ACTIVITY: "/dashboard/recent-activity",
} as const;
