"use client";

import React from "react";
import { Wrench } from "lucide-react";

interface TelemetryStripProps {
  passRatio?: number | null;
  passRatioChange?: string | null;
  avgLatency?: string | null;
  healedCount?: number | null;
}

export function TelemetryStrip({
  passRatio = null,
  passRatioChange = null,
  avgLatency = null,
  healedCount = null,
}: TelemetryStripProps) {
  return (
    <div className="mt-3.5 grid grid-cols-1 md:grid-cols-3 gap-3">
      {/* Metric 1: Pass Ratio */}
      <div className="bg-white border border-[#E6E6E6] rounded-xl p-3 sm:p-3.5 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#8C8C8C] uppercase tracking-wider">
            Pass Ratio (7d)
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-lg sm:text-xl font-semibold text-[#212121] tabular-nums">
              {passRatio !== null ? `${passRatio.toFixed(1)}%` : "--"}
            </span>
            {passRatioChange && (
              <span className="text-[11px] font-semibold text-[#12B76A] flex items-center">
                {passRatioChange}
              </span>
            )}
          </div>
        </div>
        {/* Sparkline Graphic */}
        <div className="w-16 h-7 opacity-70 shrink-0" style={{ width: 64, height: 28 }}>
          <svg
            style={{ width: "100%", height: "100%" }}
            className="w-full h-full text-[#12B76A]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 100 40"
          >
            <path
              d="M 0 30 Q 20 28 40 24 T 70 16 T 100 10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Metric 2: Avg Latency */}
      <div className="bg-white border border-[#E6E6E6] rounded-xl p-3 sm:p-3.5 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#8C8C8C] uppercase tracking-wider">
            Avg Latency
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-lg sm:text-xl font-semibold text-[#212121] tabular-nums">
              {avgLatency !== null ? avgLatency : "--"}
            </span>
            <span className="text-[10px] text-[#8C8C8C]">per assertion</span>
          </div>
        </div>
        {/* Latency Sparkline Graphic */}
        <div className="w-16 h-7 opacity-70 shrink-0" style={{ width: 64, height: 28 }}>
          <svg
            style={{ width: "100%", height: "100%" }}
            className="w-full h-full text-[#006492]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 100 40"
          >
            <path
              d="M 0 20 L 20 24 L 40 16 L 60 26 L 80 14 L 100 18"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Metric 3: AI Self-Healing */}
      <div className="bg-white border border-[#E6E6E6] rounded-xl p-3 sm:p-3.5 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-[10px] sm:text-[11px] font-semibold text-[#8C8C8C] uppercase tracking-wider">
            AI Self-Healing
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-lg sm:text-xl font-semibold text-[#212121] tabular-nums">
              {healedCount !== null ? `${healedCount} Fixed` : "0 Fixed"}
            </span>
            <span className="text-[10px] font-medium text-[#FF6C37]">
              Auto-adapted
            </span>
          </div>
        </div>
        <div className="w-7 h-7 rounded-lg bg-[#FFF1EB] flex items-center justify-center text-[#FF6C37]">
          <Wrench className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}

export default TelemetryStrip;
