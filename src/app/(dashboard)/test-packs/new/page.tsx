"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input, Select } from "@/components/common/Input";
import { YamlEditor } from "@/components/test-packs/YamlEditor";
import {
  useCreateTestPack,
  useValidateTestPack,
  parseTestCasesText,
  readTestCaseFile,
  toTestPackYaml,
  fileTitle,
  TEST_CASE_FILE_ACCEPT,
} from "@/features/test-packs";
import { useWebsites } from "@/features/websites";
import {
  FileCode,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Save,
  ArrowLeft,
  Layers,
  Upload,
} from "lucide-react";
import Link from "next/link";

// Templates use the exact format the backend validates (pack_id, cases, steps, assertions).
const DEFAULT_YAML = `# Replace example.com and the selectors with your own website's.
pack_id: "homepage-smoke"
title: "Homepage Smoke Test"
version: "1.0.0"
cases:
  - id: "SMOKE-001"
    title: "Homepage loads and shows the main heading"
    pillar: "functional"
    risk: "read_only"
    tags: ["smoke"]
    steps:
      - action: "open_page"
        value: "https://example.com"
      - action: "wait"
        timeout_ms: 1000
    assertions:
      - type: "status_code_equals"
        value: 200
      - type: "element_visible"
        target: "h1"
      - type: "text_contains"
        target: "h1"
        value: "Example Domain"
`;

const LOGIN_TEMPLATE_YAML = `# Read-only checks of a login form. Never put real passwords in a test file.
pack_id: "login-form-validation"
title: "Login Form Validation"
version: "1.0.0"
cases:
  - id: "LOGIN-001"
    title: "Login form rejects an invalid email address"
    pillar: "functional"
    risk: "read_only"
    tags: ["login", "validation"]
    steps:
      - action: "open_page"
        value: "https://example.com/login"
      - action: "type_text"
        target: "input[type='email']"
        value: "not-an-email"
    assertions:
      - type: "input_invalid"
        target: "input[type='email']"
  - id: "LOGIN-002"
    title: "Empty login form is reported as incomplete"
    pillar: "functional"
    risk: "read_only"
    tags: ["login", "required_fields"]
    steps:
      - action: "open_page"
        value: "https://example.com/login"
    assertions:
      - type: "form_invalid"
        target: "form"
`;

const SEARCH_TEMPLATE_YAML = `# Search and check that results appear.
pack_id: "catalog-search"
title: "Catalog Search Flow"
version: "1.0.0"
cases:
  - id: "SEARCH-001"
    title: "Searching shows matching products"
    pillar: "functional"
    risk: "read_only"
    tags: ["search"]
    steps:
      - action: "open_page"
        value: "https://example.com/products"
      - action: "type_text"
        target: "#search-box"
        value: "Wireless Headset"
      - action: "click"
        target: "#search-btn"
      - action: "wait"
        timeout_ms: 1500
    assertions:
      - type: "element_visible"
        target: ".product-item"
      - type: "url_contains"
        value: "q=Wireless"
`;

const SUPPORTED_ACTIONS = ["open_page", "click", "type_text", "select_option", "wait", "scroll", "hover", "download", "reload_page"];
const SUPPORTED_ASSERTIONS = [
  "element_visible", "element_hidden", "text_contains", "text_equals",
  "url_contains", "page_title_contains", "status_code_equals", "page_no_server_error",
  "input_invalid", "form_invalid", "option_list_not_empty", "option_count_equals",
  "text_not_contains", "attribute_equals", "page_load_time_less_than", "response_time_less_than",
  "render_time_less_than",
];

