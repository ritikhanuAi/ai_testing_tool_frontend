import { PillarType, FindingSeverity } from "./api";

export interface PillarFinding {
  id: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  evidence_path?: string;
  selector_or_url?: string;
  suggested_fix?: string;
  fingerprint?: string; // not always sent by the backend
}

export interface PillarScanResult {
  pillar: PillarType;
  score: number;
  status: "PASSED" | "WARNING" | "FAILED" | "SKIPPED";
  findings: PillarFinding[];
  metrics: Record<string, unknown>;
  duration_sec: number;
}

export interface TestCaseStepResult {
  action: string;
  target?: string | null;
  value?: string | null;
  status: "PASSED" | "FAILED" | "BLOCKED";
  expected?: string;
  actual?: string;
  error?: string;
}

export interface InteractionMatrixFactor {
  id: string;
  label: string;
  kind: string;
  values: string[];
  setup_actions?: string[];
}

export interface InteractionMatrixPage {
  page_url: string;
  mode: string;
  factors_discovered: number;
  factors?: InteractionMatrixFactor[];
  planned_cases: number;
  executed_cases: number;
  passed_cases: number;
  failed_cases: number;
  blocked_cases: number;
  pending_cases: number;
  case_limit: number;
  limit_exceeded: boolean;
  action_order_permutations: boolean;
  priority_order?: Array<"dropdown" | "search" | "navigation" | "button">;
  complete: boolean;
  discovery_complete?: boolean;
  interruption_reason?: string | null;
  discovery_errors?: string[];
  unsupported_controls?: Array<{ label: string; reason: string }>;
  dynamic_controls?: Array<{ selector: string; role?: string; label?: string; reason: string }>;
  dynamic_controls_discovered?: Array<{ selector: string; label?: string; trigger?: string }>;
  linked_routes_discovered?: string[];
}

export interface ExecutedTestCase {
  id: string;
  title: string;
  module?: string;
  test_type?: string;
  test_scenario?: string;
  expected_result?: string;
  actual_result?: string;
  page_url?: string;
  pillar?: string;
  risk?: string;
  steps: TestCaseStepResult[];
  assertions_count?: number;
  passed: boolean;
  status?: "PASSED" | "FAILED" | "BLOCKED";
  coverage_mode?: string;
  combination?: Record<string, string>;
  action_order?: string[];
  evidence_path?: string;
}

export interface UnifiedReportData {
  run_id: string;
  target_url: string;
  overall_score: number;
  grade: string;
  passed: boolean;
  pillar_results: Record<string, PillarScanResult>;
  total_findings: number;
  findings_by_severity: Record<string, number>;
  all_findings: PillarFinding[];
  effective_pillar_weights?: Record<string, number>;
  test_cases?: ExecutedTestCase[];
  artifacts?: Record<string, string>;
  reported_findings?: number;
  findings_truncated?: boolean;
  score_method?: string;
  /** "human" = human-written test pack, no AI used; "ai" = AI wrote the test cases. Missing on older reports. */
  test_case_mode?: "human" | "ai";
  ai_used?: boolean;
  incomplete?: boolean;
  incomplete_reason?: string;
}

export interface ReportSummaryResponse {
  id: string;
  test_run_id: string;
  overall_score: number;
  grade: string;
  passed: boolean;
  functional_score: number;
  security_score: number;
  performance_score: number;
  accessibility_score: number;
  total_findings: number;
  critical_findings: number;
  high_findings: number;
  report_data: UnifiedReportData;
}
