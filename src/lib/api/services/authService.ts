import { axiosClient } from "../axios";
import { API_CONFIG } from "../config";
import { AUTH_ENDPOINTS } from "../endpoints";
import { ResponseEnvelope } from "@/types/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  if (API_CONFIG.useMock) {
    const mockToken = `mock-token-${Date.now()}`;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", mockToken);
    }
    return {
      access_token: mockToken,
      token_type: "bearer",
      user: {
        id: "usr-mock-01",
        email: credentials.email,
        role: "admin",
      },
    };
  }

  const res = await axiosClient.post<ResponseEnvelope<AuthResponse>>(
    AUTH_ENDPOINTS.LOGIN,
    credentials
  );
  if (res.data.data?.access_token && typeof window !== "undefined") {
    localStorage.setItem("auth_token", res.data.data.access_token);
  }
  return res.data.data;
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
}

export function getStoredToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

export function isAuthenticated(): boolean {
  return !!getStoredToken();
}
