"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { Input, Select } from "@/components/common/Input";
import { YamlEditor } from "@/components/test-packs/YamlEditor";
import { useCreateTestPack, useValidateTestPack } from "@/features/test-packs";
import { useWebsites } from "@/features/websites";
import {
  FileCode,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Save,
  ArrowLeft,
  Layers,
} from "lucide-react";
import Link from "next/link";

const DEFAULT_YAML = `title: "User Journey Smoke Test"
version: "1.0.0"
test_cases:
  - id: "tc_homepage_navigation"
    name: "Homepage Navigation & Hero Verification"
    actions:
      - type: "navigate"
        url: "https://example.com"
      - type: "wait_for_selector"
        selector: "h1"
    assertions:
      - type: "assert_status"
        code: 200
      - type: "assert_text"
        selector: "h1"
        expected: "Example Domain"
`;

export default function NewTestPackPage() {
  const router = useRouter();
  const { data: websites = [] } = useWebsites();
  const createTestPack = useCreateTestPack();
  const validateTestPack = useValidateTestPack();

  const [title, setTitle] = useState("User Journey Smoke Test");
  const [version, setVersion] = useState("1.0.0");
  const [websiteId, setWebsiteId] = useState("");
  const [yamlContent, setYamlContent] = useState(DEFAULT_YAML);
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

  const handleGenerateAiPrompt = (type: "login" | "search") => {
    if (type === "login") {
      setYamlContent(`title: "Synthetic Login & Session Verification"
version: "1.1.0"
test_cases:
  - id: "tc_auth_login"
    name: "User Login & Dashboard Redirect"
    actions:
      - type: "navigate"
        url: "https://example.com/login"
      - type: "fill"
        selector: "input[type='email']"
        value: "tester@company.internal"
      - type: "fill"
        selector: "input[type='password']"
        value: "{{VAULT_TESTER_PASSWORD}}"
      - type: "click"
        selector: "button[type='submit']"
      - type: "wait_for_selector"
        selector: "#dashboard-nav"
    assertions:
      - type: "assert_url"
        value: "/dashboard"
`);
      setTitle("Synthetic Login & Session Verification");
    } else {
      setYamlContent(`title: "Catalog Search & Filter Flow"
version: "1.0.0"
test_cases:
  - id: "tc_search_query"
    name: "Product Search & Result Grid"
    actions:
      - type: "navigate"
        url: "https://example.com/products"
      - type: "fill"
        selector: "#search-box"
        value: "Wireless Headset"
      - type: "click"
        selector: "#search-btn"
      - type: "wait_for_selector"
        selector: ".product-item"
    assertions:
      - type: "assert_url"
        value: "q=Wireless"
`);
      setTitle("Catalog Search & Filter Flow");
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
          <span>Need inspiration? Pre-populate with realistic AI testing templates:</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleGenerateAiPrompt("login")}
            className="text-indigo-300 border-indigo-500/40 hover:bg-indigo-500/15"
          >
            Auth Login Flow
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleGenerateAiPrompt("search")}
            className="text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/15"
          >
            Search & Filter Flow
          </Button>
        </div>
      </div>

      {/* Split Studio Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Monaco Editor (2 cols) */}
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between px-1 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-mono">
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              test-pack.yaml
            </span>
            <span>Syntax: YAML 1.2</span>
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
                Supported Action Primitives
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-300">
                <span className="p-1.5 rounded bg-slate-900 border border-slate-800">navigate</span>
                <span className="p-1.5 rounded bg-slate-900 border border-slate-800">fill</span>
                <span className="p-1.5 rounded bg-slate-900 border border-slate-800">click</span>
                <span className="p-1.5 rounded bg-slate-900 border border-slate-800">wait_for_selector</span>
                <span className="p-1.5 rounded bg-slate-900 border border-slate-800">assert_url</span>
                <span className="p-1.5 rounded bg-slate-900 border border-slate-800">assert_text</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
