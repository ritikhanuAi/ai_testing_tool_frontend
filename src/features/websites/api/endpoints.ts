export const WEBSITE_ENDPOINTS = {
  LIST: "/websites",
  CREATE: "/websites",
  DETAIL: (id: string) => `/websites/${id}`,
  VERIFY: (id: string) => `/websites/${id}/verify`,
  CREDENTIALS: (id: string) => `/websites/${id}/credentials`,
} as const;
