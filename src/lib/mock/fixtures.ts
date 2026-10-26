import { WebsiteResponse } from "@/types/website";
import { ScanProfileResponse } from "@/types/scan-profile";
import { TestPackResponse } from "@/types/test-pack";
import { TestRunResponse } from "@/types/test-run";
import { ReportSummaryResponse } from "@/types/report";

export const INITIAL_WEBSITES: WebsiteResponse[] = [
  {
    id: "web-001",
    name: "Apex Storefront (Production)",
    base_url: "https://shop.apexstore.io",
    environment: "production",
    allowed_domains: ["shop.apexstore.io", "cdn.apexstore.io"],
    is_authorized: true,
    is_active: true,
    verification_token: "tok_apex_prod_99f3b2",
    verification_status: "verified",
    verified_at: "2026-10-20T10:15:00Z",
  },
  {
    id: "web-002",
    name: "Nova Cloud Portal (Staging)",
    base_url: "https://staging-portal.novasystems.com",
    environment: "staging",
    allowed_domains: ["staging-portal.novasystems.com"],
    is_authorized: true,
    is_active: true,
    verification_token: "tok_nova_stg_41b8a9",
    verification_status: "verified",
    verified_at: "2026-10-21T14:30:00Z",
  },
  {
    id: "web-003",
    name: "Dev Internal Gateway",
    base_url: "https://dev-api.internal.network",
    environment: "local",
    allowed_domains: ["dev-api.internal.network"],
    is_authorized: false,
    is_active: true,
    verification_token: "ai-verify-88a1f49e0b",
    verification_status: "pending",
  },
];

export const INITIAL_SCAN_PROFILES: ScanProfileResponse[] = [
  {
    id: "prof-001",
    name: "Full 4-Pillar Comprehensive Audit",
    description: "Standard end-to-end evaluation covering Functional, OWASP Security, Core Web Vitals, and WCAG AA accessibility.",
    check_functional: true,
    check_security: true,
    check_performance: true,
    check_accessibility: true,
    allow_state_changing: false,
    rate_limit: 15,
    timeout_seconds: 600,
  },
  {
    id: "prof-002",
    name: "High-Speed Smoke & Regression",
    description: "Functional Playwright verification exclusively for rapid deployment validation in CI/CD.",
    check_functional: true,
    check_security: false,
    check_performance: false,
    check_accessibility: false,
    allow_state_changing: false,
    rate_limit: 30,
    timeout_seconds: 120,
  },
  {
    id: "prof-003",
    name: "Strict Security & Header Hardening",
    description: "Comprehensive vulnerability and TLS posture analysis. Probes HSTS, CSP, sensitive exposures, and cookie flags.",
    check_functional: false,
    check_security: true,
    check_performance: false,
    check_accessibility: false,
    allow_state_changing: false,
    rate_limit: 10,
    timeout_seconds: 300,
  },
  {
    id: "prof-004",
    name: "Core Web Vitals & Accessibility UX",
    description: "Client-side telemetry inspection measuring TTFB, LCP, CLS, FID alongside automated WCAG 2.1 AA Axe checks.",
    check_functional: false,
    check_security: false,
    check_performance: true,
    check_accessibility: true,
    allow_state_changing: false,
    rate_limit: 20,
    timeout_seconds: 300,
  },
];

export const INITIAL_TEST_PACKS: TestPackResponse[] = [
  {
    id: "pack-001",
    website_id: "web-001",
    title: "E-Commerce Checkout & Search Smoke Flow",
    version: "1.2.0",
    cases_count: 2,
    is_valid: true,
    validation_errors: [],
    raw_yaml: `title: "E-Commerce Checkout & Search Smoke Flow"
version: "1.2.0"
test_cases:
  - id: "tc_search_and_select"
    name: "Product Search & Detail Navigation"
    actions:
      - type: "navigate"
        url: "https://shop.apexstore.io/catalog"
      - type: "fill"
        selector: "input[type='search']"
        value: "Mechanical Keyboard"
      - type: "click"
        selector: "button[type='submit']"
      - type: "wait_for_selector"
        selector: ".search-results-grid"
    assertions:
      - type: "assert_url"
        value: "catalog?q=Mechanical"
      - type: "assert_text"
        selector: ".results-count"
        expected: "Found"

  - id: "tc_cart_addition"
    name: "Add Item To Cart Verification"
    actions:
      - type: "click"
        selector: ".product-card:first-child button.add-to-cart"
      - type: "wait_for_selector"
        selector: "#cart-drawer"
    assertions:
      - type: "assert_text"
        selector: ".cart-counter"
        expected: "1"
`,
  },
  {
    id: "pack-002",
    website_id: "web-002",
    title: "Admin Authentication & Dashboard Access",
    version: "1.0.4",
    cases_count: 1,
    is_valid: true,
    validation_errors: [],
    raw_yaml: `title: "Admin Authentication & Dashboard Access"
version: "1.0.4"
test_cases:
  - id: "tc_auth_admin"
    name: "Secure Admin Login Flow"
    actions:
      - type: "navigate"
        url: "https://staging-portal.novasystems.com/login"
      - type: "fill"
        selector: "#user_email"
        value: "qa-admin@novasystems.com"
      - type: "fill"
        selector: "#user_password"
        value: "{{VAULT_ADMIN_PASSWORD}}"
      - type: "click"
        selector: "button[type='submit']"
      - type: "wait_for_selector"
        selector: ".dashboard-shell"
    assertions:
      - type: "assert_url"
        value: "/dashboard"
      - type: "assert_status"
        code: 200
`,
  },
];

