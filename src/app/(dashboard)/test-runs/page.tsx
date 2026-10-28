"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { GradeBadge } from "@/components/common/GradeBadge";
import { getStatusBadge, formatDate } from "@/lib/utils";
import { useTestRuns } from "@/features/test-runs";
import { useWebsites } from "@/features/websites";
import { QuickScanModal } from "@/components/dashboard/QuickScanModal";
import {
  Play,
  ArrowRight,
} from "lucide-react";

export default function TestRunsPage() {
  const { data: runs = [], isLoading } = useTestRuns();
  const { data: websites = [] } = useWebsites();
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Automated Test Runs History
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time audit monitoring, execution lifecycle telemetry, and historical report logs.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Play className="w-4 h-4 fill-current" />}
          onClick={() => setIsScanModalOpen(true)}
        >
          Launch New Scan
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {["all", "running", "completed", "failed", "cancelled"].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
              statusFilter === st
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                : "bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            {st} {st !== "all" && `(${runs.filter((r) => r.status === st).length})`}
          </button>
        ))}
      </div>

      {/* Runs Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Run ID</th>
                <th className="pb-3 font-semibold">Target Application</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Quality Score</th>
                <th className="pb-3 font-semibold">Grade</th>
                <th className="pb-3 font-semibold">Started Timestamp</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Loading execution history...
                  </td>
                </tr>
              ) : filteredRuns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No test runs found matching filter.
                  </td>
                </tr>
              ) : (
                filteredRuns.map((run) => {
                  const site = websitesMap.get(run.website_id);
                  const statusBadge = getStatusBadge(run.status);

                  return (
                    <tr key={run.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 font-mono text-indigo-300 font-semibold">
                        {run.id}
                      </td>
                      <td className="py-3.5">
                        <div className="font-semibold text-slate-200">
                          {site?.name || "Unknown Target"}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono truncate max-w-xs">
                          {site?.base_url || run.website_id}
                        </div>
                      </td>
                      <td className="py-3.5">
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
                      <td className="py-3.5 font-mono">
                        {typeof run.overall_score === "number" && !isNaN(run.overall_score) ? (
                          <span className="font-bold text-slate-100 text-sm">
                            {run.overall_score.toFixed(1)} / 100
                          </span>
                        ) : (
                          <span className="text-slate-500 italic">Calculating...</span>
                        )}
                      </td>
                      <td className="py-3.5">
                        {run.grade ? (
                          <GradeBadge grade={run.grade} size="sm" />
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>
                      <td className="py-3.5 text-slate-400 font-mono">
                        {formatDate(run.started_at)}
                      </td>
                      <td className="py-3.5 text-right">
                        {run.status === "completed" ? (
                          <Link href={`/reports/${run.id}`}>
                            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                              Report
                            </Button>
                          </Link>
                        ) : (
                          <Link href={`/test-runs/${run.id}`}>
                            <Button variant="primary" size="sm">
                              Monitor
                            </Button>
                          </Link>
                        )}
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
