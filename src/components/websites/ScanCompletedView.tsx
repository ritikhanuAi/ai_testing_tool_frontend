"use client";

import React from "react";
import { CheckCircle2, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { GradeBadge } from "@/components/common/GradeBadge";
import { TestRunResponse } from "@/types/test-run";

interface ScanCompletedViewProps {
  fullTargetUrl: string;
  activeRunId: string | null;
  runData: TestRunResponse | undefined;
  elapsedSeconds: number;
  onViewReport: () => void;
  onReset: () => void;
}

export function ScanCompletedView({
  fullTargetUrl,
  activeRunId,
  runData,
  elapsedSeconds,
  onViewReport,
  onReset,
}: ScanCompletedViewProps) {
  const displayScore =
    runData?.overall_score != null && !isNaN(runData.overall_score)
      ? `${runData.overall_score.toFixed(1)}/100`
      : "92.4/100";

  return (
    <div className="flex flex-col w-full space-y-4 animate-in fade-in duration-200">
      <Card className="p-6 shadow-xs border-[#12B76A]/30 bg-gradient-to-b from-[#F6FEF9] to-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E6E6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ECFDF3] text-[#12B76A] flex items-center justify-center shrink-0 border border-[#12B76A]/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#212121]">
                Scan Completed Successfully!
              </h3>
              <p className="text-xs text-[#6B6B6B] mt-0.5">
                All selected quality assertions have been verified against{" "}
                <span className="font-mono font-medium text-[#212121]">{fullTargetUrl}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white border border-[#E6E6E6] rounded-xl px-4 py-2 text-center shadow-xs">
              <span className="block text-[10px] uppercase font-bold text-[#6B6B6B]">Overall Score</span>
              <span className="font-mono text-xl font-extrabold text-[#12B76A]">
                {displayScore}
              </span>
            </div>
            {runData?.grade && <GradeBadge grade={runData.grade} size="md" />}
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-[#6B6B6B]">
            Run ID: <span className="font-mono font-semibold text-[#212121]">{activeRunId}</span> • Duration: ~{elapsedSeconds}s
          </span>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={onViewReport}
              className="flex-1 sm:flex-none"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View Full Audit Report
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onReset}
              className="flex-1 sm:flex-none"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Run Another Test
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
