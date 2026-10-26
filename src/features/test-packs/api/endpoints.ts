export const TEST_PACK_ENDPOINTS = {
  LIST: "/test-packs",
  CREATE: "/test-packs",
  DETAIL: (id: string) => `/test-packs/${id}`,
  VALIDATE: "/test-packs/validate",
} as const;