export const INITIAL_TEST_RUNS: TestRunResponse[] = [
  {
    id: "run-001",
    website_id: "web-001",
    scan_profile_id: "prof-001",
    test_pack_id: "pack-001",
    status: "completed",
    overall_score: 91.5,
    grade: "A",
    started_at: "2026-10-23T06:10:00Z",
    completed_at: "2026-10-23T06:12:45Z",
  },
  {
    id: "run-002",
    website_id: "web-002",
    scan_profile_id: "prof-001",
    test_pack_id: "pack-002",
    status: "completed",
    overall_score: 84.0,
    grade: "B",
    started_at: "2026-10-23T05:00:00Z",
    completed_at: "2026-10-23T05:03:15Z",
  },
  {
    id: "run-003",
    website_id: "web-003",
    scan_profile_id: "prof-003",
    status: "completed",
    overall_score: 58.0,
    grade: "F",
    started_at: "2026-10-22T21:40:00Z",
    completed_at: "2026-10-22T21:42:10Z",
  },
  {
    id: "run-004",
    website_id: "web-001",
    scan_profile_id: "prof-004",
    status: "completed",
    overall_score: 96.0,
    grade: "A",
    started_at: "2026-10-22T15:20:00Z",
    completed_at: "2026-10-22T15:22:30Z",
  },
  {
    id: "run-005",
    website_id: "web-002",
    scan_profile_id: "prof-002",
    status: "running",
    started_at: "2026-10-23T06:40:00Z",
  },
];

