import * as yaml from "js-yaml";
import {
  INITIAL_WEBSITES,
  INITIAL_SCAN_PROFILES,
  INITIAL_TEST_PACKS,
  INITIAL_TEST_RUNS,
  INITIAL_REPORTS,
} from "./fixtures";
import { WebsiteResponse, WebsiteCreateRequest, WebsiteVerificationResponse, CredentialCreateRequest, CredentialResponse } from "@/types/website";
import { ScanProfileResponse, ScanProfileCreateRequest } from "@/types/scan-profile";
import { TestPackResponse, TestPackCreateRequest, TestPackValidationResponse } from "@/types/test-pack";
import { TestRunResponse, TriggerScanRequest } from "@/types/test-run";
import { ReportSummaryResponse } from "@/types/report";
import { DashboardSummaryResponse, RecentActivityItem } from "@/types/dashboard";

class MockStore {
  private websites: WebsiteResponse[] = [...INITIAL_WEBSITES];
  private scanProfiles: ScanProfileResponse[] = [...INITIAL_SCAN_PROFILES];
  private testPacks: TestPackResponse[] = [...INITIAL_TEST_PACKS];
  private testRuns: TestRunResponse[] = [...INITIAL_TEST_RUNS];
  private reports: Record<string, ReportSummaryResponse> = { ...INITIAL_REPORTS };
  private credentials: Record<string, CredentialResponse[]> = {};

  // Artificial delay to simulate realistic async network roundtrips
  private async delay(ms: number = 250): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // --- WEBSITES ---
  async getWebsites(): Promise<WebsiteResponse[]> {
    await this.delay();
    return [...this.websites];
  }

  async getWebsite(id: string): Promise<WebsiteResponse | null> {
    await this.delay();
    return this.websites.find((w) => w.id === id) || null;
  }

  async createWebsite(data: WebsiteCreateRequest): Promise<WebsiteResponse> {
    await this.delay();
    const newSite: WebsiteResponse = {
      id: `web-${Date.now().toString(36)}`,
      name: data.name,
      base_url: data.base_url,
      environment: data.environment,
      allowed_domains: data.allowed_domains.length > 0 ? data.allowed_domains : [new URL(data.base_url).hostname],
      is_authorized: false,
      is_active: true,
      verification_status: "pending",
      verification_token: `ai-verify-${Math.random().toString(36).substring(2, 10)}`,
    };
    this.websites.unshift(newSite);
    return newSite;
  }

  async verifyWebsite(id: string): Promise<WebsiteVerificationResponse> {
    await this.delay(400);
    const site = this.websites.find((w) => w.id === id);
    if (!site) {
      throw new Error("Website not found");
    }

    site.verification_status = "verified";
    site.is_authorized = true;
    site.verified_at = new Date().toISOString();

    return {
      website_id: id,
      status: "verified",
      verified: true,
      message: "Domain ownership verified successfully via DNS TXT record.",
      verification_token: site.verification_token,
      dns_txt_instruction: `Add TXT record at _ai-testing.${new URL(site.base_url).hostname} with value: ai-testing-verify=${site.verification_token}`,
      http_file_instruction: `Upload verification file to ${site.base_url}/.well-known/ai-testing-token.txt with token content.`,
    };
  }

  async addCredential(websiteId: string, data: CredentialCreateRequest): Promise<CredentialResponse> {
    await this.delay();
    const cred: CredentialResponse = {
      id: `cred-${Date.now().toString(36)}`,
      website_id: websiteId,
      key_name: data.key_name,
      username: data.username,
      description: data.description,
    };
    if (!this.credentials[websiteId]) {
      this.credentials[websiteId] = [];
    }
    this.credentials[websiteId].push(cred);
    return cred;
  }

  // --- SCAN PROFILES ---
  async getScanProfiles(): Promise<ScanProfileResponse[]> {
    await this.delay();
    return [...this.scanProfiles];
  }

  async getScanProfile(id: string): Promise<ScanProfileResponse | null> {
    await this.delay();
    return this.scanProfiles.find((p) => p.id === id) || null;
  }

