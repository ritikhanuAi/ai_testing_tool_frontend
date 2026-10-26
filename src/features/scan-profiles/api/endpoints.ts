export const SCAN_PROFILE_ENDPOINTS = {
  LIST: "/scan-profiles",
  CREATE: "/scan-profiles",
  DETAIL: (id: string) => `/scan-profiles/${id}`,
} as const;
