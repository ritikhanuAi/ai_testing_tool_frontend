"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ActionCards } from "@/components/dashboard/ActionCards";
import { RecentRunsSection, type TestRunItem } from "@/components/dashboard/RecentRunsSection";
import { TelemetryStrip } from "@/components/dashboard/TelemetryStrip";
import { useRecentActivity, useDashboardSummary } from "@/hooks/useDashboard";
import { useTestRuns } from "@/hooks/useTestRuns";
import { useWebsites } from "@/hooks/useWebsites";
import { formatDuration } from "@/lib/utils";

function computeDuration(startedAt?: string | null, finishedAt?: string | null): string {
  if (!startedAt) return "--";
  const start = new Date(startedAt).getTime();
  if (isNaN(start)) return "--";

  const end = finishedAt ? new Date(finishedAt).getTime() : Date.now();
  if (isNaN(end)) return "--";

  const diffSec = Math.max(0, Math.round((end - start) / 1000));
  return formatDuration(diffSec);
}


export default function DashboardPage() {
  const router = useRouter();

  // Fetch recent activity and summary from backend
  const { data: recentActivity = [], isLoading: isActivityLoading } = useRecentActivity();
  const { data: allRuns = [], isLoading: isRunsLoading } = useTestRuns();
  const { data: websites = [] } = useWebsites();
  const { data: summary } = useDashboardSummary();

  const websitesMap = useMemo(() => {
    return new Map(websites.map((w) => [w.id, w]));
  }, [websites]);

  // Map backend runs to the TestRunItem format
  const runs: TestRunItem[] = useMemo(() => {
    // 1. If dashboard recent activity endpoint returns items, use them
    if (recentActivity && recentActivity.length > 0) {
      return recentActivity.map((item) => ({
        id: item.run_id,
        name: item.website_name || "Website Scan",
        targetUrl: item.target_url || "https://example.com",
        status: (item.status || "pending").toLowerCase(),
        duration: computeDuration(item.started_at, item.finished_at || (item as unknown as { completed_at?: string }).completed_at),
        score: item.score ?? null,
        executedAt: item.started_at || new Date().toISOString(),
      }));
    }

    // 2. Fallback to test-runs list endpoint (which is ordered by created_at.desc)
    if (allRuns && allRuns.length > 0) {
      return allRuns.slice(0, 10).map((r) => {
        const site = websitesMap.get(r.website_id);
        return {
          id: r.id,
          name: site?.name || "Website Scan",
          targetUrl: site?.base_url || "https://example.com",
          status: (r.status || "pending").toLowerCase(),
          duration: computeDuration(r.started_at, r.completed_at),
          score: r.overall_score ?? null,
          executedAt: r.started_at || new Date().toISOString(),
        };
      });
    }

    return [];
  }, [recentActivity, allRuns, websitesMap]);

  const isLoading = isActivityLoading && isRunsLoading;

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

      {/* Recent Test Runs Section */}
      <RecentRunsSection
        runs={runs}
        isLoading={isLoading}
        onLaunchWebsiteTest={() => router.push("/websites")}
      />

      {/* Telemetry Sparklines & Metrics Strip */}
      <TelemetryStrip
        passRatio={summary?.pass_rate_percentage ?? null}
        avgLatency={null}
        healedCount={0}
      />
    </div>
  );
}

