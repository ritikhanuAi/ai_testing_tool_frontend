"use client";

import React from "react";
import { Lock, Radio, StopCircle, Laptop, Loader2, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { TestRunResponse } from "@/types/test-run";
import { EnvConfig } from "./UrlProtocolInput";

export interface PipelineStep {
  id: string;
  name: string;
  status: "done" | "running" | "pending";
  duration?: string;
  meta?: string;
  badge?: string;
}

interface ExecutionPipelineViewProps {
  fullTargetUrl: string;
  activeRunId: string | null;
  runData: TestRunResponse | undefined;
  isQueued: boolean;
  elapsedSeconds: number;
  envConfig: EnvConfig;
  browserEngine: string;
  viewportProfile: string;
  selectedPillarsCount: number;
  activePillarsSummary: string;
  pipelineSteps: PipelineStep[];
  onAbort: () => void;
}

export function ExecutionPipelineView({
  fullTargetUrl,
  activeRunId,
  runData,
  isQueued,
  elapsedSeconds,
  envConfig,
  browserEngine,
  viewportProfile,
  selectedPillarsCount,
  activePillarsSummary,
  pipelineSteps,
  onAbort,
}: ExecutionPipelineViewProps) {
  return (
    <div className="flex flex-col w-full space-y-3.5 animate-in fade-in duration-200">
      {/* Hero Header & Live Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-[#E6E6E6] rounded-xl p-4 sm:p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-semibold text-[#212121]">
              Website Testing: <span className="font-mono font-normal text-[#FF6C37]">{fullTargetUrl}</span>
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0F9FF] text-[#004667] border border-[#006492]/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006492] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#006492]" />
              </span>
              {isQueued ? "Queued in Worker Pool" : "Scanning Active"}
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${envConfig.badgeBg} ${envConfig.badgeBorder} ${envConfig.textColor}`}>
              {envConfig.label}
            </span>
          </div>
          <p className="text-xs text-[#6B6B6B] mt-1 flex items-center gap-2">
            <span>Run ID: <span className="font-mono font-medium text-[#212121]">{activeRunId || "Initializing..."}</span></span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Laptop className="w-3.5 h-3.5" />
              {browserEngine.toUpperCase()} ({viewportProfile})
            </span>
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3">
          <div className="bg-[#F5F3F3] border border-[#E6E6E6] rounded-lg px-3 py-1.5 text-center">
            <span className="block text-[10px] text-[#6B6B6B] uppercase font-semibold">Active Pillars</span>
            <span className="font-mono text-sm font-semibold text-[#212121]">{selectedPillarsCount} of 4</span>
          </div>
          <div className="bg-[#F5F3F3] border border-[#E6E6E6] rounded-lg px-3 py-1.5 text-center">
            <span className="block text-[10px] text-[#6B6B6B] uppercase font-semibold">Duration</span>
            <span className="font-mono text-sm font-semibold text-[#12B76A] tabular-nums">
              00:{elapsedSeconds < 10 ? `0${elapsedSeconds}` : elapsedSeconds}s
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
            Execution Locked During Scan Run
          </span>
          <span className="text-[10px] font-mono text-[#8C8C8C]">Fail-Closed Sandbox</span>
        </div>

        <div className="flex items-center justify-between bg-[#F5F3F3] px-3.5 py-2 rounded-lg text-xs font-mono text-[#212121]">
          <span className="truncate">Target: {fullTargetUrl}</span>
          <span className="text-[10px] text-[#6B6B6B] bg-white px-2 py-0.5 rounded border border-[#E6E6E6]">
            Pillars: {activePillarsSummary}
          </span>
        </div>

        {/* Run Progress Status Row */}
        <div className="flex items-center gap-3 pt-3">
          <div className="h-9 bg-[#FF6C37] text-white text-xs font-medium px-4 rounded-lg flex-1 flex items-center justify-center gap-2 shadow-xs select-none">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>
              {isQueued
                ? "Queued: Waiting for available Celery Playwright worker..."
                : "Testing in progress: Executing quality assertions across browser context..."}
            </span>
            <span className="font-mono text-[10px] bg-white/20 px-2 py-0.5 rounded">
              00:{elapsedSeconds < 10 ? `0${elapsedSeconds}` : elapsedSeconds}s
            </span>
          </div>

          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onAbort}
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
            <h3 className="text-sm font-semibold text-[#212121]">Autonomous Execution Pipeline</h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#6B6B6B]">
            <span className="bg-[#F5F3F3] px-2.5 py-1 rounded border border-[#E6E6E6]">
              Status: <span className="text-[#212121] font-semibold uppercase">{runData?.status || "QUEUED"}</span>
            </span>
          </div>
        </div>

        {/* Pipeline Step Progression */}
        <div className="pt-3.5 space-y-3.5">
          {pipelineSteps.map((step, idx) => {
            const isLast = idx === pipelineSteps.length - 1;

            return (
              <div key={step.id} className="relative flex items-start gap-3">
                {!isLast && (
                  <div
                    className={`absolute left-[13px] top-[26px] bottom-[-14px] w-[2px] ${
                      step.status === "done" ? "bg-[#12B76A]/40" : "bg-[#E6E6E6]"
                    }`}
                  />
                )}

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
  );
}
