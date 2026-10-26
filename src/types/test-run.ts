import { RunStatus } from "./api";

export interface TriggerScanRequest {
  website_id: string;
  scan_profile_id?: string;
  test_pack_id?: string;
}

export interface TestRunResponse {
  id: string;
  website_id: string;
  scan_profile_id?: string;
  test_pack_id?: string;
  status: RunStatus;
  overall_score?: number;
  grade?: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
}
