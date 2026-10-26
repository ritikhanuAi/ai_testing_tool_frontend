"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  Lock,
  Eye,
  EyeOff,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Rocket,
  PauseCircle,
  FileCode2,
  Shield,
  Layers,
  CheckCircle2,
  Clock,
  Loader2,
  StopCircle,
  Laptop,
  Radio,
} from "lucide-react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Switch } from "@/components/common/Input";

interface PipelineStep {
  id: string;
  name: string;
  status: "done" | "running" | "pending";
  duration?: string;
  meta?: string;
  badge?: string;
}

export default function WebsiteTestingPage() {
  // Form State
  const [url, setUrl] = useState("https://example.com");
  const [authEnabled, setAuthEnabled] = useState(false);
  const [loginUrl, setLoginUrl] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Advanced Options State
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [browserEngine, setBrowserEngine] = useState("chromium");
  const [viewportProfile, setViewportProfile] = useState("desktop");
  const [timeoutSeconds, setTimeoutSeconds] = useState("120");
  const [maxDepth, setMaxDepth] = useState("3");

  // Execution State: "idle" | "running" | "completed"
  const [executionState, setExecutionState] = useState<"idle" | "running" | "completed">("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  // Timer simulation when running
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (executionState === "running") {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          const pct = Math.min(Math.round((next / 30) * 100), 94);
          setProgressPercent(pct);
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [executionState]);

  const handleStartTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setElapsedSeconds(0);
    setProgressPercent(15);
    setExecutionState("running");
  };

  const handleAbortTest = () => {
    setExecutionState("idle");
    setElapsedSeconds(0);
    setProgressPercent(0);
  };

  const handleReset = () => {
    setUrl("");
    setAuthEnabled(false);
    setLoginUrl("");
    setUsername("");
    setPassword("");
    setAdvancedOpen(false);
    setBrowserEngine("chromium");
    setViewportProfile("desktop");
    setTimeoutSeconds("120");
    setMaxDepth("3");
  };

  const pipelineSteps: PipelineStep[] = [
    {
      id: "step-1",
      name: "Opening site",
      status: elapsedSeconds >= 2 ? "done" : "running",
      duration: elapsedSeconds >= 2 ? "1.2s" : undefined,
      meta: "Resolved DNS, SSL handshake completed, 200 OK received",
      badge: "HTTP/2",
    },
    {
      id: "step-2",
      name: authEnabled ? "Logging in" : "Verifying Initial DOM Payload",
      status: elapsedSeconds < 2 ? "pending" : elapsedSeconds >= 6 ? "done" : "running",
      duration: elapsedSeconds >= 6 ? "3.4s" : undefined,
      meta: authEnabled
        ? `Authenticated session token verified for ${username || "qa-tester@domain"}`
        : "Hydrated SPA root and initial landmarks verified",
      badge: authEnabled ? "Session" : "DOM",
    },
    {
      id: "step-3",
      name: "Exploring DOM & Traversal",
      status: elapsedSeconds < 6 ? "pending" : elapsedSeconds >= 14 ? "done" : "running",
      duration: elapsedSeconds >= 14 ? "7.8s" : undefined,
      meta: "Crawling hyperlinks, inspecting interactive form targets, shadow roots",
      badge: "Crawl",
    },
    {
      id: "step-4",
      name: "Executing Synthetic Quality Assertions",
      status: elapsedSeconds < 14 ? "pending" : "running",
      meta: "Analyzing Accessibility (WCAG 2.1), Core Web Vitals (LCP, CLS), and Security Headers",
      badge: "4-Pillars",
    },
    {
      id: "step-5",
      name: "Compiling Composite Audit Report",
      status: "pending",
      meta: "Synthesizing test artifacts, network waterfalls, and visual traces",
      badge: "Finalize",
    },
  ];

  return (
    <div className="flex flex-col w-full space-y-3.5">
      {/* Top Utilities & Breadcrumb - Text formatting and alignment matched with Home page */}
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
              Autonomous AI crawler and functional verification suite for web applications and staging endpoints.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#F5F3F3] border border-[#E6E6E6] text-xs font-medium text-[#594139]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#12B76A]" />
              Workspace Engine: Ready
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: IDLE CONFIGURATION FORM                                           */}
      {/* ========================================================================= */}
      {executionState === "idle" && (
        <div className="flex flex-col w-full space-y-3.5">
          {/* Main Configuration Card - Full width aligned with page canvas */}
          <Card className="p-5 sm:p-6 shadow-xs">
            <form onSubmit={handleStartTest} className="space-y-4">
              {/* Target Website URL Section */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="target-url" className="text-xs font-semibold text-[#212121]">
                    Target Website URL
                  </label>
                  <span className="text-[10px] font-mono text-[#8C8C8C] uppercase tracking-wider">
                    Protocol: HTTPS
                  </span>
                </div>

                <div className="relative flex items-center">
                  <Globe className="w-4 h-4 absolute left-3 text-[#8C8C8C] pointer-events-none" />
                  <input
                    id="target-url"
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full h-10 pl-9 pr-3 rounded-lg bg-white border border-[#E6E6E6] text-sm text-[#212121] placeholder-[#8C8C8C] transition-all duration-150 focus:outline-none focus:border-[#FF6C37] focus:ring-2 focus:ring-[#FFF1EB]"
                  />
                </div>
                <p className="text-xs text-[#6B6B6B] mt-1.5">
                  Enter the base domain or staging host URL where the synthetic crawler should initiate traversal.
                </p>
              </div>

              {/* Authentication Requirements Drawer */}
              <div className="pt-3 border-t border-[#E6E6E6]">
                <div className="bg-[#FBF9F8] border border-[#E6E6E6] rounded-xl p-3.5 sm:p-4">
                  <Switch
                    label="This site requires authentication"
                    description="Provide pre-configured credentials or session tokens so the synthetic agent can access gated journeys."
                    checked={authEnabled}
                    onChange={setAuthEnabled}
                  />

                  {/* Expandable Credentials Drawer */}
                  {authEnabled && (
                    <div className="mt-3 pt-3 border-t border-[#E6E6E6] space-y-3 animate-in fade-in duration-150">
                      <div>
                        <label className="block text-xs font-medium text-[#594139] mb-1">
                          Login Page URL <span className="text-[#8C8C8C] font-normal">(optional)</span>
                        </label>
                        <input
                          type="text"
                          value={loginUrl}
                          onChange={(e) => setLoginUrl(e.target.value)}
                          placeholder="e.g. /login or full URL (Auto-detected if empty)"
                          className="w-full h-9 px-3 rounded-lg bg-white border border-[#E6E6E6] text-xs text-[#212121] placeholder-[#8C8C8C] focus:outline-none focus:border-[#FF6C37] focus:ring-2 focus:ring-[#FFF1EB]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-[#594139] mb-1">
                            Username / Test Email
                          </label>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="qa-tester@workspace.internal"
                            className="w-full h-9 px-3 rounded-lg bg-white border border-[#E6E6E6] text-xs text-[#212121] placeholder-[#8C8C8C] focus:outline-none focus:border-[#FF6C37] focus:ring-2 focus:ring-[#FFF1EB]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-[#594139] mb-1">
                            Password / Secure Secret
                          </label>
                          <div className="relative flex items-center">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••••••"
                              className="w-full h-9 pl-3 pr-8 rounded-lg bg-white border border-[#E6E6E6] text-xs text-[#212121] placeholder-[#8C8C8C] focus:outline-none focus:border-[#FF6C37] focus:ring-2 focus:ring-[#FFF1EB]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-2 p-1 text-[#8C8C8C] hover:text-[#212121] transition-colors"
                              title={showPassword ? "Hide password" : "Show password"}
                            >
                              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center gap-1.5 text-[11px] text-[#8C8C8C]">
                        <Lock className="w-3 h-3 text-[#12B76A]" />
                        <span>Credentials are used only for this test run and encrypted in transit via AES-256 GCM.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Advanced Execution Options Accordion */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setAdvancedOpen(!advancedOpen)}
                  className="w-full flex items-center justify-between py-1.5 text-left group focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#8C8C8C] group-hover:text-[#FF6C37] transition-colors" />
                    <span className="text-xs sm:text-sm font-semibold text-[#212121] group-hover:text-[#FF6C37] transition-colors">
                      Advanced Execution Options
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {!advancedOpen && (
                      <span className="hidden sm:inline font-mono text-[10px] text-[#594139] bg-[#F5F3F3] px-2 py-0.5 rounded border border-[#E6E6E6]">
                        Browser: Chromium • 1440px • 120s
                      </span>
                    )}
                    {advancedOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#8C8C8C]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#8C8C8C]" />
                    )}
                  </div>
                </button>

                {advancedOpen && (
                  <div className="mt-2.5 pt-3 border-t border-[#E6E6E6] space-y-3 animate-in fade-in duration-150">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#594139] mb-1">
                          Target Browser
                        </label>
                        <select
                          value={browserEngine}
                          onChange={(e) => setBrowserEngine(e.target.value)}
                          className="w-full h-8 px-2 rounded-lg bg-white border border-[#E6E6E6] text-xs text-[#212121] focus:outline-none focus:border-[#FF6C37]"
                        >
                          <option value="chromium">Chromium (V8 Headless)</option>
                          <option value="firefox">Firefox Gecko</option>
                          <option value="webkit">WebKit (Safari Emulated)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#594139] mb-1">
                          Viewport Profile
                        </label>
                        <select
                          value={viewportProfile}
                          onChange={(e) => setViewportProfile(e.target.value)}
                          className="w-full h-8 px-2 rounded-lg bg-white border border-[#E6E6E6] text-xs text-[#212121] focus:outline-none focus:border-[#FF6C37]"
                        >
                          <option value="desktop">Desktop (1440 × 900)</option>
                          <option value="laptop">Laptop (1280 × 800)</option>
                          <option value="tablet">Tablet (1024 × 1366)</option>
                          <option value="mobile">Mobile (393 × 852)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-[#594139] mb-1">
                          Crawl Timeout
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={timeoutSeconds}
                            onChange={(e) => setTimeoutSeconds(e.target.value)}
                            className="w-full h-8 px-2 rounded-lg bg-white border border-[#E6E6E6] text-xs text-[#212121] focus:outline-none focus:border-[#FF6C37]"
                          />
                          <span className="font-mono text-xs text-[#8C8C8C]">sec</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#F5F3F3] p-3 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <span className="font-medium text-[#212121]">Discovery Max Depth</span>
                        <p className="text-[11px] text-[#6B6B6B]">Recursion level through hyperlinked DOM nodes</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-[#212121] bg-white px-2 py-0.5 rounded border border-[#E6E6E6]">
                          {maxDepth} hops
                        </span>
                        <span className="text-[#8C8C8C]">•</span>
                        <span className="text-[11px] text-[#6B6B6B]">Cap: 45 pages</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col sm:flex-row gap-2.5">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="flex-1"
                  leftIcon={<Rocket className="w-3.5 h-3.5" />}
                >
                  Start Test
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
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
              No test currently running. Configure settings above and click{" "}
              <span className="font-medium text-[#212121]">Start Test</span> to launch the autonomous explorer agent.
            </p>
          </div>

          {/* Capability Specs Grid - Exact same 3-column width & alignment as Home page Telemetry Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white border border-[#E6E6E6] rounded-xl p-3.5 sm:p-4 shadow-xs flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#F0F9FF] flex items-center justify-center text-[#0BA5EC] shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-[#212121]">Dynamic DOM Scraping</h4>
                <p className="text-xs text-[#6B6B6B] mt-0.5 leading-relaxed">
                  Hydrated SPA & SSR parsing with shadow root extraction.
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
                  Stateless microVM containers recycled on each test iteration.
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
                  Captures network waterfall, console errors, and screenshots.
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
        <div className="flex flex-col w-full space-y-3.5 animate-in fade-in duration-200">
          {/* Hero Header & Live Counters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#E6E6E6] rounded-xl p-4 sm:p-5 shadow-xs">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-semibold text-[#212121]">
                  Website Testing: <span className="font-mono font-normal text-[#FF6C37]">{url}</span>
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0F9FF] text-[#004667] border border-[#006492]/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006492] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006492]" />
                  </span>
                  Running
                </span>
              </div>
              <p className="text-xs text-[#6B6B6B] mt-1 flex items-center gap-2">
                <span>Test initiated just now</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Laptop className="w-3.5 h-3.5" />
                  Chromium Desktop (1440x900)
                </span>
              </p>
            </div>

            {/* Live Counters - Styled matching TelemetryStrip on Home */}
            <div className="flex items-center gap-3">
              <div className="bg-[#F5F3F3] border border-[#E6E6E6] rounded-lg px-3 py-1.5 text-center">
                <span className="block text-[10px] text-[#6B6B6B] uppercase font-semibold">Throughput</span>
                <span className="font-mono text-sm font-semibold text-[#212121] tabular-nums">14 req/s</span>
              </div>
              <div className="bg-[#F5F3F3] border border-[#E6E6E6] rounded-lg px-3 py-1.5 text-center">
                <span className="block text-[10px] text-[#6B6B6B] uppercase font-semibold">Assertions</span>
                <span className="font-mono text-sm font-semibold text-[#12B76A] tabular-nums">
                  {Math.min(elapsedSeconds * 3, 42)} / 42
                </span>
              </div>
            </div>
          </div>

          {/* Locked Configuration Banner */}
          <Card className="p-4 sm:p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6C37] via-[#FF6C37] to-[#006492]" />
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-semibold text-[#212121] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#8C8C8C]" />
                Instance Configuration Locked During Run
              </span>
              <span className="text-[10px] font-mono text-[#8C8C8C]">Bypass CORS</span>
            </div>

            <div className="flex items-center justify-between bg-[#F5F3F3] px-3.5 py-2 rounded-lg text-xs font-mono text-[#212121]">
              <span className="truncate">{url}</span>
              <span className="text-[10px] text-[#6B6B6B] bg-white px-2 py-0.5 rounded border border-[#E6E6E6]">
                Read-only
              </span>
            </div>

            {/* Run Progress Status Row */}
            <div className="flex items-center gap-3 pt-3">
              <div className="h-9 bg-[#FF6C37] text-white text-xs font-medium px-4 rounded-lg flex-1 flex items-center justify-center gap-2 shadow-xs select-none">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Testing in progress...</span>
                <span className="font-mono text-[10px] bg-white/20 px-2 py-0.5 rounded">
                  {progressPercent}%
                </span>
              </div>

              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleAbortTest}
                leftIcon={<StopCircle className="w-3.5 h-3.5" />}
              >
                Abort Test
              </Button>
            </div>
          </Card>

          {/* Execution Pipeline Tree */}
          <Card className="p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E6E6E6]">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#FF6C37] animate-pulse" />
                <h3 className="text-sm font-semibold text-[#212121]">Execution Pipeline</h3>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#6B6B6B]">
                <span className="bg-[#F5F3F3] px-2.5 py-1 rounded border border-[#E6E6E6]">
                  Elapsed: <span className="text-[#212121] font-semibold">00:{elapsedSeconds < 10 ? `0${elapsedSeconds}` : elapsedSeconds}s</span>
                </span>
                <span className="bg-[#F5F3F3] px-2.5 py-1 rounded border border-[#E6E6E6]">
                  Estimated: ~00:30s
                </span>
              </div>
            </div>

            {/* Pipeline Step Progression */}
            <div className="pt-3.5 space-y-3.5">
              {pipelineSteps.map((step, idx) => {
                const isLast = idx === pipelineSteps.length - 1;

                return (
                  <div key={step.id} className="relative flex items-start gap-3">
                    {/* Vertical connecting line */}
                    {!isLast && (
                      <div
                        className={`absolute left-[13px] top-[26px] bottom-[-14px] w-[2px] ${
                          step.status === "done" ? "bg-[#12B76A]/40" : "bg-[#E6E6E6]"
                        }`}
                      />
                    )}

                    {/* Step Icon */}
                    <div className="relative z-10 shrink-0">
                      {step.status === "done" ? (
                        <div className="w-7 h-7 rounded-full bg-[#ECFDF3] border border-[#12B76A]/30 flex items-center justify-center text-[#12B76A]">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : step.status === "running" ? (
                        <div className="w-7 h-7 rounded-full bg-[#F0F9FF] border border-[#006492]/30 flex items-center justify-center text-[#006492]">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[#F5F3F3] border border-[#E6E6E6] flex items-center justify-center text-[#8C8C8C]">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 flex items-start justify-between gap-2 pt-0.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs sm:text-sm font-semibold ${
                              step.status === "done"
                                ? "text-[#212121]"
                                : step.status === "running"
                                ? "text-[#FF6C37]"
                                : "text-[#8C8C8C]"
                            }`}
                          >
                            {step.name}
                          </span>
                          {step.duration && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#ECFDF3] text-[#006D3C]">
                              Done ({step.duration})
                            </span>
                          )}
                        </div>
                        {step.meta && (
                          <p className="text-xs text-[#6B6B6B] mt-0.5 leading-relaxed">{step.meta}</p>
                        )}
                      </div>

                      {step.badge && (
                        <span className="font-mono text-[10px] text-[#594139] bg-[#F5F3F3] px-2 py-0.5 rounded border border-[#E6E6E6]">
                          {step.badge}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
