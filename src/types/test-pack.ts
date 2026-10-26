export interface TestPackCreateRequest {
  website_id?: string;
  title: string;
  version?: string;
  raw_yaml: string;
}

export interface TestPackResponse {
  id: string;
  website_id?: string;
  title: string;
  version: string;
  raw_yaml: string;
  cases_count: number;
  is_valid: boolean;
  validation_errors: string[];
}

export interface TestPackValidationResponse {
  is_valid: boolean;
  cases_count: number;
  errors: string[];
}
