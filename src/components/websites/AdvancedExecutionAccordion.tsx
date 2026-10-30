"use client";

import React from "react";
import { SlidersHorizontal, ChevronDown, ChevronUp, Laptop, Shield, Sparkles } from "lucide-react";
import { Switch } from "@/components/common/Input";

export type ViewportProfileType = "desktop" | "laptop" | "tablet" | "mobile" | "custom";

interface AdvancedExecutionAccordionProps {
  advancedOpen: boolean;
  setAdvancedOpen: (val: boolean) => void;
  browserEngine: "chromium" | "firefox" | "webkit";
  setBrowserEngine: (val: "chromium" | "firefox" | "webkit") => void;
  viewportProfile: ViewportProfileType;
  handleViewportChange: (val: ViewportProfileType) => void;
  viewportWidth: number;
  setViewportWidth: (val: number) => void;
  viewportHeight: number;
  setViewportHeight: (val: number) => void;
  timeoutSeconds: string;
  setTimeoutSeconds: (val: string) => void;
  maxDepth: number;
  setMaxDepth: (val: number) => void;
  rateLimitRps: number;
  setRateLimitRps: (val: number) => void;
  readOnlyMode: boolean;
  setReadOnlyMode: (val: boolean) => void;
  aiTestGoals: string;
  setAiTestGoals: (val: string) => void;
  useAiGeneration: boolean;
  setUseAiGeneration: (val: boolean) => void;
  aiExplainFailures: boolean;
  setAiExplainFailures: (val: boolean) => void;
  recordTrace: boolean;
  setRecordTrace: (val: boolean) => void;
  recordVideo: boolean;
  setRecordVideo: (val: boolean) => void;
  headedBrowser?: boolean;
  setHeadedBrowser?: (val: boolean) => void;
}

