export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  storageUrl: process.env.NEXT_PUBLIC_STORAGE_URL || "http://localhost:8000/storage",
  useMock: process.env.NEXT_PUBLIC_USE_MOCK !== "false", // defaults to true
};
