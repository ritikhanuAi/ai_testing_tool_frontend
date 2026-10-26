import { TargetEnvironment, VerificationStatus } from "./api";

export interface WebsiteCreateRequest {
  name: string;
  base_url: string;
  environment: TargetEnvironment;
  allowed_domains: string[];
}

export interface WebsiteResponse {
  id: string;
  name: string;
  base_url: string;
  environment: TargetEnvironment;
  allowed_domains: string[];
  is_authorized: boolean;
  is_active: boolean;
  verification_token?: string;
  verification_status: VerificationStatus;
  verified_at?: string;
}

export interface WebsiteVerificationResponse {
  website_id: string;
  status: VerificationStatus;
  verified: boolean;
  message: string;
  verification_token?: string;
  dns_txt_instruction: string;
  http_file_instruction: string;
}

export interface CredentialCreateRequest {
  key_name: string;
  username?: string;
  secret: string;
  description?: string;
}

export interface CredentialResponse {
  id: string;
  website_id: string;
  key_name: string;
  username?: string;
  description?: string;
}
