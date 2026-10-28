"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { TestRunResponse } from "@/types/test-run";

interface ScanFailedViewProps {
  runData: TestRunResponse | undefined;
  onReset: () => void;
  onViewAllRuns: () => void;
}

export function ScanFailedView({ runData, onReset, onViewAllRuns }: ScanFailedViewProps) {
  return (
    <div className="flex flex-col w-full space-y-4 animate-in fade-in duration-200">
      <Card className="p-6 shadow-xs border-[#BA1A1A]/30 bg-[#FFF8F8]">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#FFF1F0] text-[#BA1A1A] flex items-center justify-center shrink-0 border border-[#FFA39E]">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-[#BA1A1A]">
              {runData?.status === "cancelled" ? "Scan Run Cancelled" : "Scan Run Failed"}
            </h3>
            <p className="text-xs text-[#6B6B6B] mt-1">
              {runData?.error_message ||
                "The browser worker encountered an error while testing the target host."}
            </p>

            <div className="mt-4 flex items-center gap-2.5">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={onReset}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Try Again
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onViewAllRuns}
              >
                View All Runs
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
