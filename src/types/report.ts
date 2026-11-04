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
  status: "PASSED" | "FAILED";
  error?: string;
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
