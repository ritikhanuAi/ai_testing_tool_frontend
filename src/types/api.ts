export interface ResponseEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ErrorDetail {
  code: string;
  message: string;
  details?: unknown;
}

export interface ErrorEnvelope {
  success: boolean;
  error: ErrorDetail;
}

export type PillarType = "functional" | "security" | "performance" | "accessibility";

export type RunStatus = "pending" | "queued" | "running" | "completed" | "failed" | "cancelled";

export type VerificationStatus = "pending" | "verified" | "suspended";

export type RiskLevel = "read_only" | "state_changing";

export type FindingSeverity = "critical" | "high" | "medium" | "low" | "info";

export type UserRole = "viewer" | "tester" | "admin";

export type TargetEnvironment = "local" | "test" | "staging" | "production";

export type BrowserType = "chromium" | "firefox" | "webkit";
