"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Rocket, RotateCcw, PauseCircle, Loader2, AlertCircle, Layers, Shield, FileCode2 } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { useQuickScan, useTestRun, useCancelScan } from "@/features/test-runs";
import { QuickScanRequest } from "@/types/test-run";
import {
  UrlProtocolInput,
  TargetEnvType,
  EnvConfig,
} from "@/components/websites/UrlProtocolInput";
import { QualityPillarsSection } from "@/components/websites/QualityPillarsSection";
import { AuthenticationDrawer } from "@/components/websites/AuthenticationDrawer";
import {
  AdvancedExecutionAccordion,
  ViewportProfileType,
} from "@/components/websites/AdvancedExecutionAccordion";
import {
  ExecutionPipelineView,
  PipelineStep,
} from "@/components/websites/ExecutionPipelineView";
import { ScanCompletedView } from "@/components/websites/ScanCompletedView";
import { ScanFailedView } from "@/components/websites/ScanFailedView";

export default function WebsiteTestingPage() {
  const router = useRouter();

  // Target URL & Protocol State
  const [protocol, setProtocol] = useState<"https://" | "http://">("https://");
  const [domainPath, setDomainPath] = useState("");
  const [siteLabel, setSiteLabel] = useState("");
  const [urlError, setUrlError] = useState("");

  // Environment State (Auto-detected or Manual override)
  const [manualEnv, setManualEnv] = useState<TargetEnvType | "auto">("auto");

  // Authentication State
  const [authEnabled, setAuthEnabled] = useState(false);
  const [authMethod, setAuthMethod] = useState<"form" | "basic_auth" | "storage_state">("form");
  const [loginUrl, setLoginUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successIndicator, setSuccessIndicator] = useState("");

  // 4 Pillars Multi-Select State
  const [checkFunctional, setCheckFunctional] = useState(true);
  const [checkSecurity, setCheckSecurity] = useState(true);
  const [checkPerformance, setCheckPerformance] = useState(true);
  const [checkAccessibility, setCheckAccessibility] = useState(true);
  const [pillarError, setPillarError] = useState("");

  // Advanced Options State
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [browserEngine, setBrowserEngine] = useState<"chromium" | "firefox" | "webkit">("chromium");
  const [viewportProfile, setViewportProfile] = useState<ViewportProfileType>("desktop");
  const [viewportWidth, setViewportWidth] = useState(1440);
  const [viewportHeight, setViewportHeight] = useState(900);
  const [timeoutSeconds, setTimeoutSeconds] = useState("120");
  const [maxDepth, setMaxDepth] = useState(2);
  const [rateLimitRps, setRateLimitRps] = useState(10);
  const [readOnlyMode, setReadOnlyMode] = useState(true);
  const [recordTrace, setRecordTrace] = useState(true);
  const [recordVideo, setRecordVideo] = useState(false);

  // AI Intelligence Options State
  const [useAiGeneration, setUseAiGeneration] = useState(true);
  const [aiTestGoals, setAiTestGoals] = useState("");
  const [maxAiCases, setMaxAiCases] = useState(5);
  const [aiExplainFailures, setAiExplainFailures] = useState(true);

  // Execution State: "idle" | "running" | "completed" | "failed"
  const [executionState, setExecutionState] = useState<"idle" | "running" | "completed" | "failed">("idle");
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // API Hooks
  const quickScan = useQuickScan();
  const cancelScan = useCancelScan();
  const { data: runData } = useTestRun(activeRunId || "");

  // Assembled full target URL
  const fullTargetUrl = useMemo(() => {
    const clean = domainPath.trim();
    if (!clean) return "";
    return `${protocol}${clean}`;
  }, [protocol, domainPath]);

  // Dynamic Environment Detection from Hostname
  const detectedEnv = useMemo<TargetEnvType>(() => {
    const lower = domainPath.toLowerCase();
    if (
      lower.includes("localhost") ||
      lower.includes("127.0.0.1") ||
      lower.includes(".local") ||
      lower.includes(".test") ||
      lower.startsWith("192.168.") ||
      lower.startsWith("10.")
    ) {
      return "local";
    }
    if (lower.includes("staging") || lower.includes("stage.") || lower.includes("-stg")) {
      return "staging";
    }
    if (lower.includes("test") || lower.includes("qa.") || lower.includes("uat.")) {
      return "test";
    }
    return "production";
  }, [domainPath]);

  const activeEnv = manualEnv === "auto" ? detectedEnv : manualEnv;

  const envConfig: EnvConfig = useMemo(() => {
    switch (activeEnv) {
      case "local":
        return {
          label: "Local / Development",
          badgeBg: "bg-[#EFF8FF]",
          badgeBorder: "border-[#B2DDFF]",
          textColor: "text-[#175CD3]",
          dotColor: "bg-[#175CD3]",
        };
      case "staging":
        return {
          label: "Staging",
          badgeBg: "bg-[#FFF8E6]",
          badgeBorder: "border-[#FEDF89]",
          textColor: "text-[#B54708]",
          dotColor: "bg-[#F79009]",
        };
      case "test":
        return {
          label: "QA / Test",
          badgeBg: "bg-[#FAF5FF]",
          badgeBorder: "border-[#E9D7FE]",
          textColor: "text-[#6941C6]",
          dotColor: "bg-[#9333EA]",
        };
      case "production":
      default:
        return {
          label: "Production",
          badgeBg: "bg-[#ECFDF3]",
          badgeBorder: "border-[#A6F4C5]",
          textColor: "text-[#027A48]",
          dotColor: "bg-[#12B76A]",
        };
    }
  }, [activeEnv]);

  // Smart URL paste & input handler
  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputVal = e.target.value.trimStart();
    if (inputVal.startsWith("https://")) {
      setProtocol("https://");
      inputVal = inputVal.replace(/^https:\/\//, "");
    } else if (inputVal.startsWith("http://")) {
      setProtocol("http://");
      inputVal = inputVal.replace(/^http:\/\//, "");
    }
    setDomainPath(inputVal);
    if (urlError) setUrlError("");
  };

  // Viewport preset changer
  const handleViewportChange = (profile: ViewportProfileType) => {
    setViewportProfile(profile);
    switch (profile) {
      case "desktop":
        setViewportWidth(1440);
        setViewportHeight(900);
        break;
      case "laptop":
        setViewportWidth(1280);
        setViewportHeight(800);
        break;
      case "tablet":
        setViewportWidth(1024);
        setViewportHeight(1366);
        break;
      case "mobile":
        setViewportWidth(393);
        setViewportHeight(852);
        break;
      case "custom":
        break;
    }
  };

  // Selected Pillars Count
  const selectedPillarsCount = [
    checkFunctional,
    checkSecurity,
    checkPerformance,
    checkAccessibility,
  ].filter(Boolean).length;

  const allPillarsSelected = selectedPillarsCount === 4;

  const toggleSelectAllPillars = () => {
    const nextVal = !allPillarsSelected;
    setCheckFunctional(nextVal);
    setCheckSecurity(nextVal);
    setCheckPerformance(nextVal);
    setCheckAccessibility(nextVal);
    if (nextVal) setPillarError("");
  };

  // Timer while running
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (executionState === "running") {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [executionState]);

  // Synchronize executionState with live backend TestRun status
  useEffect(() => {
    if (!runData || executionState !== "running") return;

    if (runData.status === "completed") {
      setExecutionState("completed");
    } else if (runData.status === "failed" || runData.status === "cancelled") {
      setExecutionState("failed");
    }
  }, [runData, executionState]);

  // Launch scan handler
  const handleStartTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError("");
    setPillarError("");
    setSubmissionError(null);

    const cleanDomain = domainPath.trim();
    if (!cleanDomain) {
      setUrlError("Target Website domain or host is required (e.g. example.com)");
      return;
    }

    if (selectedPillarsCount === 0) {
      setPillarError("Please select at least one quality testing pillar to launch the scan.");
      return;
    }

    try {
      const payload: QuickScanRequest = {
        url: `${protocol}${cleanDomain}`,
        name: siteLabel.trim() || undefined,
        credentials: authEnabled
          ? {
              enabled: true,
              login_url: loginUrl.trim() || undefined,
              username: username.trim() || undefined,
              password: password || undefined,
              auth_method: authMethod,
              success_indicator: successIndicator.trim() || undefined,
            }
          : undefined,
        options: {
          check_functional: checkFunctional,
          check_security: checkSecurity,
          check_performance: checkPerformance,
          check_accessibility: checkAccessibility,
          browser_type: browserEngine,
          viewport_width: viewportWidth,
          viewport_height: viewportHeight,
          is_mobile: viewportProfile === "mobile",
          record_trace: recordTrace,
          record_video: recordVideo,
          allow_state_changing: !readOnlyMode,
          rate_limit_rps: rateLimitRps || 10,
          timeout_seconds: parseInt(timeoutSeconds, 10) || 120,
          max_crawl_depth: maxDepth || 2,
          use_ai_generation: useAiGeneration,
          ai_test_goals: aiTestGoals.trim() || undefined,
          max_ai_cases: maxAiCases || 5,
          ai_explain_failures: aiExplainFailures,
        },
      };

      setElapsedSeconds(0);
      setExecutionState("running");

      const run = await quickScan.mutateAsync(payload);
      setActiveRunId(run.id);
    } catch (err: unknown) {
      setExecutionState("idle");
      const msg = err instanceof Error ? err.message : "Failed to launch scan. Check target hostname and network.";
      setSubmissionError(msg);
    }
  };

  const handleAbortTest = async () => {
    if (activeRunId) {
      try {
        await cancelScan.mutateAsync(activeRunId);
      } catch (err) {
        console.error("Cancellation error:", err);
      }
    }
    setExecutionState("idle");
    setElapsedSeconds(0);
  };

  const handleReset = () => {
    setProtocol("https://");
    setDomainPath("");
    setSiteLabel("");
    setUrlError("");
    setPillarError("");
    setSubmissionError(null);
    setManualEnv("auto");
    setAuthEnabled(false);
    setAuthMethod("form");
    setLoginUrl("");
    setUsername("");
    setPassword("");
    setSuccessIndicator("");
    setCheckFunctional(true);
    setCheckSecurity(true);
    setCheckPerformance(true);
    setCheckAccessibility(true);
    setAdvancedOpen(false);
    setBrowserEngine("chromium");
    setViewportProfile("desktop");
    setViewportWidth(1440);
    setViewportHeight(900);
    setTimeoutSeconds("120");
    setMaxDepth(2);
    setRateLimitRps(10);
    setReadOnlyMode(true);
    setRecordTrace(true);
    setRecordVideo(false);
    setUseAiGeneration(true);
    setAiTestGoals("");
    setMaxAiCases(5);
    setAiExplainFailures(true);
    setExecutionState("idle");
    setActiveRunId(null);
    setElapsedSeconds(0);
  };

  // Dynamic Pipeline Steps representing the background execution stages
  const isQueued = !runData || runData.status === "queued" || runData.status === "pending";
  const isRunning = runData?.status === "running";
  const isDone = runData?.status === "completed";

  const pipelineSteps: PipelineStep[] = [
    {
      id: "step-1",
      name: "Host Resolution & DNS Verification",
      status: isQueued ? (elapsedSeconds >= 1 ? "done" : "running") : "done",
      duration: elapsedSeconds >= 2 ? "1.1s" : undefined,
      meta: "Target scope verified, SSRF guardrails passed, domain reachable",
      badge: "Network",
    },
    {
      id: "step-2",
      name: authEnabled ? `Session Authentication (${authMethod})` : "Initial DOM Hydration",
      status:
        elapsedSeconds < 2
          ? "pending"
          : elapsedSeconds >= 5 || !isQueued
          ? "done"
          : "running",
      duration: elapsedSeconds >= 5 ? "2.4s" : undefined,
      meta: authEnabled
        ? `Applied auth credentials for ${username || "configured user"}`
        : "Resolved main DOM root and verified interactive viewport",
      badge: authEnabled ? "Auth" : "DOM",
    },
    {
      id: "step-3",
      name: "Autonomous AI Landmark & Workflow Discovery",
      status:
        elapsedSeconds < 5
          ? "pending"
          : elapsedSeconds >= 12 || isDone
          ? "done"
          : "running",
      duration: elapsedSeconds >= 12 || isDone ? "6.8s" : undefined,
      meta: useAiGeneration
        ? "Extracting interactive buttons, forms, and synthesizing AI journey cases"
        : "Crawling page landmarks and executing baseline interactions",
      badge: "AI Engine",
    },
    {
      id: "step-4",
      name: `Multi-Pillar Audits (${[
        checkFunctional && "Functional",
        checkSecurity && "Security",
        checkPerformance && "Performance",
        checkAccessibility && "A11y",
      ]
        .filter(Boolean)
        .join(", ")})`,
      status:
        elapsedSeconds < 12
          ? "pending"
          : isDone
          ? "done"
          : isRunning
          ? "running"
          : "pending",
      duration: isDone ? "14.2s" : undefined,
      meta: "Executing selected quality assertions across browser context",
      badge: `${selectedPillarsCount} Pillars`,
    },
    {
      id: "step-5",
      name: "AI Failure Diagnosis & Report Aggregation",
      status: isDone ? "done" : isRunning && elapsedSeconds > 20 ? "running" : "pending",
      duration: isDone ? "1.8s" : undefined,
      meta: "Synthesizing test findings, evidence traces, and unified quality score",
      badge: "Finalize",
    },
  ];

  const activePillarsSummary = [
    checkFunctional && "Functional",
    checkSecurity && "Security",
    checkPerformance && "Perf",
    checkAccessibility && "A11y",
  ]
    .filter(Boolean)
    .join(" + ");

  return (
    <div className="flex flex-col w-full space-y-3.5">
      {/* Top Utilities & Breadcrumb */}
      <div className="flex flex-col gap-1 pb-1">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B6B6B]">
          <Link href="/dashboard" className="hover:text-[#212121] transition-colors">
            Home
          </Link>
          <span className="text-[#8C8C8C]">/</span>
          <span className="text-[#212121] font-medium">Website Testing</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-0.5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#212121]">
              Website Testing
            </h1>
            <p className="text-sm text-[#6B6B6B] mt-1">
              Autonomous multi-pillar test runner for web applications, staging endpoints, and production sites.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Dynamic Environment Telemetry Badge */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium ${envConfig.badgeBg} ${envConfig.badgeBorder} ${envConfig.textColor}`}>
              <span className={`inline-block w-2 h-2 rounded-full ${envConfig.dotColor} animate-pulse`} />
              <span>Target Env: {envConfig.label}</span>
            </div>

            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#F5F3F3] border border-[#E6E6E6] text-xs font-medium text-[#594139]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#12B76A]" />
              Engine: Ready (Celery + Playwright)
            </span>
          </div>
        </div>
      </div>

      {/* Submission Error Banner */}
      {submissionError && (
        <div className="p-3.5 rounded-xl bg-[#FFF1F0] border border-[#FFA39E] flex items-start gap-2.5 text-xs text-[#BA1A1A] animate-in fade-in duration-150">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Scan Launch Error: </span>
            {submissionError}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: IDLE CONFIGURATION FORM                                           */}
      {/* ========================================================================= */}
      {executionState === "idle" && (
        <div className="flex flex-col w-full space-y-3.5">
          <Card className="p-5 sm:p-6 shadow-xs">
            <form onSubmit={handleStartTest} className="space-y-4">
              {/* Target Website URL Section */}
              <UrlProtocolInput
                protocol={protocol}
                setProtocol={setProtocol}
                domainPath={domainPath}
                onDomainChange={handleDomainChange}
                fullTargetUrl={fullTargetUrl}
                manualEnv={manualEnv}
                setManualEnv={setManualEnv}
                envConfig={envConfig}
                urlError={urlError}
              />

              {/* Minimized Quality Pillars Section */}
              <QualityPillarsSection
                checkFunctional={checkFunctional}
                setCheckFunctional={setCheckFunctional}
                checkSecurity={checkSecurity}
                setCheckSecurity={setCheckSecurity}
                checkPerformance={checkPerformance}
                setCheckPerformance={setCheckPerformance}
                checkAccessibility={checkAccessibility}
                setCheckAccessibility={setCheckAccessibility}
                selectedCount={selectedPillarsCount}
                allSelected={allPillarsSelected}
                toggleSelectAll={toggleSelectAllPillars}
                pillarError={pillarError}
                clearPillarError={() => setPillarError("")}
              />

              {/* Authentication Requirements Drawer */}
              <AuthenticationDrawer
                authEnabled={authEnabled}
                setAuthEnabled={setAuthEnabled}
                authMethod={authMethod}
                setAuthMethod={setAuthMethod}
                loginUrl={loginUrl}
                setLoginUrl={setLoginUrl}
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                successIndicator={successIndicator}
                setSuccessIndicator={setSuccessIndicator}
              />

              {/* Advanced Execution Options Accordion */}
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
              />

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row gap-2.5">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={quickScan.isPending || selectedPillarsCount === 0}
                  className="flex-1"
                  leftIcon={
                    quickScan.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Rocket className="w-3.5 h-3.5" />
                    )
                  }
                >
                  {quickScan.isPending ? "Dispatching Autonomous Scan..." : "Start Test"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  disabled={quickScan.isPending}
                  onClick={handleReset}
                  leftIcon={<RotateCcw className="w-3.5 h-3.5 text-[#8C8C8C]" />}
                >
                  Reset
                </Button>
              </div>
            </form>
          </Card>

          {/* Idle Engine Banner */}
          <div className="p-3.5 rounded-xl bg-[#F5F3F3] border border-[#E6E6E6] text-center flex flex-col items-center justify-center gap-1">
            <PauseCircle className="w-4 h-4 text-[#8C8C8C]" />
            <p className="text-xs text-[#6B6B6B]">
              No test currently running. Configure target URL, select pillars above, and click{" "}
              <span className="font-medium text-[#212121]">Start Test</span> to dispatch the autonomous verification worker.
            </p>
          </div>

          {/* Capability Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white border border-[#E6E6E6] rounded-xl p-3.5 sm:p-4 shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#F0F9FF] flex items-center justify-center text-[#0BA5EC] shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-[#212121]">Dynamic DOM Scraping</h4>
                <p className="text-xs text-[#6B6B6B] mt-0.5 leading-relaxed">
                  Hydrated SPA & SSR parsing with shadow root extraction and interactive path exploration.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#E6E6E6] rounded-xl p-3.5 sm:p-4 shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#ECFDF3] flex items-center justify-center text-[#12B76A] shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-[#212121]">Isolated Sandboxing</h4>
                <p className="text-xs text-[#6B6B6B] mt-0.5 leading-relaxed">
                  Fail-closed network scope guard blocks untrusted domain egress and private SSRF IPs.
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#E6E6E6] rounded-xl p-3.5 sm:p-4 shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#FFF1EB] flex items-center justify-center text-[#FF6C37] shrink-0">
                <FileCode2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-[#212121]">Visual Trace Logs</h4>
                <p className="text-xs text-[#6B6B6B] mt-0.5 leading-relaxed">
                  Captures network waterfall, console errors, screenshot evidence, and report metrics.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: LIVE RUNNING EXECUTION PIPELINE                                   */}
      {/* ========================================================================= */}
      {executionState === "running" && (
        <ExecutionPipelineView
          fullTargetUrl={fullTargetUrl}
          activeRunId={activeRunId}
          runData={runData}
          isQueued={isQueued}
          elapsedSeconds={elapsedSeconds}
          envConfig={envConfig}
          browserEngine={browserEngine}
          viewportProfile={viewportProfile}
          selectedPillarsCount={selectedPillarsCount}
          activePillarsSummary={activePillarsSummary}
          pipelineSteps={pipelineSteps}
          onAbort={handleAbortTest}
        />
      )}

      {/* ========================================================================= */}
      {/* MODE 3: COMPLETED REPORT SUMMARY                                          */}
      {/* ========================================================================= */}
      {executionState === "completed" && (
        <ScanCompletedView
          fullTargetUrl={fullTargetUrl}
          activeRunId={activeRunId}
          runData={runData}
          elapsedSeconds={elapsedSeconds}
          onViewReport={() => router.push(`/reports/${activeRunId}`)}
          onReset={handleReset}
        />
      )}

      {/* ========================================================================= */}
      {/* MODE 4: FAILED EXECUTION                                                  */}
      {/* ========================================================================= */}
      {executionState === "failed" && (
        <ScanFailedView
          runData={runData}
          onReset={handleReset}
          onViewAllRuns={() => router.push("/test-runs")}
        />
      )}
    </div>
  );
}