export const INITIAL_REPORTS: Record<string, ReportSummaryResponse> = {
  "run-001": {
    id: "rep-001",
    test_run_id: "run-001",
    overall_score: 91.5,
    grade: "A",
    passed: true,
    functional_score: 95.0,
    security_score: 88.0,
    performance_score: 89.0,
    accessibility_score: 94.0,
    total_findings: 4,
    critical_findings: 0,
    high_findings: 1,
    report_data: {
      run_id: "run-001",
      target_url: "https://shop.apexstore.io",
      overall_score: 91.5,
      grade: "A",
      passed: true,
      total_findings: 4,
      findings_by_severity: { critical: 0, high: 1, medium: 2, low: 1, info: 0 },
      all_findings: [
        {
          id: "SEC-CSP-01",
          title: "Missing Strict Content-Security-Policy (CSP) Header",
          description: "Response header does not define 'Content-Security-Policy' with restrictive script-src directives.",
          severity: "high",
          selector_or_url: "https://shop.apexstore.io/",
          suggested_fix: "Add Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-...' to HTTP response headers.",
          fingerprint: "fp_e1a4789b91c28f3a",
        },
        {
          id: "PERF-LCP-02",
          title: "Largest Contentful Paint (LCP) Exceeds Recommended 2.5s",
          description: "Hero banner image took 2.84s to decode and render during initial viewport load.",
          severity: "medium",
          selector_or_url: "header.hero-banner img.main-art",
          suggested_fix: "Convert PNG banner to WebP/AVIF format and add fetchpriority='high' to image element.",
          fingerprint: "fp_c48b11f20d58aa19",
        },
        {
          id: "A11Y-CONTRAST-01",
          title: "Subtle Contrast Ratio Below WCAG 2.1 AA (4.5:1)",
          description: "Muted footer links have a contrast ratio of 3.8:1 against the dark background.",
          severity: "medium",
          selector_or_url: "footer .nav-links a.muted-link",
          suggested_fix: "Increase color brightness from #64748b to #94a3b8 for improved readability.",
          fingerprint: "fp_7d2f90a612efc401",
        },
        {
          id: "FUNC-RETRY-01",
          title: "Element Click Required 1 DOM Re-query",
          description: "AddToCart button re-rendered during hydrate cycle before click event fired.",
          severity: "low",
          selector_or_url: "button.add-to-cart",
          suggested_fix: "Ensure button is interactive prior to dispatching click events in hydration phase.",
          fingerprint: "fp_3a91b4ff2008dc67",
        },
      ],
      pillar_results: {
        functional: {
          pillar: "functional",
          score: 95.0,
          status: "PASSED",
          findings: [
            {
              id: "FUNC-RETRY-01",
              title: "Element Click Required 1 DOM Re-query",
              description: "AddToCart button re-rendered during hydrate cycle before click event fired.",
              severity: "low",
              selector_or_url: "button.add-to-cart",
              suggested_fix: "Ensure button is interactive prior to dispatching click events.",
              fingerprint: "fp_3a91b4ff2008dc67",
            },
          ],
          metrics: { executed_cases: 2, passed_cases: 2, failed_cases: 0, actions_count: 6 },
          duration_sec: 42.1,
        },
        security: {
          pillar: "security",
          score: 88.0,
          status: "PASSED",
          findings: [
            {
              id: "SEC-CSP-01",
              title: "Missing Strict Content-Security-Policy (CSP) Header",
              description: "Response header does not define 'Content-Security-Policy'.",
              severity: "high",
              selector_or_url: "https://shop.apexstore.io/",
              suggested_fix: "Add Content-Security-Policy header to HTTP response.",
              fingerprint: "fp_e1a4789b91c28f3a",
            },
          ],
          metrics: { headers_checked: 14, hsts_valid: true, tls_grade: "A+", sensitive_files_probed: 18 },
          duration_sec: 18.4,
        },
        performance: {
          pillar: "performance",
          score: 89.0,
          status: "PASSED",
          findings: [
            {
              id: "PERF-LCP-02",
              title: "Largest Contentful Paint (LCP) Exceeds Recommended 2.5s",
              description: "Hero banner image took 2.84s to decode.",
              severity: "medium",
              selector_or_url: "header.hero-banner img.main-art",
              suggested_fix: "Optimize hero banner image with AVIF and priority loading.",
              fingerprint: "fp_c48b11f20d58aa19",
            },
          ],
          metrics: { ttfb_ms: 210, lcp_sec: 2.84, cls_score: 0.02, fid_ms: 18 },
          duration_sec: 16.2,
        },
        accessibility: {
          pillar: "accessibility",
          score: 94.0,
          status: "PASSED",
          findings: [
            {
              id: "A11Y-CONTRAST-01",
              title: "Subtle Contrast Ratio Below WCAG 2.1 AA",
              description: "Muted footer links have a contrast ratio of 3.8:1.",
              severity: "medium",
              selector_or_url: "footer .nav-links a.muted-link",
              suggested_fix: "Increase text luminance to achieve minimum 4.5:1 ratio.",
              fingerprint: "fp_7d2f90a612efc401",
            },
          ],
          metrics: { rules_evaluated: 48, violations_count: 1, passes_count: 47 },
          duration_sec: 14.5,
        },
      },
    },
  },
  "run-002": {
    id: "rep-002",
    test_run_id: "run-002",
    overall_score: 84.0,
    grade: "B",
    passed: true,
    functional_score: 90.0,
    security_score: 80.0,
    performance_score: 82.0,
    accessibility_score: 86.0,
    total_findings: 3,
    critical_findings: 0,
    high_findings: 1,
    report_data: {
      run_id: "run-002",
      target_url: "https://staging-portal.novasystems.com",
      overall_score: 84.0,
      grade: "B",
      passed: true,
      total_findings: 3,
      findings_by_severity: { critical: 0, high: 1, medium: 2, low: 0, info: 0 },
      all_findings: [
        {
          id: "SEC-COOKIE-01",
          title: "Session Cookie Missing SameSite=Strict Attribute",
          description: "Cookie 'session_id' is configured with SameSite=Lax instead of Strict.",
          severity: "high",
          selector_or_url: "Set-Cookie: session_id=...",
          suggested_fix: "Set SameSite=Strict and Ensure Secure flag is present.",
          fingerprint: "fp_44c10a12e88bfa10",
        },
      ],
      pillar_results: {
        functional: { pillar: "functional", score: 90.0, status: "PASSED", findings: [], metrics: { executed_cases: 1, passed_cases: 1 }, duration_sec: 25.0 },
        security: { pillar: "security", score: 80.0, status: "WARNING", findings: [], metrics: { headers_checked: 12 }, duration_sec: 20.0 },
        performance: { pillar: "performance", score: 82.0, status: "PASSED", findings: [], metrics: { ttfb_ms: 320, lcp_sec: 2.9 }, duration_sec: 15.0 },
        accessibility: { pillar: "accessibility", score: 86.0, status: "PASSED", findings: [], metrics: { rules_evaluated: 45 }, duration_sec: 12.0 },
      },
    },
  },
  "run-003": {
    id: "rep-003",
    test_run_id: "run-003",
    overall_score: 58.0,
    grade: "F",
    passed: false,
    functional_score: 100.0,
    security_score: 45.0,
    performance_score: 65.0,
    accessibility_score: 70.0,
    total_findings: 5,
    critical_findings: 1,
    high_findings: 2,
    report_data: {
      run_id: "run-003",
      target_url: "https://dev-api.internal.network",
      overall_score: 58.0,
      grade: "F",
      passed: false,
      total_findings: 5,
      findings_by_severity: { critical: 1, high: 2, medium: 1, low: 1, info: 0 },
      all_findings: [
        {
          id: "SEC-EXPOSE-01",
          title: "Unauthenticated Exposure of Swagger API Schema",
          description: "Internal Swagger docs and schema definitions publicly accessible on dev host.",
          severity: "critical",
          selector_or_url: "https://dev-api.internal.network/docs",
          suggested_fix: "Protect API documentation endpoints behind authentication middleware or restrict to VPN.",
          fingerprint: "fp_critical_swagger_9981",
        },
        {
          id: "SEC-CORS-02",
          title: "Overly Permissive CORS Access-Control-Allow-Origin: *",
          description: "Wildcard origin allowed with credentials enabled.",
          severity: "high",
          selector_or_url: "https://dev-api.internal.network/api/v1/auth",
          suggested_fix: "Configure explicit allowed origins list instead of wildcard.",
          fingerprint: "fp_cors_wildcard_1102",
        },
      ],
      pillar_results: {
        functional: { pillar: "functional", score: 100.0, status: "PASSED", findings: [], metrics: {}, duration_sec: 10.0 },
        security: { pillar: "security", score: 45.0, status: "FAILED", findings: [], metrics: { sensitive_files_probed: 25 }, duration_sec: 35.0 },
        performance: { pillar: "performance", score: 65.0, status: "WARNING", findings: [], metrics: { ttfb_ms: 780 }, duration_sec: 15.0 },
        accessibility: { pillar: "accessibility", score: 70.0, status: "WARNING", findings: [], metrics: {}, duration_sec: 10.0 },
      },
    },
  },
  "run-004": {
    id: "rep-004",
    test_run_id: "run-004",
    overall_score: 96.0,
    grade: "A",
    passed: true,
    functional_score: 100.0,
    security_score: 95.0,
    performance_score: 94.0,
    accessibility_score: 97.0,
    total_findings: 1,
    critical_findings: 0,
    high_findings: 0,
    report_data: {
      run_id: "run-004",
      target_url: "https://shop.apexstore.io",
      overall_score: 96.0,
      grade: "A",
      passed: true,
      total_findings: 1,
      findings_by_severity: { critical: 0, high: 0, medium: 0, low: 1, info: 0 },
      all_findings: [
        {
          id: "PERF-CACHE-01",
          title: "Static Asset Cache-Control Header Can Be Extended",
          description: "Static icon bundle cached for 1 hour instead of recommended 1 year with immutable flag.",
          severity: "low",
          selector_or_url: "https://shop.apexstore.io/favicon.ico",
          suggested_fix: "Add max-age=31536000, immutable to static cache headers.",
          fingerprint: "fp_cache_control_4481",
        },
      ],
      pillar_results: {
        functional: { pillar: "functional", score: 100.0, status: "PASSED", findings: [], metrics: {}, duration_sec: 20.0 },
        security: { pillar: "security", score: 95.0, status: "PASSED", findings: [], metrics: {}, duration_sec: 15.0 },
        performance: { pillar: "performance", score: 94.0, status: "PASSED", findings: [], metrics: { ttfb_ms: 120, lcp_sec: 1.6 }, duration_sec: 12.0 },
        accessibility: { pillar: "accessibility", score: 97.0, status: "PASSED", findings: [], metrics: { violations_count: 0 }, duration_sec: 10.0 },
      },
    },
  },
};