  async createScanProfile(data: ScanProfileCreateRequest): Promise<ScanProfileResponse> {
    await this.delay();
    const newProf: ScanProfileResponse = {
      id: `prof-${Date.now().toString(36)}`,
      name: data.name,
      description: data.description,
      check_functional: data.check_functional,
      check_security: data.check_security,
      check_performance: data.check_performance,
      check_accessibility: data.check_accessibility,
      allow_state_changing: data.allow_state_changing,
      rate_limit: data.rate_limit,
      timeout_seconds: data.timeout_seconds,
    };
    this.scanProfiles.push(newProf);
    return newProf;
  }

  // --- TEST PACKS ---
  async getTestPacks(): Promise<TestPackResponse[]> {
    await this.delay();
    return [...this.testPacks];
  }

  async getTestPack(id: string): Promise<TestPackResponse | null> {
    await this.delay();
    return this.testPacks.find((p) => p.id === id) || null;
  }

  validateRawYaml(rawYaml: string): TestPackValidationResponse {
    try {
      const parsed = yaml.load(rawYaml) as Record<string, unknown> | null;
      if (!parsed || typeof parsed !== "object") {
        return { is_valid: false, cases_count: 0, errors: ["YAML document is empty or not an object."] };
      }
      const testCases = parsed.test_cases;
      if (!testCases || !Array.isArray(testCases)) {
        return { is_valid: false, cases_count: 0, errors: ["Missing 'test_cases' array in root."] };
      }
      const errors: string[] = [];
      testCases.forEach((tc: unknown, idx: number) => {
        const item = tc as Record<string, unknown> | null;
        if (!item?.id) errors.push(`Case #${idx + 1} missing required 'id'.`);
        if (!item?.name) errors.push(`Case #${idx + 1} missing required 'name'.`);
        if (!item?.actions || !Array.isArray(item.actions) || item.actions.length === 0) {
          errors.push(`Case #${idx + 1} ('${item?.id || idx}') has no actions defined.`);
        }
      });
      return {
        is_valid: errors.length === 0,
        cases_count: testCases.length,
        errors,
      };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Invalid YAML structure";
      return {
        is_valid: false,
        cases_count: 0,
        errors: [`YAML Syntax Error: ${message}`],
      };
    }
  }

  async createTestPack(data: TestPackCreateRequest): Promise<TestPackResponse> {
    await this.delay();
    const validation = this.validateRawYaml(data.raw_yaml);
    const newPack: TestPackResponse = {
      id: `pack-${Date.now().toString(36)}`,
      website_id: data.website_id,
      title: data.title,
      version: data.version || "1.0.0",
      raw_yaml: data.raw_yaml,
      cases_count: validation.cases_count,
      is_valid: validation.is_valid,
      validation_errors: validation.errors,
    };
    this.testPacks.push(newPack);
    return newPack;
  }

  // --- TEST RUNS ---
  async getTestRuns(): Promise<TestRunResponse[]> {
    await this.delay();
    return [...this.testRuns];
  }

  async getTestRun(id: string): Promise<TestRunResponse | null> {
    await this.delay();
    return this.testRuns.find((r) => r.id === id) || null;
  }

