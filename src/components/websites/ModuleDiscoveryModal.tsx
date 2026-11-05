"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader2, CheckCircle2, XCircle, Clock, ChevronRight, RotateCcw, ExternalLink, Search, AlertTriangle, Ban } from "lucide-react";
import { Modal } from "@/components/common/Modal";
import { AuthenticationDrawer } from "@/components/websites/AuthenticationDrawer";
import { AdvancedExecutionAccordion, ViewportProfileType } from "@/components/websites/AdvancedExecutionAccordion";
import { Button } from "@/components/common/Button";
import { Switch } from "@/components/common/Input";
import * as testRunService from "@/features/test-runs/api/testRunService";
import {
  AuthenticationPayload,
  WizardModuleRow,
  ModuleScanResult,
  ModuleScanStatus,
  QuickScanRequest,
} from "@/types/test-run";

interface ModuleDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
}

type WizardStep = 1 | 2 | 3 | 4 | 5;

const STEP_LABELS = ["URL & Auth", "Modules", "Settings", "Running", "Results"];

const GRADE_COLORS: Record<string, string> = {
  A: "text-green-600 bg-green-50",
  B: "text-blue-600 bg-blue-50",
  C: "text-yellow-600 bg-yellow-50",
  D: "text-orange-600 bg-orange-50",
  F: "text-red-600 bg-red-50",
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pollUntilDone(runId: string, maxMs = 180_000, onProgress?: (message: string) => void) {
  const interval = 5000;
  const maxAttempts = Math.ceil(maxMs / interval);
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(interval);
    const run = await testRunService.getTestRun(runId);
    if (onProgress && i % 2 === 0) {
      try {
        const logs = await testRunService.getRunLogs(runId);
        const latest = logs.logs[logs.logs.length - 1];
        if (latest?.message) onProgress(latest.message);
      } catch {
        // Status polling remains sufficient if progress logs are unavailable.
      }
    }
    if (["completed", "failed", "cancelled"].includes(run.status)) return run;
  }
  throw new Error("Scan timed out waiting for completion");
}

