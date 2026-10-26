"use client";

import React, { useState } from "react";
import { ActionCards } from "@/components/dashboard/ActionCards";
import { RecentRunsSection, type TestRunItem } from "@/components/dashboard/RecentRunsSection";
import { TelemetryStrip } from "@/components/dashboard/TelemetryStrip";
import { QuickScanModal } from "@/components/dashboard/QuickScanModal";

export default function DashboardPage() {
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  // Ready for live API data binding (currently empty per "zero dummy data" requirement)
  const runs: TestRunItem[] = [];
  const isLoading = false;

  return (
    <div className="flex flex-col w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#212121]">
            Home
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-1">
            Choose how you want to test
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#F5F3F3] border border-[#E6E6E6] text-xs font-medium text-[#594139]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#12B76A]" />
            Workspace Engine: Ready
          </span>
        </div>
      </div>

      {/* Primary Action Cards (2-Column Grid) */}
      <ActionCards />

      {/* Recent Test Runs Section (Clean Empty State by default, Zero Dummy Data) */}
      <RecentRunsSection
        runs={runs}
        isLoading={isLoading}
        onLaunchWebsiteTest={() => setIsScanModalOpen(true)}
      />

      {/* Telemetry Sparklines & Metrics Strip */}
      <TelemetryStrip
        passRatio={null}
        avgLatency={null}
        healedCount={0}
      />

      {/* Quick Scan Launch Modal */}
      <QuickScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
      />
    </div>
  );
}
