"use client";

import React from "react";
import Link from "next/link";
import {
  FlaskConical,
  Play,
  Upload,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export interface TestRunItem {
  id: string;
  name: string;
  targetUrl: string;
  status: "passed" | "running" | "failed" | "pending" | "completed" | "queued" | "cancelled" | string;
  duration?: string;
  score?: number | null;
  executedAt?: string;
}

interface RecentRunsSectionProps {
  runs?: TestRunItem[];
  isLoading?: boolean;
  onLaunchWebsiteTest?: () => void;
  onImportCases?: () => void;
}

export function RecentRunsSection({
  runs = [],
  isLoading = false,
  onLaunchWebsiteTest,
  onImportCases,
}: RecentRunsSectionProps) {
  const activeRunsCount = runs.filter(
    (r) => r.status === "running" || r.status === "pending" || r.status === "queued"
  ).length;

  return (
    <div className="mt-3.5 pt-1">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm sm:text-base font-semibold text-[#212121]">
            Recent Test Runs
          </h3>
          <span className="text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#EFEDED] text-[#6B6B6B]">
            {activeRunsCount} active
          </span>
        </div>

        <Link
          href="/test-runs"
          className="text-xs sm:text-sm font-medium text-[#FF6C37] hover:text-[#E8590C] inline-flex items-center gap-1 transition-colors"
        >
          <span>View all runs</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Main Content: Loading, Empty State (default), or Live Data Table */}
      {isLoading ? (
        <div className="bg-white border border-[#E6E6E6] rounded-xl p-8 text-center shadow-xs">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#8C8C8C]">
            <Loader2 className="w-4 h-4 animate-spin text-[#FF6C37]" />
            <span>Fetching test runs...</span>
          </div>
        </div>
      ) : runs.length === 0 ? (
        /* Clean Zero Dummy Data Empty State */
        <div className="bg-white border border-[#E6E6E6] rounded-xl p-5 sm:p-6 text-center shadow-xs">
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#F5F3F3] border border-[#E6E6E6] flex items-center justify-center text-[#6B6B6B] mb-2.5">
              <FlaskConical className="w-5 h-5 text-[#FF6C37]" />
            </div>
            <h4 className="text-sm font-semibold text-[#212121]">
              No test runs executed yet
            </h4>
            <p className="text-xs text-[#6B6B6B] mt-1 mb-3.5 max-w-sm leading-relaxed">
              Trigger your first automated run via direct URL crawl or by uploading a suite of test cases above.
            </p>
            <div className="flex items-center gap-2.5">
              <Link
                href="/websites"
                onClick={onLaunchWebsiteTest}
                className="h-8 px-3.5 rounded-lg bg-[#FF6C37] hover:bg-[#E8590C] text-white text-xs font-medium transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Test a Website</span>
              </Link>

              {onImportCases ? (
                <button
                  type="button"
                  onClick={onImportCases}
                  className="h-8 px-3.5 rounded-lg bg-white border border-[#E6E6E6] hover:bg-[#F5F3F3] text-[#212121] text-xs font-medium transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3 h-3 text-[#6B6B6B]" />
                  <span>Import Cases</span>
                </button>
              ) : (
                <Link
                  href="/test-packs"
                  className="h-8 px-3.5 rounded-lg bg-white border border-[#E6E6E6] hover:bg-[#F5F3F3] text-[#212121] text-xs font-medium transition-colors inline-flex items-center gap-1.5"
                >
                  <Upload className="w-3 h-3 text-[#6B6B6B]" />
                  <span>Import Cases</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Real Data Table (Active when API delivers records) */
        <div className="bg-white border border-[#E6E6E6] rounded-xl shadow-xs overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F5F3F3] text-[10px] sm:text-[11px] text-[#6B6B6B] uppercase tracking-wider font-semibold border-b border-[#E6E6E6]">
                <th className="py-2.5 px-3.5">Test Name</th>
                <th className="py-2.5 px-3.5">URL / Target</th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5">Duration</th>
                <th className="py-2.5 px-3.5">Executed</th>
                <th className="py-2.5 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E6E6]">
              {runs.map((run) => {
                const isPassedOrCompleted = run.status === "passed" || run.status === "completed";
                const isFailed = run.status === "failed";
                const isRunning = run.status === "running";
                const isPendingOrQueued = run.status === "pending" || run.status === "queued";
                const isCancelled = run.status === "cancelled";

                return (
                  <tr
                    key={run.id}
                    className="hover:bg-[#FBF9F8] transition-colors group"
                  >
                    <td className="py-2.5 px-3.5">
                      <div className="flex items-center gap-2">
                        {isPassedOrCompleted && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#12B76A] shrink-0" />
                        )}
                        {isFailed && (
                          <AlertCircle className="w-3.5 h-3.5 text-[#F04438] shrink-0" />
                        )}
                        {isRunning && (
                          <Loader2 className="w-3.5 h-3.5 text-[#006492] animate-spin shrink-0" />
                        )}
                        {isPendingOrQueued && (
                          <span className="w-2 h-2 rounded-full bg-[#F79009] shrink-0 animate-pulse" />
                        )}
                        {isCancelled && (
                          <span className="w-2 h-2 rounded-full bg-[#8C8C8C] shrink-0" />
                        )}
                        <span className="font-medium text-[#212121]">{run.name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span className="font-mono text-[11px] text-[#594139] bg-[#F5F3F3] px-2 py-0.5 rounded border border-[#E6E6E6] truncate max-w-[220px] inline-block align-middle">
                        {run.targetUrl}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5">
                      {isPassedOrCompleted && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ECFDF3] text-[#006D3C] border border-[#006D3C]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#12B76A]" />
                          Completed
                        </span>
                      )}
                      {isRunning && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F0F9FF] text-[#004667] border border-[#006492]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#006492] animate-pulse" />
                          Running
                        </span>
                      )}
                      {isFailed && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FEF3F2] text-[#93000A] border border-[#BA1A1A]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F04438]" />
                          Failed
                        </span>
                      )}
                      {isPendingOrQueued && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFFAEB] text-[#7A3E00] border border-[#F79009]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F79009]" />
                          {run.status === "queued" ? "Queued" : "Pending"}
                        </span>
                      )}
                      {isCancelled && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F5F3F3] text-[#6B6B6B] border border-[#E6E6E6]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8C8C8C]" />
                          Cancelled
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 font-mono text-[#594139]">
                      {run.duration || "--"}
                    </td>
                    <td className="py-2.5 px-3.5 text-[#6B6B6B]">
                      {run.executedAt ? formatDate(run.executedAt) : "--"}
                    </td>
                    <td className="py-2.5 px-3.5 text-right">
                      <Link
                        href={isPassedOrCompleted ? `/reports/${run.id}` : `/test-runs/${run.id}`}
                        className="p-1 rounded hover:bg-[#F5F3F3] text-[#6B6B6B] hover:text-[#212121] transition-all inline-flex items-center gap-1 text-[11px] font-medium"
                        title={isPassedOrCompleted ? "View Report" : "Inspect Run"}
                      >
                        <span>{isPassedOrCompleted ? "Report" : "Inspect"}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecentRunsSection;
