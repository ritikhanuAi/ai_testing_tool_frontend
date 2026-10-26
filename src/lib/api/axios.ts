import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_CONFIG } from "./config";
import { ResponseEnvelope, ErrorEnvelope } from "@/types/api";

export const axiosClient = axios.create({
  baseURL: API_CONFIG.baseUrl,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Bearer JWT token if authenticated
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Standardize error envelopes & handle 401 session expiry
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ResponseEnvelope<unknown> | ErrorEnvelope>) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      localStorage.removeItem("auth_token");
    }

    const data = error.response?.data;
    let errorMessage = error.message;

    if (data) {
      if ("error" in data && data.error && typeof data.error === "object" && "message" in data.error) {
        errorMessage = data.error.message || errorMessage;
      } else if ("message" in data && typeof data.message === "string") {
        errorMessage = data.message || errorMessage;
      }
    }

    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosClient;