export function ModuleDiscoveryModal({ isOpen, onClose, initialUrl = "" }: ModuleDiscoveryModalProps) {
  const [step, setStep] = useState<WizardStep>(1);

  // Step 1 — URL + Auth
  const [targetUrl, setTargetUrl] = useState(initialUrl);
  const [authEnabled, setAuthEnabled] = useState(false);
  const [authMethod, setAuthMethod] = useState<"form" | "basic_auth" | "storage_state">("form");
  const [loginUrl, setLoginUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successIndicator, setSuccessIndicator] = useState("");

  // Step 2 — Discovery
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [discoveryError, setDiscoveryError] = useState<string | null>(null);
  const [moduleRows, setModuleRows] = useState<WizardModuleRow[]>([]);

  // Step 3 — Quality Pillars
  const [checkFunctional, setCheckFunctional] = useState(true);
  const [checkSecurity, setCheckSecurity] = useState(true);
  const [checkPerformance, setCheckPerformance] = useState(true);
  const [checkAccessibility, setCheckAccessibility] = useState(true);

  // Step 3 — Advanced Execution Options (open by default in wizard)
  const [advancedOpen, setAdvancedOpen] = useState(true);
  const [browserEngine, setBrowserEngine] = useState<"chromium" | "firefox" | "webkit">("chromium");
  const [viewportProfile, setViewportProfile] = useState<ViewportProfileType>("desktop");
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [viewportHeight, setViewportHeight] = useState(900);
  const [timeoutSeconds, setTimeoutSeconds] = useState("600");
  const [maxDepth, setMaxDepth] = useState(0); // selected page only unless linked-page traversal is enabled
  const [exhaustiveInteractions, setExhaustiveInteractions] = useState(true);
  const [interactionTestValues, setInteractionTestValues] = useState("sample\n__no_matching_result__");
  const [includeActionOrderPermutations, setIncludeActionOrderPermutations] = useState(false);
  const [maxGeneratedCases, setMaxGeneratedCases] = useState(1000);
  const [rateLimitRps, setRateLimitRps] = useState(10);
  const [readOnlyMode, setReadOnlyMode] = useState(false);
  const [recordTrace, setRecordTrace] = useState(true);
  const [recordVideo, setRecordVideo] = useState(false);
  const [headedBrowser, setHeadedBrowser] = useState(false);
  const [useAiGeneration, setUseAiGeneration] = useState(true);
  const [aiTestGoals, setAiTestGoals] = useState("");
  const [aiExplainFailures, setAiExplainFailures] = useState(true);

  // Step 4 — Execution
  const [scanResults, setScanResults] = useState<ModuleScanResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const stopRef = useRef(false);
  const activeRunIdRef = useRef<string | null>(null);

  // Sync initialUrl when modal opens
  useEffect(() => {
    if (isOpen) setTargetUrl(initialUrl);
  }, [isOpen, initialUrl]);

  function handleViewportChange(profile: ViewportProfileType) {
    setViewportProfile(profile);
    switch (profile) {
      case "desktop": setViewportWidth(1440); setViewportHeight(900); break;
      case "laptop":  setViewportWidth(1280); setViewportHeight(800); break;
      case "tablet":  setViewportWidth(1024); setViewportHeight(1366); break;
      case "mobile":  setViewportWidth(393);  setViewportHeight(852); break;
      default: break;
    }
  }

  function resetWizard() {
    setStep(1);
    setTargetUrl(initialUrl);
    setAuthEnabled(false);
    setAuthMethod("form");
    setLoginUrl("");
    setUsername("");
    setPassword("");
    setShowPassword(false);
    setSuccessIndicator("");
    setIsDiscovering(false);
    setDiscoveryError(null);
    setModuleRows([]);
    setScanResults([]);
    setCurrentIndex(0);
    stopRef.current = false;
    setCheckFunctional(true);
    setCheckSecurity(true);
    setCheckPerformance(true);
    setCheckAccessibility(true);
    setAdvancedOpen(true);
    setBrowserEngine("chromium");
    setViewportProfile("desktop");
    setViewportWidth(1440);
    setViewportHeight(900);
    setTimeoutSeconds("600");
    setMaxDepth(0);
    setExhaustiveInteractions(true);
    setInteractionTestValues("sample\n__no_matching_result__");
    setIncludeActionOrderPermutations(false);
    setMaxGeneratedCases(1000);
    setRateLimitRps(10);
    setReadOnlyMode(false);
    setRecordTrace(true);
    setRecordVideo(false);
    setHeadedBrowser(false);
    setUseAiGeneration(true);
    setAiTestGoals("");
    setAiExplainFailures(true);
  }

  function handleClose() {
    stopRef.current = true;
    onClose();
    setTimeout(resetWizard, 300);
  }

  // ── Step 1 → Step 2: trigger discovery ──────────────────────────────────
  async function handleDiscover() {
    if (!targetUrl.trim()) return;
    setDiscoveryError(null);
    setIsDiscovering(true);
    setStep(2);

    const credentials: AuthenticationPayload | undefined = authEnabled
      ? { enabled: true, login_url: loginUrl || undefined, username: username || undefined, password: password || undefined, auth_method: authMethod, success_indicator: successIndicator || undefined }
      : undefined;

    try {
      const res = await testRunService.discoverModules({ url: targetUrl.trim(), credentials });
      setModuleRows(
        res.modules.map((m) => ({ ...m, selected: true, goal: m.suggested_goal }))
      );
    } catch (err) {
      setDiscoveryError(err instanceof Error ? err.message : "Module discovery failed. Check the URL and credentials.");
    } finally {
      setIsDiscovering(false);
    }
  }

  const selectedModules = moduleRows.filter((m) => m.selected);

  function toggleAll(val: boolean) {
    setModuleRows((rows) => rows.map((r) => ({ ...r, selected: val })));
  }

  function updateRow(idx: number, field: keyof WizardModuleRow, value: string | boolean) {
    setModuleRows((rows) => rows.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));
  }

  // ── Step 3 → Step 4: sequential scan execution ───────────────────────────
  useEffect(() => {
    if (step !== 4) return;
    stopRef.current = false;

    const selected = moduleRows.filter((m) => m.selected);
    setScanResults(
      selected.map((m) => ({ moduleUrl: m.url, moduleName: m.name, runId: null, status: "pending" as ModuleScanStatus }))
    );

    const credentials: AuthenticationPayload | undefined = authEnabled
      ? { enabled: true, login_url: loginUrl || undefined, username: username || undefined, password: password || undefined, auth_method: authMethod, success_indicator: successIndicator || undefined }
      : undefined;

    const globalOptions = {
      check_functional: checkFunctional,
      check_security: checkSecurity,
      check_performance: checkPerformance,
      check_accessibility: checkAccessibility,
      browser_type: browserEngine,
      viewport_width: viewportWidth,
      viewport_height: viewportHeight,
      is_mobile: viewportProfile === "mobile",
      timeout_seconds: parseInt(timeoutSeconds, 10) || 600,
      max_crawl_depth: maxDepth,
      include_sitemap_urls: false,
      exhaustive_interactions: exhaustiveInteractions,
      interaction_test_values: interactionTestValues.split("\n").map((value) => value.trim()).filter(Boolean),
      include_action_order_permutations: includeActionOrderPermutations,
      max_generated_cases: maxGeneratedCases,
      rate_limit_rps: rateLimitRps || 10,
      allow_state_changing: !readOnlyMode,
      record_trace: recordTrace,
      record_video: recordVideo,
      headless: !headedBrowser,
      slow_mo_ms: headedBrowser ? 300 : 0,
      use_ai_generation: useAiGeneration,
      ai_explain_failures: aiExplainFailures,
    };

    (async () => {
      for (let i = 0; i < selected.length; i++) {
        if (stopRef.current) break;
        setCurrentIndex(i);
        setCurrentMessage("Starting selected module...");
        setScanResults((prev) => prev.map((r, idx) => idx === i ? { ...r, status: "running" } : r));

        const mod = selected[i];
        // Per-module goal wins; fall back to global aiTestGoals if set
        const moduleGoal = mod.goal || aiTestGoals.trim() || undefined;

        const payload: QuickScanRequest = {
          url: mod.url,
          name: mod.name,
          credentials,
          options: { ...globalOptions, ai_test_goals: moduleGoal },
        };

        try {
          const run = await testRunService.quickScan(payload);
          activeRunIdRef.current = run.id;
          setScanResults((prev) => prev.map((r, idx) => idx === i ? { ...r, runId: run.id } : r));
          if (stopRef.current) {
            await testRunService.cancelScan(run.id).catch(() => undefined);
          }
          const final = await pollUntilDone(
            run.id,
            (parseInt(timeoutSeconds, 10) || 600) * 1000 + 30000,
            setCurrentMessage,
          );
          activeRunIdRef.current = null;
          const incompleteCoverage = final.error_message?.toLowerCase().includes("coverage incomplete") ||
            final.error_message?.toLowerCase().includes("interaction cases remain") ||
            final.error_message?.toLowerCase().includes("partial report") ||
            final.error_message?.toLowerCase().includes("time limit");
          setScanResults((prev) =>
            prev.map((r, idx) =>
              idx === i
                ? { ...r, runId: final.id, status: final.status === "cancelled" ? "cancelled" : final.status === "completed" ? (incompleteCoverage ? "incomplete" : "completed") : "failed", score: final.overall_score, grade: final.grade, errorMessage: final.error_message ?? undefined }
                : r
            )
          );
        } catch (err) {
          activeRunIdRef.current = null;
          setScanResults((prev) =>
            prev.map((r, idx) =>
              idx === i ? { ...r, status: "failed", errorMessage: err instanceof Error ? err.message : "Scan failed" } : r
            )
          );
        }
      }
      if (stopRef.current) {
        setScanResults((prev) => prev.map((r) => r.status === "pending" ? { ...r, status: "cancelled" } : r));
      }
      setStep(5);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // ── Rendering helpers ────────────────────────────────────────────────────
  function StatusIcon({ status }: { status: ModuleScanStatus }) {
    if (status === "pending") return <Clock className="w-4 h-4 text-gray-400" />;
    if (status === "running") return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
    if (status === "incomplete") return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    if (status === "cancelled") return <Ban className="w-4 h-4 text-gray-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  }

  async function stopTesting() {
    stopRef.current = true;
    const runId = activeRunIdRef.current;
    if (runId) {
      try {
        await testRunService.cancelScan(runId);
      } catch {
        // The queue will still stop before starting the next selected module.
      }
    }
  }

  function PillarChip({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
          checked ? "bg-[#FF6C37] text-white border-[#FF6C37]" : "bg-white text-[#6B6B6B] border-[#E6E6E6] hover:border-[#FF6C37]"
        }`}
      >
        {label}
      </button>
    );
  }

  const completedCount = scanResults.filter((r) => r.status === "completed").length;
  const failedCount = scanResults.filter((r) => r.status === "failed").length;
  const incompleteCount = scanResults.filter((r) => r.status === "incomplete").length;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Discover & Scan Modules" maxWidth="4xl">
      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-6">
        {STEP_LABELS.map((label, i) => {
          const n = (i + 1) as WizardStep;
          const active = step === n;
          const done = step > n;
          return (
            <React.Fragment key={n}>
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all ${
                  done ? "bg-[#FF6C37] border-[#FF6C37] text-white" :
                  active ? "bg-white border-[#FF6C37] text-[#FF6C37]" :
                  "bg-white border-[#E6E6E6] text-[#8C8C8C]"
                }`}>
                  {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : n}
                </div>
                <span className={`mt-1 text-[10px] whitespace-nowrap ${active ? "text-[#FF6C37] font-medium" : "text-[#8C8C8C]"}`}>{label}</span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className={`flex-1 h-0.5 mb-4 mx-1 ${step > n ? "bg-[#FF6C37]" : "bg-[#E6E6E6]"}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Step 1: URL + Auth ─────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#594139] mb-1">Target URL</label>
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://example.com/dashboard"
              className="w-full h-9 px-3 rounded-lg bg-white border border-[#E6E6E6] text-sm text-[#212121] placeholder-[#8C8C8C] focus:outline-none focus:border-[#FF6C37]"
            />
          </div>
          <AuthenticationDrawer
            authEnabled={authEnabled} setAuthEnabled={setAuthEnabled}
            authMethod={authMethod} setAuthMethod={setAuthMethod}
            loginUrl={loginUrl} setLoginUrl={setLoginUrl}
            username={username} setUsername={setUsername}
            password={password} setPassword={setPassword}
            showPassword={showPassword} setShowPassword={setShowPassword}
            successIndicator={successIndicator} setSuccessIndicator={setSuccessIndicator}
          />
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleDiscover}
              disabled={!targetUrl.trim()}
              rightIcon={<Search className="w-3.5 h-3.5" />}
            >
              Discover Modules
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 2: Module discovery ───────────────────────────────────────── */}
      {step === 2 && (
        <div className="space-y-4">
          {isDiscovering && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 text-[#FF6C37] animate-spin" />
              <p className="text-sm text-[#6B6B6B]">Logging in and scanning navigation structure...</p>
              <p className="text-xs text-[#8C8C8C]">This may take 20–40 seconds</p>
            </div>
          )}

          {!isDiscovering && discoveryError && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{discoveryError}</div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
                <Button onClick={handleDiscover} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>Try Again</Button>
              </div>
            </div>
          )}

          {!isDiscovering && !discoveryError && moduleRows.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#6B6B6B]">
                  Found <span className="font-semibold text-[#212121]">{moduleRows.length}</span> modules.
                  Edit names, URLs, or test goals inline.
                </p>
                <div className="flex gap-2">
                  <button onClick={() => toggleAll(true)} className="text-xs text-[#FF6C37] hover:underline">Select All</button>
                  <span className="text-[#E6E6E6]">|</span>
                  <button onClick={() => toggleAll(false)} className="text-xs text-[#6B6B6B] hover:underline">Deselect All</button>
                </div>
              </div>

              <div className="border border-[#E6E6E6] rounded-xl overflow-hidden">
                <div className="grid grid-cols-[32px_1fr_1fr_2fr] gap-0 bg-[#F5F3F3] px-3 py-2 text-[10px] font-semibold text-[#6B6B6B] uppercase tracking-wide">
                  <div />
                  <div>Module</div>
                  <div>URL</div>
                  <div>AI Test Goal (exploratory mode)</div>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-[#F5F3F3]">
                  {moduleRows.map((row, idx) => (
                    <div key={idx} className={`grid grid-cols-[32px_1fr_1fr_2fr] gap-0 px-3 py-2 items-center ${row.selected ? "bg-white" : "bg-[#FAFAFA] opacity-60"}`}>
                      <input
                        type="checkbox"
                        checked={row.selected}
                        onChange={(e) => updateRow(idx, "selected", e.target.checked)}
                        className="w-4 h-4 accent-[#FF6C37]"
                      />
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => updateRow(idx, "name", e.target.value)}
                        className="text-xs text-[#212121] bg-transparent border-0 focus:outline-none focus:bg-[#FFF8F6] rounded px-1 py-0.5 w-full"
                      />
                      <input
                        type="text"
                        value={row.url}
                        onChange={(e) => updateRow(idx, "url", e.target.value)}
                        className="text-xs text-[#6B6B6B] bg-transparent border-0 focus:outline-none focus:bg-[#FFF8F6] rounded px-1 py-0.5 w-full font-mono truncate"
                      />
                      <input
                        type="text"
                        value={row.goal}
                        onChange={(e) => updateRow(idx, "goal", e.target.value)}
                        className="text-xs text-[#594139] bg-transparent border-0 focus:outline-none focus:bg-[#FFF8F6] rounded px-1 py-0.5 w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-1">
                <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={selectedModules.length === 0}
                  rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                >
                  Continue with {selectedModules.length} selected
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Step 3: Scan settings ──────────────────────────────────────────── */}
      {step === 3 && (
        <div className="space-y-4">
          {/* Quality Pillars */}
          <div>
            <p className="text-xs font-semibold text-[#212121] mb-2">Quality Pillars</p>
            <div className="flex flex-wrap gap-2">
              <PillarChip label="Functional" checked={checkFunctional} onChange={setCheckFunctional} />
              <PillarChip label="Security" checked={checkSecurity} onChange={setCheckSecurity} />
              <PillarChip label="Performance" checked={checkPerformance} onChange={setCheckPerformance} />
              <PillarChip label="Accessibility" checked={checkAccessibility} onChange={setCheckAccessibility} />
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-[#E6E6E6] bg-[#FBF9F8] p-4">
            <div>
              <p className="text-xs font-semibold text-[#212121]">Interaction coverage</p>
              <p className="mt-1 text-[11px] leading-relaxed text-[#6B6B6B]">
                Each page gets a deterministic case queue. Dropdown options, checkbox states, radio choices, tabs, and the configured text values are combined, then every case reloads that same page before running.
              </p>
            </div>
            <Switch
              label="Exhaustive combinations"
              description="Run the full Cartesian product of discovered control values. Turn this off only to use the bounded exploratory journey."
              checked={exhaustiveInteractions}
              onChange={setExhaustiveInteractions}
            />
            {exhaustiveInteractions && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#594139] mb-1">
                    Text and search test values (one per line)
                  </label>
                  <textarea
                    value={interactionTestValues}
                    onChange={(event) => setInteractionTestValues(event.target.value)}
                    rows={3}
                    className="w-full rounded-lg bg-white border border-[#E6E6E6] px-3 py-2 text-xs text-[#212121] focus:outline-none focus:border-[#FF6C37]"
                    aria-label="Text and search test values"
                  />
                  <p className="mt-1 text-[10px] text-[#8C8C8C]">An empty value is always tested. These values apply to text inputs and appear in the report; use synthetic data.</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#594139] mb-1">
                      Maximum generated cases per page
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100000}
                      value={maxGeneratedCases}
                      onChange={(event) => setMaxGeneratedCases(Math.max(1, Math.min(100000, Number(event.target.value) || 1)))}
                      className="w-full h-8 px-2 rounded-lg bg-white border border-[#E6E6E6] text-xs text-[#212121] focus:outline-none focus:border-[#FF6C37]"
                    />
                    <p className="mt-1 text-[10px] text-[#8C8C8C]">The scanner runs up to this many deterministic cases, then reports the exact remaining count as pending. Increase it to cover more cases in one run.</p>
                  </div>
                  <Switch
                    label="Test every action order"
                    description="Also permute the actions chosen in each case. Untouched controls are excluded; repeated same-name row buttons are grouped as alternatives."
                    checked={includeActionOrderPermutations}
                    onChange={setIncludeActionOrderPermutations}
                  />
                </div>
              </div>
            )}
            <p className="text-[10px] text-[#8C8C8C]">
              Current-page-only is the default. Increase crawl depth to include linked pages; each page must finish its case queue before the next page is opened.
            </p>
            {exhaustiveInteractions && (
              <p className="text-[10px] text-[#8C8C8C]">
                The per-module AI goal is used only when exhaustive combinations are turned off; exhaustive mode tests every discovered safe control factor directly.
              </p>
            )}
          </div>

          {/* Advanced Execution Options — same accordion used on websites page */}
          <AdvancedExecutionAccordion
            advancedOpen={advancedOpen}
            setAdvancedOpen={setAdvancedOpen}
            browserEngine={browserEngine}
            setBrowserEngine={setBrowserEngine}
            viewportProfile={viewportProfile}
            handleViewportChange={handleViewportChange}
            viewportWidth={viewportWidth}
            setViewportWidth={setViewportWidth}
            viewportHeight={viewportHeight}
            setViewportHeight={setViewportHeight}
            timeoutSeconds={timeoutSeconds}
            setTimeoutSeconds={setTimeoutSeconds}
            maxDepth={maxDepth}
            setMaxDepth={setMaxDepth}
            rateLimitRps={rateLimitRps}
            setRateLimitRps={setRateLimitRps}
            readOnlyMode={readOnlyMode}
            setReadOnlyMode={setReadOnlyMode}
            aiTestGoals={aiTestGoals}
            setAiTestGoals={setAiTestGoals}
            useAiGeneration={useAiGeneration}
            setUseAiGeneration={setUseAiGeneration}
            aiExplainFailures={aiExplainFailures}
            setAiExplainFailures={setAiExplainFailures}
            recordTrace={recordTrace}
            setRecordTrace={setRecordTrace}
            recordVideo={recordVideo}
            setRecordVideo={setRecordVideo}
            headedBrowser={headedBrowser}
            setHeadedBrowser={setHeadedBrowser}
            aiOptionsEnabled={true}
          />

          <div className="bg-[#FFF8F6] border border-[#FFD5C8] rounded-lg px-4 py-3 text-xs text-[#594139]">
            <strong>{selectedModules.length} selected modules</strong> will be scanned sequentially.
            Estimated time: <strong>~{Math.round(selectedModules.length * (parseInt(timeoutSeconds) || 600) / 60)} min</strong> total.
          </div>

          <div className="flex justify-between pt-1">
            <Button variant="outline" onClick={() => setStep(2)}>← Back</Button>
            <Button onClick={() => setStep(4)} rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
              Run {selectedModules.length} Scan{selectedModules.length !== 1 ? "s" : ""}
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 4: Sequential execution ──────────────────────────────────── */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[#212121]">
              Scanning module {Math.min(currentIndex + 1, scanResults.length)} of {scanResults.length}...
            </p>
            <button
              onClick={stopTesting}
              className="text-xs text-red-500 hover:underline"
            >
              Stop
            </button>
          </div>
          {currentMessage && <p className="text-xs text-[#6B6B6B] break-words">{currentMessage}</p>}

          <div className="border border-[#E6E6E6] rounded-xl divide-y divide-[#F5F3F3] max-h-80 overflow-y-auto">
            {scanResults.map((r, idx) => (
              <div key={idx} className="flex items-center gap-3 px-4 py-3">
                <StatusIcon status={r.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#212121] truncate">{r.moduleName}</p>
                  <p className="text-xs text-[#8C8C8C] truncate">{r.moduleUrl}</p>
                </div>
                <div className="text-xs text-[#6B6B6B] shrink-0">
                  {r.status === "pending" && "Waiting..."}
                  {r.status === "running" && <span className="text-blue-500 font-medium">Running...</span>}
                  {r.status === "completed" && r.score != null && (
                    <span className="text-green-600 font-semibold">{r.score.toFixed(0)}/100</span>
                  )}
                  {r.status === "incomplete" && <span className="text-amber-600 font-medium">Coverage incomplete</span>}
                  {r.status === "cancelled" && <span className="text-gray-500">Stopped</span>}
                  {r.status === "failed" && <span className="text-red-500">Failed</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Step 5: Summary ────────────────────────────────────────────────── */}
      {step === 5 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#F5F3F3] rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-[#212121]">{scanResults.length}</p>
              <p className="text-xs text-[#6B6B6B] mt-0.5">Total Scanned</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-green-600">{completedCount}</p>
              <p className="text-xs text-green-700 mt-0.5">Completed</p>
            </div>
            <div className="bg-red-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-red-600">{failedCount}</p>
              <p className="text-xs text-red-700 mt-0.5">Failed</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-amber-600">{incompleteCount}</p>
              <p className="text-xs text-amber-700 mt-0.5">Coverage Incomplete</p>
            </div>
          </div>

          <div className="border border-[#E6E6E6] rounded-xl divide-y divide-[#F5F3F3] max-h-72 overflow-y-auto">
            {scanResults.map((r, idx) => (
              <div key={idx} className="flex items-center gap-3 px-4 py-3">
                <StatusIcon status={r.status} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#212121] truncate">{r.moduleName}</p>
                  {r.status === "failed" && r.errorMessage && (
                    <p className="text-xs text-red-500 truncate">{r.errorMessage}</p>
                  )}
                  {r.status === "incomplete" && r.errorMessage && (
                    <p className="text-xs text-amber-600 truncate">{r.errorMessage}</p>
                  )}
                </div>
                {r.grade && (
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${GRADE_COLORS[r.grade] ?? "text-gray-600 bg-gray-50"}`}>
                    {r.grade}
                  </span>
                )}
                {r.score != null && (
                  <span className="text-xs text-[#6B6B6B] w-12 text-right">{r.score.toFixed(0)}/100</span>
                )}
                {r.runId && (
                  <a
                    href={`/reports/${r.runId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF6C37] hover:text-[#E5592B]"
                    title="View full report"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-1">
            <Button variant="outline" onClick={resetWizard} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
              Run Again
            </Button>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
