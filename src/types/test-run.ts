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
  include_sitemap_urls?: boolean;
  max_pages?: number;
  traversal_strategy?: TraversalStrategy;
  explore_button_navigations?: boolean;
  continue_on_incomplete_coverage?: boolean;
  per_page_time_budget_seconds?: number;
  exhaustive_interactions?: boolean;
  interaction_coverage_mode?: InteractionCoverageMode;
  interaction_categories?: InteractionCategory[];
  interaction_required_combinations?: Record<string, string>[];
  interaction_test_values?: string[];
  interaction_priority_order?: InteractionPriority[];
  include_action_order_permutations?: boolean;
  max_generated_cases?: number;
  use_ai_generation?: boolean;
  ai_test_goals?: string;
  max_ai_cases?: number;
  ai_explain_failures?: boolean;
}

export type InteractionPriority = "dropdown" | "search" | "navigation" | "button";
export type InteractionCoverageMode = "exhaustive" | "pairwise";
export type InteractionCategory = "dropdown" | "search" | "navigation" | "button" | "form";
export type TraversalStrategy = "bfs" | "dfs";

export interface QuickScanRequest {
  url: string;
  name?: string;
  credentials?: AuthenticationPayload;
  options?: AdvancedExecutionOptions;
}

/** Human test case mode request: `cases` is the YAML/JSON text of the test cases. */
export interface CustomScanRequest {
  url: string;
  name?: string;
  credentials?: AuthenticationPayload;
  options?: AdvancedExecutionOptions;
  cases: string;
}

export type TestCaseMode = "ai" | "human";

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
  run_name?: string | null;
  status: RunStatus;
  celery_task_id?: string;
  overall_score?: number | null;
  grade?: string;
  functional_score?: number | null;
  security_score?: number | null;
  performance_score?: number | null;
  accessibility_score?: number | null;
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

// --- Module Discovery Types ---

export interface DiscoverModulesRequest {
  url: string;
  credentials?: AuthenticationPayload;
}

export interface DiscoveredModule {
  name: string;
  url: string;
  suggested_goal: string;
  depth: number;
}

export interface DiscoverModulesResponse {
  modules: DiscoveredModule[];
  base_url: string;
  discovery_time_ms: number;
  total_discovered: number;
}

export type WizardModuleRow = DiscoveredModule & {
  selected: boolean;
  goal: string;
};

export type ModuleScanStatus = "pending" | "running" | "completed" | "incomplete" | "failed" | "cancelled";

export interface ModuleScanResult {
  moduleUrl: string;
  moduleName: string;
  runId: string | null;
  status: ModuleScanStatus;
  score?: number | null;
  grade?: string;
  errorMessage?: string;
}
