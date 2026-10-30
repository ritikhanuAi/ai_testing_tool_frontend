import { PillarType, FindingSeverity } from "./api";

export interface PillarFinding {
  id: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  evidence_path?: string;
  selector_or_url?: string;
  suggested_fix?: string;
  fingerprint: string;
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
  step_number: number;
  action: string;
  target?: string;
  value?: string;
  status: "PASSED" | "FAILED";
  duration_ms?: number;
  error?: string;
}

export interface ExecutedTestCase {
  id: string;
  title: string;
  description?: string;
  steps: TestCaseStepResult[];
  status: "PASSED" | "FAILED";
  assertions_passed?: number;
  assertions_total?: number;
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
