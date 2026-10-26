export interface ScanProfileCreateRequest {
  name: string;
  description?: string;
  check_functional: boolean;
  check_security: boolean;
  check_performance: boolean;
  check_accessibility: boolean;
  allow_state_changing: boolean;
  rate_limit: number; // 1 to 50
  timeout_seconds: number; // 30 to 1800
}

export interface ScanProfileResponse {
  id: string;
  name: string;
  description?: string;
  check_functional: boolean;
  check_security: boolean;
  check_performance: boolean;
  check_accessibility: boolean;
  allow_state_changing: boolean;
  rate_limit: number;
  timeout_seconds: number;
}
