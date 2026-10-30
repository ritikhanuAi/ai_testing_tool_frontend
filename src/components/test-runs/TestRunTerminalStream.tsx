"use client";

import React, { useEffect, useRef } from "react";
import { Terminal } from "lucide-react";
import { Card } from "@/components/common/Card";
import { useRunLogs } from "@/features/test-runs";
import { formatDate } from "@/lib/utils";

interface TestRunTerminalStreamProps {
  runId?: string;
  startedAt?: string | null;
  targetUrl?: string;
  profileName?: string;
  rateLimit?: number;
  overallScore?: number | null;
  isCompleted: boolean;
  isRunning: boolean;
  isCancelled?: boolean;
}

export function TestRunTerminalStream({
  runId,
  startedAt,
  targetUrl,
  profileName,
  rateLimit,
  overallScore,
  isCompleted,
  isRunning,
  isCancelled = false,
}: TestRunTerminalStreamProps) {
  const { data: logsData } = useRunLogs(runId || "", isRunning);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  const logs = logsData?.logs || [];

  // Auto-scroll to bottom as new telemetry logs arrive
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs.length]);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "FUNCTIONAL":
        return "text-[#38BDF8] bg-[#38BDF8]/10 border-[#38BDF8]/30";
      case "SECURITY":
        return "text-[#4ADE80] bg-[#4ADE80]/10 border-[#4ADE80]/30";
      case "PERFORMANCE":
        return "text-[#FBBF24] bg-[#FBBF24]/10 border-[#FBBF24]/30";
      case "ACCESSIBILITY":
        return "text-[#C084FC] bg-[#C084FC]/10 border-[#C084FC]/30";
      case "COMPLETED":
        return "text-[#34D399] bg-[#34D399]/10 border-[#34D399]/30";
      case "FAILED":
        return "text-[#F87171] bg-[#F87171]/10 border-[#F87171]/30";
      default:
        return "text-[#94A3B8] bg-[#94A3B8]/10 border-[#94A3B8]/30";
    }
  };

  return (
    <Card className="p-5 font-mono shadow-xs bg-white border border-[#E6E6E6] rounded-xl">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E6E6E6]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#212121]">
          <Terminal className="w-4 h-4 text-[#FF6C37]" />
          <span>Runner Telemetry Stream {logsData?.stage ? `• ${logsData.stage}` : ""}</span>
          {isRunning && (
            <span className="w-2 h-2 rounded-full bg-[#12B76A] animate-ping ml-1" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#6B6B6B] bg-[#F5F3F3] px-2 py-0.5 rounded border border-[#E6E6E6]">
            {logs.length} events logged
          </span>
          <span className="text-[10px] font-mono text-[#6B6B6B] bg-[#F5F3F3] px-2 py-0.5 rounded border border-[#E6E6E6]">
            Chromium Playwright Harness
          </span>
        </div>
      </div>

      <div
        ref={logsContainerRef}
        className="bg-[#18181B] text-[#E4E4E7] border border-[#27272A] rounded-lg p-4 text-xs space-y-2 max-h-80 overflow-y-auto scroll-smooth"
      >
        <p className="text-[#A1A1AA]">
          [{formatDate(startedAt)}] Initializing autonomous browser session on {targetUrl || "target"}...
        </p>
        <p className="text-[#38BDF8]">
          [{formatDate(startedAt)}] Applied profile: {profileName || "Autonomous Scan"} (Rate limit: {rateLimit || 10} req/s)
        </p>

        {logs.map((log, idx) => {
          const timeStr = log.timestamp ? log.timestamp.split("T")[1]?.split(".")[0] || "" : "";
          const isWarning = log.level === "WARNING";
          const isError = log.level === "ERROR";

          return (
            <div key={idx} className="flex items-start gap-2 leading-relaxed">
              <span className="text-[#71717A] text-[10px] select-none shrink-0 pt-0.5">
                {timeStr}
              </span>
              <span
                className={`text-[9px] uppercase px-1.5 py-0.2 rounded border font-semibold shrink-0 select-none ${getStageColor(
                  log.stage
                )}`}
              >
                {log.stage}
              </span>
              <span
                className={`break-all ${
                  isError
                    ? "text-[#F87171] font-semibold"
                    : isWarning
                    ? "text-[#FBBF24]"
                    : "text-[#E4E4E7]"
                }`}
              >
                {log.message}
              </span>
            </div>
          );
        })}

        {isRunning && (
          <p className="text-[#FB923C] animate-pulse flex items-center gap-1.5 pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6C37] animate-ping" />
            <span>Streaming live browser actions & telemetry...</span>
          </p>
        )}

        {isCompleted && logs.length === 0 && (
          <p className="text-[#4ADE80] font-bold">
            [✓] Audit finished successfully. Report synthesized with score {overallScore?.toFixed(1)}.
          </p>
        )}

        {isCancelled && (
          <p className="text-[#F87171] font-semibold pt-1">
            [!] Audit execution was cancelled by user signal. Worker terminated.
          </p>
        )}
      </div>
    </Card>
  );
}