export default function NewTestPackPage() {
  const router = useRouter();
  const { data: websites = [] } = useWebsites();
  const createTestPack = useCreateTestPack();
  const validateTestPack = useValidateTestPack();

  const [title, setTitle] = useState("Homepage Smoke Test");
  const [version, setVersion] = useState("1.0.0");
  const [websiteId, setWebsiteId] = useState("");
  const [yamlContent, setYamlContent] = useState(DEFAULT_YAML);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [validationResult, setValidationResult] = useState<{
    is_valid: boolean;
    cases_count: number;
    errors: string[];
  }>({ is_valid: true, cases_count: 1, errors: [] });

  // Debounced real-time pre-flight validation
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await validateTestPack.mutateAsync(yamlContent);
        setValidationResult(res);
      } catch (e: unknown) {
        const errorMsg = e instanceof Error ? e.message : "Validation failed";
        setValidationResult({
          is_valid: false,
          cases_count: 0,
          errors: [errorMsg],
        });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [yamlContent, validateTestPack]);

  const handleSave = async () => {
    if (!title || !yamlContent) return;

    try {
      await createTestPack.mutateAsync({
        title,
        version,
        website_id: websiteId || undefined,
        raw_yaml: yamlContent,
      });
      router.push("/test-packs");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error saving test pack";
      alert(message);
    }
  };

  const handleUseTemplate = (type: "login" | "search") => {
    if (type === "login") {
      setYamlContent(LOGIN_TEMPLATE_YAML);
      setTitle("Login Form Validation");
    } else {
      setYamlContent(SEARCH_TEMPLATE_YAML);
      setTitle("Catalog Search Flow");
    }
    setUploadError(null);
    setFileName(null);
  };

  // Upload a .yaml / .yml / .json file and turn it into a full test pack in the editor.
  const handleFileUpload = async (file: File) => {
    setUploadError(null);
    try {
      const text = await readTestCaseFile(file);
      const parsed = parseTestCasesText(text);
      const packTitle = parsed.title || fileTitle(file.name);
      setYamlContent(toTestPackYaml(parsed, packTitle));
      setTitle(packTitle);
      if (parsed.version) setVersion(parsed.version);
      setFileName(file.name);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Could not read the file.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/test-packs">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              YAML Test Pack Studio
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Author synthetic Playwright test packs with real-time pre-flight schema inspection.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={handleSave}
            isLoading={createTestPack.isPending}
            disabled={!validationResult.is_valid}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Test Pack
          </Button>
        </div>
      </div>

      {/* Meta Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Test Pack Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Checkout Smoke Suite"
        />
        <Input
          label="Version Tag"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          placeholder="1.0.0"
        />
        <Select
          label="Anchor Website (Optional)"
          value={websiteId}
          onChange={(e) => setWebsiteId(e.target.value)}
          options={[
            { label: "Global / Any Target", value: "" },
            ...websites.map((w) => ({ label: `${w.name} (${w.base_url})`, value: w.id })),
          ]}
        />
      </div>

      {/* AI Generator Quick Stubs */}
      <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-xs text-indigo-300">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Start from a template, or upload your own test case file:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={TEST_CASE_FILE_ACCEPT}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
              e.target.value = ""; // allow picking the same file again
            }}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<Upload className="w-3.5 h-3.5" />}
          >
            Upload .yaml / .json
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUseTemplate("login")}
            className="text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/15"
          >
            Login Form Template
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUseTemplate("search")}
            className="text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/15"
          >
            Search Flow Template
          </Button>
        </div>
      </div>

      {uploadError && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2" role="alert">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Split Studio Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Monaco Editor (2 cols) */}
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between px-1 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-mono">
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              {fileName ? `${fileName} → test-pack.yaml` : "test-pack.yaml"}
            </span>
            <span>YAML (JSON also accepted)</span>
          </div>
          <YamlEditor value={yamlContent} onChange={setYamlContent} height="520px" />
        </div>

        {/* Right: Real-time Pre-Flight Inspector (1 col) */}
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Pre-Flight Schema Inspector
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                  validationResult.is_valid
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                    : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                }`}
              >
                {validationResult.is_valid ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    SCHEMA PASS
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    SYNTAX ERROR
                  </>
                )}
              </span>
            </div>

            {/* Parsed Metrics */}
            <div className="py-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  Parsed Test Scenarios:
                </span>
                <span className="font-mono text-slate-200 font-bold">
                  {validationResult.cases_count} Cases
                </span>
              </div>
            </div>

            {/* Error Log or Clean Output */}
            {validationResult.errors.length > 0 ? (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 space-y-2">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Validation Violations:
                </p>
                <ul className="list-disc list-inside space-y-1 font-mono text-[11px]">
                  {validationResult.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  YAML structure matches the Playwright runner schema. Ready for deployment and execution.
                </p>
              </div>
            )}

            {/* Schema Reference Guide */}
            <div className="mt-5 pt-4 border-t border-slate-800 text-xs space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Supported Step Actions
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-300">
                {SUPPORTED_ACTIONS.map((action) => (
                  <span key={action} className="p-1.5 rounded bg-slate-900 border border-slate-800">{action}</span>
                ))}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pt-2">
                Supported Assertions
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-300">
                {SUPPORTED_ASSERTIONS.map((assertion) => (
                  <span key={assertion} className="p-1.5 rounded bg-slate-900 border border-slate-800 truncate" title={assertion}>
                    {assertion}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