  async triggerScan(payload: TriggerScanRequest): Promise<TestRunResponse> {
    await this.delay(350);
    const runId = `run-${Date.now().toString(36)}`;
    const newRun: TestRunResponse = {
      id: runId,
      website_id: payload.website_id,
      scan_profile_id: payload.scan_profile_id || "prof-001",
      test_pack_id: payload.test_pack_id || "pack-001",
      status: "pending",
      started_at: new Date().toISOString(),
    };
    this.testRuns.unshift(newRun);

    // Simulate async scan lifecycle transitions: pending -> running -> completed
    setTimeout(() => {
      const r = this.testRuns.find((item) => item.id === runId);
      if (r && r.status === "pending") {
        r.status = "running";
      }
    }, 2000);

    setTimeout(() => {
      const r = this.testRuns.find((item) => item.id === runId);
      if (r && r.status === "running") {
        r.status = "completed";
        r.overall_score = 92.4;
        r.grade = "A";
        r.completed_at = new Date().toISOString();

        // Synthesize multi-pillar report
        const targetSite = this.websites.find((w) => w.id === payload.website_id);
        this.reports[runId] = {
          id: `rep-${runId}`,
          test_run_id: runId,
          overall_score: 92.4,
          grade: "A",
          passed: true,
          functional_score: 96.0,
          security_score: 90.0,
          performance_score: 88.0,
          accessibility_score: 95.0,
          total_findings: 2,
          critical_findings: 0,
          high_findings: 0,
          report_data: {
            run_id: runId,
            target_url: targetSite?.base_url || "https://target-audit.example.com",
            overall_score: 92.4,
            grade: "A",
            passed: true,
            total_findings: 2,
            findings_by_severity: { critical: 0, high: 0, medium: 1, low: 1, info: 0 },
            all_findings: [
              {
                id: "PERF-TTFB-01",
                title: "Server Response Time (TTFB) Over 250ms Target",
                description: "Initial server document response latency measured 310ms under load.",
                severity: "medium",
                selector_or_url: targetSite?.base_url || "/",
                suggested_fix: "Enable edge caching and HTTP/2 keepalive pooling.",
                fingerprint: `fp_${runId}_ttfb`,
              },
              {
                id: "A11Y-LANDMARK-01",
                title: "Missing Main Landmark Region Role",
                description: "Document lacks `<main>` semantic element or role='main'.",
                severity: "low",
                selector_or_url: "body > div.app-root",
                suggested_fix: "Wrap primary content block inside `<main role='main'>` tag.",
                fingerprint: `fp_${runId}_landmark`,
              },
            ],
            pillar_results: {
              functional: { pillar: "functional", score: 96.0, status: "PASSED", findings: [], metrics: { passed_cases: 2 }, duration_sec: 22.0 },
              security: { pillar: "security", score: 90.0, status: "PASSED", findings: [], metrics: { headers_checked: 14 }, duration_sec: 14.0 },
              performance: { pillar: "performance", score: 88.0, status: "PASSED", findings: [], metrics: { ttfb_ms: 310, lcp_sec: 2.1 }, duration_sec: 12.0 },
              accessibility: { pillar: "accessibility", score: 95.0, status: "PASSED", findings: [], metrics: { violations_count: 1 }, duration_sec: 10.0 },
            },
          },
        };
      }
    }, 7000);

    return newRun;
  }

  async cancelScan(id: string): Promise<TestRunResponse> {
    await this.delay(200);
    const r = this.testRuns.find((item) => item.id === id);
    if (!r) throw new Error("Test run not found");
    r.status = "cancelled";
    r.completed_at = new Date().toISOString();
    return r;
  }

  // --- REPORTS ---
  async getReport(runId: string): Promise<ReportSummaryResponse | null> {
    await this.delay();
    return this.reports[runId] || null;
  }

  // --- DASHBOARD ---
  async getDashboardSummary(): Promise<DashboardSummaryResponse> {
    await this.delay();
    const completedRuns = this.testRuns.filter((r) => r.status === "completed" && r.overall_score !== undefined);
    const avgScore =
      completedRuns.length > 0
        ? Number((completedRuns.reduce((sum, r) => sum + (r.overall_score || 0), 0) / completedRuns.length).toFixed(1))
        : 85.0;

    const runsByStatus: Record<string, number> = {
      completed: this.testRuns.filter((r) => r.status === "completed").length,
      running: this.testRuns.filter((r) => r.status === "running").length,
      pending: this.testRuns.filter((r) => r.status === "pending" || r.status === "queued").length,
      failed: this.testRuns.filter((r) => r.status === "failed").length,
      cancelled: this.testRuns.filter((r) => r.status === "cancelled").length,
    };

    const passedRuns = completedRuns.filter((r) => (r.overall_score || 0) >= 70.0);
    const passRate = completedRuns.length > 0 ? Number(((passedRuns.length / completedRuns.length) * 100).toFixed(1)) : 100.0;

    return {
      total_websites: this.websites.length,
      total_runs: this.testRuns.length,
      average_score: avgScore,
      runs_by_status: runsByStatus,
      pass_rate_percentage: passRate,
    };
  }

  async getRecentActivity(): Promise<RecentActivityItem[]> {
    await this.delay();
    return this.testRuns.slice(0, 8).map((run) => {
      const site = this.websites.find((w) => w.id === run.website_id);
      return {
        run_id: run.id,
        website_id: run.website_id,
        website_name: site?.name || "Unknown Target",
        target_url: site?.base_url || "https://example.com",
        status: run.status,
        score: run.overall_score,
        started_at: run.started_at || new Date().toISOString(),
        finished_at: run.completed_at,
      };
    });
  }
}

export const mockStore = new MockStore();
