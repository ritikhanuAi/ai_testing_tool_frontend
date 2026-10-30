"use client";

import React from "react";
import { Layers, Shield, Zap, Activity, CheckCircle2, Clock, MinusCircle } from "lucide-react";
import { Card } from "@/components/common/Card";

interface TestRunPillarPipelineProps {
  isCompleted: boolean;
  isRunning: boolean;
  profile?: {
    check_functional?: boolean;
    check_security?: boolean;
    check_performance?: boolean;
    check_accessibility?: boolean;
  };
}

const STAGES = [
  {
    id: "functional",
    key: "check_functional" as const,
    title: "1. Functional Pillar",
    subtitle: "Playwright Headless Browser Workflows",
    icon: Layers,
  },
  {
    id: "security",
    key: "check_security" as const,
    title: "2. Security & Headers",
    subtitle: "OWASP Probes & TLS Configuration",
    icon: Shield,
  },
  {
    id: "performance",
    key: "check_performance" as const,
    title: "3. Performance Pillar",
    subtitle: "Core Web Vitals & TTFB Telemetry",
    icon: Zap,
  },
  {
    id: "accessibility",
    key: "check_accessibility" as const,
    title: "4. Accessibility Pillar",
    subtitle: "WCAG 2.1 AA Automated Rule Checks",
    icon: Activity,
  },
];

export function TestRunPillarPipeline({
  isCompleted,
  isRunning,
  profile,
}: TestRunPillarPipelineProps) {
  return (
    <Card className="p-5 shadow-xs bg-white border border-[#E6E6E6] rounded-xl">
      <div className="mb-4 pb-3 border-b border-[#E6E6E6]">
        <h3 className="text-xs font-semibold text-[#212121] uppercase tracking-wider">
          Quality Pillar Execution Pipeline
        </h3>
        <p className="text-xs text-[#6B6B6B] mt-0.5">
          Synchronous multi-stage browser harness and security telemetry evaluation
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isEnabled = profile ? profile[stage.key] !== false : true;
          const isStageDone = isCompleted && isEnabled;
          const isStageActive = isRunning && isEnabled && idx === 0;

          if (!isEnabled) {
            return (
              <div
                key={stage.id}
                className="p-4 rounded-xl border border-[#E6E6E6] bg-[#FAFAFA] opacity-60"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg border bg-[#F0F0F0] text-[#A0A0A0] border-[#E0E0E0]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <MinusCircle className="w-4 h-4 text-[#A0A0A0]" />
                </div>
                <h4 className="text-xs font-semibold text-[#8C8C8C]">{stage.title}</h4>
                <p className="text-[11px] text-[#A0A0A0] mt-0.5 leading-snug">{stage.subtitle}</p>
                <div className="mt-3 pt-2 border-t border-[#E6E6E6] text-[10px] font-mono">
                  <span className="text-[#8C8C8C] font-semibold">SKIPPED (Disabled)</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={stage.id}
              className={`p-4 rounded-xl border transition-all ${
                isStageDone
                  ? "bg-[#F6FEF9] border-[#12B76A]/30"
                  : isStageActive
                  ? "bg-[#FFF1EB] border-[#FF6C37]/40 shadow-xs"
                  : "bg-[#FBF9F8] border-[#E6E6E6] opacity-85"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-2 rounded-lg border ${
                    isStageDone
                      ? "bg-[#ECFDF3] text-[#12B76A] border-[#12B76A]/20"
                      : isStageActive
                      ? "bg-white text-[#FF6C37] border-[#FF6C37]/30"
                      : "bg-[#F5F3F3] text-[#8C8C8C] border-[#E6E6E6]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isStageDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[#12B76A]" />
                ) : isStageActive ? (
                  <span className="w-2 h-2 rounded-full bg-[#FF6C37] animate-ping" />
                ) : (
                  <Clock className="w-4 h-4 text-[#8C8C8C]" />
                )}
              </div>
              <h4 className="text-xs font-semibold text-[#212121]">{stage.title}</h4>
              <p className="text-[11px] text-[#6B6B6B] mt-0.5 leading-snug">{stage.subtitle}</p>
              <div className="mt-3 pt-2 border-t border-[#E6E6E6] text-[10px] font-mono">
                {isStageDone ? (
                  <span className="text-[#006D3C] font-semibold">STAGE PASSED</span>
                ) : isStageActive ? (
                  <span className="text-[#AC3500] font-semibold">RUNNING CHECKS...</span>
                ) : (
                  <span className="text-[#8C8C8C]">QUEUED</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
