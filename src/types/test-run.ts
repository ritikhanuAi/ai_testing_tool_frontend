import { RunStatus } from "./api";

export interface AuthenticationPayload {
  enabled: boolean;
  login_url?: string;
  username?: string;
  password?: string;
  auth_method?: "form" | "basic_auth" | "storage_state";
  success_indicator?: string;
}

export interface AdvancedExecutionOptions {
  check_functional?: boolean;
  check_security?: boolean;
  check_performance?: boolean;
  check_accessibility?: boolean;
  browser_type?: "chromium" | "firefox" | "webkit";
  viewport_width?: number;
  viewport_height?: number;
  is_mobile?: boolean;
  record_trace?: boolean;
  record_video?: boolean;
  headless?: boolean;
  slow_mo_ms?: number;
  allow_state_changing?: boolean;
  rate_limit_rps?: number;
  timeout_seconds?: number;
  max_crawl_depth?: number;
  use_ai_generation?: boolean;
  ai_test_goals?: string;
  max_ai_cases?: number;
  ai_explain_failures?: boolean;
}

export interface QuickScanRequest {
  url: string;
  name?: string;
  credentials?: AuthenticationPayload;
  options?: AdvancedExecutionOptions;
}

export interface TriggerScanRequest {
  website_id: string;
  scan_profile_id?: string;
  test_pack_id?: string;
  advanced_options?: AdvancedExecutionOptions;
}

export interface TestRunResponse {
  id: string;
  website_id: string;
  scan_profile_id?: string;
  test_pack_id?: string;
  status: RunStatus;
  celery_task_id?: string;
  overall_score?: number;
  grade?: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
}

export interface CredentialRequirementInfo {
  required: boolean;
  auth_method: string;
  detected_login_url?: string | null;
  detected_fields: string[];
  guidance: string;
}

export interface WebsiteAnalyzeResponse {
  url: string;
  hostname: string;
  accessible: boolean;
  status_code?: number | null;
  response_time_ms?: number | null;
  page_title?: string | null;
  is_public_website: boolean;
  needs_credentials: boolean;
  credentials_requirement: CredentialRequirementInfo;
  recommended_options: AdvancedExecutionOptions;
  ready_quick_scan_payload: QuickScanRequest;
}

export interface RunLogEntry {
  timestamp: string;
  level: 'INFO' | 'WARNING' | 'ERROR';
  stage: string;
  message: string;
  progress: number;
}

export interface RunLogsResponse {
  run_id: string;
  stage: string;
  progress: number;
  message: string;
  updated_at?: string | null;
  logs_count: number;
  logs: RunLogEntry[];
}