export function AdvancedExecutionAccordion({
  advancedOpen,
  setAdvancedOpen,
  browserEngine,
  setBrowserEngine,
  viewportProfile,
  handleViewportChange,
  viewportWidth,
  setViewportWidth,
  viewportHeight,
  setViewportHeight,
  timeoutSeconds,
  setTimeoutSeconds,
  maxDepth,
  setMaxDepth,
  rateLimitRps,
  setRateLimitRps,
  readOnlyMode,
  setReadOnlyMode,
  aiTestGoals,
  setAiTestGoals,
  useAiGeneration,
  setUseAiGeneration,
  aiExplainFailures,
  setAiExplainFailures,
  recordTrace,
  setRecordTrace,
  recordVideo,
  setRecordVideo,
  headedBrowser = false,
  setHeadedBrowser = () => {},
}: AdvancedExecutionAccordionProps) {
  return (
    <div className="pt-1">
      <button
        type="button"
        onClick={() => setAdvancedOpen(!advancedOpen)}
        className="w-full flex items-center justify-between py-2 text-left group focus:outline-none cursor-pointer"
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
              {browserEngine.toUpperCase()} • {viewportProfile} • Depth {maxDepth} • {timeoutSeconds}s • {readOnlyMode ? "Safe Mode" : "Mutations Allowed"}
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
        <div className="mt-2 pt-3 border-t border-[#E6E6E6] space-y-4 animate-in fade-in duration-150">
          {/* Part 1: Browser & Device Settings */}
          <div>
            <h4 className="text-xs font-semibold text-[#212121] mb-2 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-[#594139]" />
              Browser & Viewport Profile
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#594139] mb-1">
                  Target Browser Engine
                </label>
                <select
                  value={browserEngine}
                  onChange={(e) => setBrowserEngine(e.target.value as "chromium" | "firefox" | "webkit")}
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
                  onChange={(e) => handleViewportChange(e.target.value as ViewportProfileType)}
                  className="w-full h-8 px-2 rounded-lg bg-white border border-[#E6E6E6] text-xs text-[#212121] focus:outline-none focus:border-[#FF6C37]"
                >
                  <option value="desktop">Desktop (1440 × 900)</option>
                  <option value="laptop">Laptop (1280 × 800)</option>
                  <option value="tablet">Tablet (1024 × 1366)</option>
                  <option value="mobile">Mobile (393 × 852)</option>
                  <option value="custom">Custom Resolution</option>
                </select>
              </div>

              {viewportProfile === "custom" ? (
                <div className="grid grid-cols-2 gap-1.5">
                  <div>
                    <label className="block text-[10px] font-medium text-[#594139] mb-1">Width (px)</label>
                    <input
                      type="number"
                      value={viewportWidth}
                      onChange={(e) => setViewportWidth(Number(e.target.value))}
                      className="w-full h-8 px-2 rounded-lg bg-white border border-[#E6E6E6] text-xs text-[#212121] focus:outline-none focus:border-[#FF6C37]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-[#594139] mb-1">Height (px)</label>
                    <input
                      type="number"
                      value={viewportHeight}
                      onChange={(e) => setViewportHeight(Number(e.target.value))}
                      className="w-full h-8 px-2 rounded-lg bg-white border border-[#E6E6E6] text-xs text-[#212121] focus:outline-none focus:border-[#FF6C37]"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-medium text-[#594139] mb-1">
                    Current Resolution
                  </label>
                  <div className="h-8 px-2.5 rounded-lg bg-[#F5F3F3] border border-[#E6E6E6] flex items-center text-xs font-mono text-[#594139]">
                    {viewportWidth} × {viewportHeight} px
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Part 2: Crawl & Safety Guardrails */}
          <div className="pt-2 border-t border-[#E6E6E6]">
            <h4 className="text-xs font-semibold text-[#212121] mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#594139]" />
              Crawler Limits & Safety Controls
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#594139] mb-1">
                  Exploration Max Depth ({maxDepth} hops)
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={maxDepth}
                  onChange={(e) => setMaxDepth(Number(e.target.value))}
                  className="w-full accent-[#FF6C37] cursor-pointer"
                />
                <span className="text-[10px] text-[#8C8C8C] flex justify-between">
                  <span>1 hop (Shallow)</span>
                  <span>5 hops (Deep)</span>
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#594139] mb-1">
                  Scan Timeout (sec)
                </label>
                <input
                  type="number"
                  min="30"
                  max="600"
                  value={timeoutSeconds}
                  onChange={(e) => setTimeoutSeconds(e.target.value)}
                  className="w-full h-8 px-2 rounded-lg bg-white border border-[#E6E6E6] text-xs text-[#212121] focus:outline-none focus:border-[#FF6C37]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#594139] mb-1">
                  Rate Limit (Req/sec)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={rateLimitRps}
                  onChange={(e) => setRateLimitRps(Number(e.target.value))}
                  className="w-full h-8 px-2 rounded-lg bg-white border border-[#E6E6E6] text-xs text-[#212121] focus:outline-none focus:border-[#FF6C37]"
                />
              </div>
            </div>

            {/* Read-Only Safety Switch */}
            <div className="mt-3 bg-[#FBF9F8] p-3 rounded-lg border border-[#E6E6E6]">
              <Switch
                label="Safe Read-Only Mode (Recommended)"
                description="When enabled, the automated tester blocks destructive POST/DELETE form submissions and only executes safe navigation and assertions."
                checked={readOnlyMode}
                onChange={setReadOnlyMode}
              />
            </div>
          </div>

          {/* Part 3: AI Intelligence Options */}
          <div className="pt-2 border-t border-[#E6E6E6]">
            <h4 className="text-xs font-semibold text-[#212121] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6C37]" />
              AI Test Intelligence
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-[#594139] mb-1">
                  Natural Language AI Test Goals <span className="text-[#8C8C8C] font-normal">(optional guidance for LLM agent)</span>
                </label>
                <input
                  type="text"
                  value={aiTestGoals}
                  onChange={(e) => setAiTestGoals(e.target.value)}
                  placeholder="e.g. Focus on sign-up flow, navigation links, and search bar interactions"
                  className="w-full h-8 px-3 rounded-lg bg-white border border-[#E6E6E6] text-xs text-[#212121] placeholder-[#8C8C8C] focus:outline-none focus:border-[#FF6C37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Switch
                  label="Autonomous AI Journey Generation"
                  description="Use LLM to detect landmarks and generate journey test cases."
                  checked={useAiGeneration}
                  onChange={setUseAiGeneration}
                />
                <Switch
                  label="AI Failure Diagnosis & Root Cause Explainer"
                  description="Automatically explain defects and suggest remediation patches."
                  checked={aiExplainFailures}
                  onChange={setAiExplainFailures}
                />
              </div>
            </div>
          </div>

          {/* Part 4: Diagnostics & Tracing */}
          <div className="pt-2 border-t border-[#E6E6E6] grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Switch
              label="Record Playwright Trace (trace.zip)"
              description="Saves full step-by-step DOM snapshots and action replays."
              checked={recordTrace}
              onChange={setRecordTrace}
            />
            <Switch
              label="Record Video Capture (.webm)"
              description="Captures full video stream of browser execution."
              checked={recordVideo}
              onChange={setRecordVideo}
            />
            <Switch
              label="Live Browser View (Headed Mode)"
              description="Opens a visible desktop Chromium window to observe test execution live."
              checked={headedBrowser}
              onChange={setHeadedBrowser}
            />
          </div>
        </div>
      )}
    </div>
  );
}
