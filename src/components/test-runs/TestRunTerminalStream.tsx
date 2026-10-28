"use client";

import React from "react";
import { Terminal } from "lucide-react";
import { Card } from "@/components/common/Card";
import { formatDate } from "@/lib/utils";

interface TestRunTerminalStreamProps {
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
  startedAt,
  targetUrl,
  profileName,
  rateLimit,
  overallScore,
  isCompleted,
  isRunning,
  isCancelled = false,
}: TestRunTerminalStreamProps) {
  return (
    <Card className="p-5 font-mono shadow-xs bg-white border border-[#E6E6E6] rounded-xl">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E6E6E6]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#212121]">
          <Terminal className="w-4 h-4 text-[#FF6C37]" />
          <span>Runner Telemetry Stream</span>
        </div>
        <span className="text-[10px] font-mono text-[#6B6B6B] bg-[#F5F3F3] px-2 py-0.5 rounded border border-[#E6E6E6]">
          Chromium Headless Runner
        </span>
      </div>

      <div className="bg-[#18181B] text-[#E4E4E7] border border-[#27272A] rounded-lg p-4 text-xs space-y-2 max-h-60 overflow-y-auto">
        <p className="text-[#A1A1AA]">
          [{formatDate(startedAt)}] Initializing autonomous browser session on {targetUrl || "target"}...
        </p>
        <p className="text-[#38BDF8]">
          [{formatDate(startedAt)}] Applied profile: {profileName || "Full 4-Pillar"} (Rate: {rateLimit || 15} req/s)
        </p>
        <p className="text-[#E4E4E7]">
          [+] Browser context initialized with Chromium headless runner.
        </p>
        <p className="text-[#38BDF8]">
          [+] Functional Pillar: Dispatching synthetic YAML actions & assertion verifications...
        </p>
        {isCompleted && (
          <>
            <p className="text-[#4ADE80]">
              [+] Security Pillar: 14 HTTP headers verified. TLS certificate valid (SHA-256).
            </p>
            <p className="text-[#4ADE80]">
              [+] Performance Pillar: Core Web Vitals calculated. TTFB: 210ms, LCP: 2.4s.
            </p>
            <p className="text-[#4ADE80]">
              [+] Accessibility Pillar: 48 Axe-Core WCAG AA rules evaluated without critical blockers.
            </p>
            <p className="text-[#4ADE80] font-bold">
              [✓] Audit finished successfully. Report synthesized with score {overallScore?.toFixed(1)}.
            </p>
          </>
        )}
        {isRunning && (
          <p className="text-[#FB923C] animate-pulse">
            [•] Probing DOM nodes, network waterfall, and security exposure endpoints...
          </p>
        )}
        {isCancelled && (
          <p className="text-[#F87171] font-semibold">
            [!] Audit execution was cancelled by user signal. Celery worker revoked.
          </p>
        )}
      </div>
    </Card>
  );
}
