"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { GradeBadge } from "@/components/common/GradeBadge";
import { getStatusBadge, formatDate } from "@/lib/utils";
import { useTestRuns, useCancelScan } from "@/features/test-runs";
import { useWebsites } from "@/features/websites";
import { QuickScanModal } from "@/components/dashboard/QuickScanModal";
import {
  Play,
  ArrowRight,
  FlaskConical,
  Loader2,
  Square,
} from "lucide-react";

export default function TestRunsPage() {
  const { data: runs = [], isLoading } = useTestRuns();
  const { data: websites = [] } = useWebsites();
  const cancelScan = useCancelScan();
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const websitesMap = React.useMemo(() => {
    return new Map(websites.map((w) => [w.id, w]));
  }, [websites]);

  const filteredRuns = runs.filter((r) => {
    if (statusFilter === "all") return true;
    return r.status === statusFilter;
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#212121] flex items-center gap-2">
            Automated Test Runs
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-1">
            Real-time audit monitoring, execution lifecycle telemetry, and historical report logs.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
          onClick={() => setIsScanModalOpen(true)}
        >
          Launch New Scan
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {["all", "running", "completed", "failed", "cancelled"].map((st) => {
          const isActive = statusFilter === st;
          const count = st === "all" ? runs.length : runs.filter((r) => r.status === st).length;

          return (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                isActive
                  ? "bg-[#FF6C37] text-white shadow-xs font-semibold"
                  : "bg-white text-[#6B6B6B] hover:text-[#212121] hover:bg-[#F5F3F3] border border-[#E6E6E6]"
              }`}
            >
              <span>{st}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-[#F5F3F3] text-[#6B6B6B] border border-[#E6E6E6]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Runs Table Card */}
      <Card className="p-0 border border-[#E6E6E6] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F5F3F3] border-b border-[#E6E6E6] text-[11px] font-semibold text-[#6B6B6B] uppercase tracking-wider">
                <th className="py-3 px-4 w-16">#</th>
                <th className="py-3 px-4">Target Application</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Quality Score</th>
                <th className="py-3 px-4">Grade</th>
                <th className="py-3 px-4">Started</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E6E6] bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8C8C8C]">
                    <div className="inline-flex flex-col items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#FF6C37]" />
                      <span>Loading execution history...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRuns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="max-w-md mx-auto flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-[#F5F3F3] border border-[#E6E6E6] flex items-center justify-center text-[#6B6B6B] mb-2.5">
                        <FlaskConical className="w-5 h-5 text-[#FF6C37]" />
                      </div>
                      <h4 className="text-sm font-semibold text-[#212121]">
                        No test runs found
                      </h4>
                      <p className="text-xs text-[#6B6B6B] mt-1 mb-3.5 max-w-sm">
                        {statusFilter === "all"
                          ? "Trigger your first automated run via direct URL crawl or launch a new scan."
                          : `No test runs currently in "${statusFilter}" state.`}
                      </p>
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Play className="w-3 h-3 fill-current" />}
                        onClick={() => setIsScanModalOpen(true)}
                      >
                        Launch New Scan
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRuns.map((run, index) => {
                  const site = websitesMap.get(run.website_id);
                  const statusBadge = getStatusBadge(run.status);
                  const isRunning = run.status === "running" || run.status === "pending" || run.status === "queued";
                  const serialNumber = `#${index + 1}`;

                  return (
                    <tr key={run.id} className="hover:bg-[#FBF9F8] transition-colors group">
                      {/* Serial Number Column */}
                      <td className="py-3 px-4 font-mono text-xs font-semibold text-[#594139]">
                        {serialNumber}
                      </td>

                      {/* Target Application Column */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-[#212121]">
                          {site?.name || "Target Application"}
                        </div>
                        <div className="text-[11px] text-[#6B6B6B] font-mono truncate max-w-xs">
                          {site?.base_url || run.website_id}
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold uppercase ${statusBadge.classes}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot} ${
                              statusBadge.pulse ? "animate-ping" : ""
                            }`}
                          />
                          {statusBadge.label}
                        </span>
                      </td>

                      {/* Quality Score Column */}
                      <td className="py-3 px-4 font-mono">
                        {typeof run.overall_score === "number" && !isNaN(run.overall_score) ? (
                          <span className="font-semibold text-[#212121] text-xs tabular-nums">
                            {run.overall_score.toFixed(1)} / 100
                          </span>
                        ) : (
                          <span className="text-[#8C8C8C] italic">Calculating...</span>
                        )}
                      </td>

                      {/* Grade Column */}
                      <td className="py-3 px-4">
                        {run.grade ? (
                          <GradeBadge grade={run.grade} size="sm" />
                        ) : (
                          <span className="text-[#8C8C8C] font-mono text-xs">-</span>
                        )}
                      </td>

                      {/* Started Column */}
                      <td className="py-3 px-4 text-[#6B6B6B] font-mono text-[11px]">
                        {formatDate(run.started_at)}
                      </td>

                      {/* Action Column */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {run.status === "completed" ? (
                            <Link href={`/reports/${run.id}`}>
                              <Button
                                variant="secondary"
                                size="sm"
                                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                              >
                                Report
                              </Button>
                            </Link>
                          ) : (
                            <>
                              <Link href={`/test-runs/${run.id}`}>
                                <Button variant="primary" size="sm">
                                  Monitor
                                </Button>
                              </Link>
                              {isRunning && (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  title="Abort Scan"
                                  className="h-8 w-8 p-0"
                                  isLoading={cancelScan.isPending && cancelScan.variables === run.id}
                                  onClick={() => {
                                    if (window.confirm(`Are you sure you want to abort run ${serialNumber}?`)) {
                                      cancelScan.mutate(run.id);
                                    }
                                  }}
                                >
                                  <Square className="w-3 h-3 fill-current" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <QuickScanModal isOpen={isScanModalOpen} onClose={() => setIsScanModalOpen(false)} />
    </div>
  );
}
