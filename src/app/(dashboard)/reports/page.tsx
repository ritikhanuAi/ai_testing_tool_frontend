"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { GradeBadge } from "@/components/common/GradeBadge";
import { formatDate } from "@/lib/utils";
import { useTestRuns } from "@/features/test-runs";
import { useWebsites } from "@/features/websites";
import {
  FileText,
  Search,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Play,
  Layers,
  Sparkles,
  Globe,
  ExternalLink,
} from "lucide-react";

export default function ReportsHubPage() {
  const { data: runs = [], isLoading: isRunsLoading } = useTestRuns();
  const { data: websites = [], isLoading: isWebsitesLoading } = useWebsites();

  const [searchQuery, setSearchQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [outcomeFilter, setOutcomeFilter] = useState<"all" | "passed" | "failed">("all");

  const websitesMap = useMemo(() => {
    return new Map(websites.map((w) => [w.id, w]));
  }, [websites]);

  // Runs that have an audit report available (completed or runs with an overall_score)
  const reportRuns = useMemo(() => {
    return runs.filter((r) => r.status === "completed" || r.overall_score !== undefined);
  }, [runs]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    if (reportRuns.length === 0) {
      return { total: 0, avgScore: 0, passRate: 0, passedCount: 0, failedCount: 0 };
    }
    const scores = reportRuns.map((r) => r.overall_score || 0);
    const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const passedCount = reportRuns.filter((r) => (r.overall_score || 0) >= 75).length;
    const passRate = Math.round((passedCount / reportRuns.length) * 100);

    return {
      total: reportRuns.length,
      avgScore: Math.round(avgScore * 10) / 10,
      passRate,
      passedCount,
      failedCount: reportRuns.length - passedCount,
    };
  }, [reportRuns]);

  // Filtered reports
  const filteredRuns = useMemo(() => {
    return reportRuns.filter((run) => {
      const site = websitesMap.get(run.website_id);
      const targetUrl = (site?.base_url || "").toLowerCase();
      const siteName = (site?.name || "").toLowerCase();
      const runId = run.id.toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      if (q && !targetUrl.includes(q) && !siteName.includes(q) && !runId.includes(q)) {
        return false;
      }

      if (gradeFilter !== "all") {
        const runGrade = (run.grade || "").toUpperCase();
        if (runGrade !== gradeFilter.toUpperCase()) return false;
      }

      if (outcomeFilter === "passed" && (run.overall_score || 0) < 75) {
        return false;
      }
      if (outcomeFilter === "failed" && (run.overall_score || 0) >= 75) {
        return false;
      }

      return true;
    });
  }, [reportRuns, websitesMap, searchQuery, gradeFilter, outcomeFilter]);

  const isLoading = isRunsLoading || isWebsitesLoading;

  if (isLoading) {
    return (
      <div className="py-24 text-center text-[#8C8C8C]">
        <div className="w-8 h-8 rounded-full border-2 border-[#E6E6E6] border-t-[#FF6C37] animate-spin mx-auto mb-3" />
        <span className="text-sm font-medium">Loading quality audit reports...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#212121] flex items-center gap-2">
            Quality Audit Reports
          </h1>
          <p className="text-sm text-[#6B6B6B] mt-1">
            Comprehensive multi-pillar evaluation reports, compliance audits, and defect remediations.
          </p>
        </div>
        <Link href="/websites">
          <Button variant="primary" leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}>
            Launch Website Scan
          </Button>
        </Link>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border border-[#E6E6E6]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">
              Total Audit Reports
            </span>
            <div className="p-1.5 rounded-lg bg-[#EFF8FF] text-[#175CD3]">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#212121] font-mono">{metrics.total}</span>
            <span className="text-xs text-[#8C8C8C]">scans completed</span>
          </div>
        </Card>

        <Card className="bg-white border border-[#E6E6E6]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">
              Average Quality Score
            </span>
            <div className="p-1.5 rounded-lg bg-[#FFF1EB] text-[#FF6C37]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#212121] font-mono">
              {metrics.total > 0 ? `${metrics.avgScore}` : "N/A"}
            </span>
            <span className="text-xs text-[#8C8C8C]">/ 100 benchmark</span>
          </div>
        </Card>

        <Card className="bg-white border border-[#E6E6E6]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">
              Compliance Pass Rate
            </span>
            <div className="p-1.5 rounded-lg bg-[#ECFDF3] text-[#027A48]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#027A48] font-mono">
              {metrics.total > 0 ? `${metrics.passRate}%` : "100%"}
            </span>
            <span className="text-xs text-[#8C8C8C]">
              {metrics.passedCount} passed / {metrics.failedCount} review
            </span>
          </div>
        </Card>

        <Card className="bg-white border border-[#E6E6E6]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">
              Quality Pillars
            </span>
            <div className="p-1.5 rounded-lg bg-[#FDF4FF] text-[#C11574]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#212121] font-mono">4 Pillars</span>
            <span className="text-xs text-[#8C8C8C]">Func · Sec · Perf · A11y</span>
          </div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 bg-white border border-[#E6E6E6]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Outcome Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: "All Reports", count: reportRuns.length },
              { id: "passed", label: "Passed (>=75%)", count: metrics.passedCount },
              { id: "failed", label: "Attention Needed", count: metrics.failedCount },
            ].map((tab) => {
              const isActive = outcomeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setOutcomeFilter(tab.id as "all" | "passed" | "failed")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#212121] text-white shadow-xs"
                      : "bg-white text-[#6B6B6B] hover:text-[#212121] border border-[#E6E6E6]"
                  }`}
                >
                  {tab.label} <span className="ml-1 text-[11px] opacity-70">({tab.count})</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8C8C] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by target URL, domain, or run ID..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#F8F9FA] border border-[#E6E6E6] text-xs text-[#212121] placeholder-[#8C8C8C] focus:outline-none focus:border-[#FF6C37] focus:bg-white"
            />
          </div>
        </div>
      </Card>

      {/* Reports Table Card */}
      <Card className="p-0 overflow-hidden bg-white border border-[#E6E6E6] rounded-xl shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E6E6E6] bg-[#F5F3F3] text-[#594139] uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-4">Target Website & Environment</th>
                <th className="py-3 px-4">Quality Score & Grade</th>
                <th className="py-3 px-4">Audit Outcome</th>
                <th className="py-3 px-4">Date Completed</th>
                <th className="py-3 px-4 text-right">Report Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E6E6]">
              {filteredRuns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#8C8C8C]">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileText className="w-8 h-8 text-[#D4D4D4]" />
                      <p className="text-sm font-semibold text-[#212121]">No audit reports found</p>
                      <p className="text-xs text-[#6B6B6B] max-w-sm">
                        {reportRuns.length === 0
                          ? "Run a website test scan to generate your first multi-pillar audit report."
                          : "No reports match your current filter and search criteria."}
                      </p>
                      {reportRuns.length === 0 && (
                        <Link href="/websites" className="pt-2">
                          <Button variant="primary" size="sm">
                            Go to Website Testing
                          </Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRuns.map((run) => {
                  const site = websitesMap.get(run.website_id);
                  const isPassed = (run.overall_score || 0) >= 75;
                  const displayUrl = site?.base_url || `Website ${run.website_id.slice(0, 8)}`;

                  return (
                    <tr
                      key={run.id}
                      className="hover:bg-[#F9F8F7] transition-colors group cursor-pointer"
                    >
                      {/* Target Website & Environment */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-[#8C8C8C] shrink-0" />
                            <span className="font-semibold text-sm text-[#212121] truncate max-w-[280px]">
                              {site?.name || displayUrl}
                            </span>
                            {site?.environment && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-[#EFF8FF] text-[#175CD3] border border-[#B2DDFF]">
                                {site.environment}
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-xs text-[#6B6B6B] mt-0.5 truncate max-w-[320px]">
                            {site?.base_url || run.id}
                          </span>
                        </div>
                      </td>

                      {/* Overall Score & Grade */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <GradeBadge grade={run.grade || (isPassed ? "A" : "C")} size="sm" />
                          <div className="flex flex-col">
                            <span className="font-mono text-sm font-bold text-[#212121]">
                              {run.overall_score !== undefined
                                ? `${run.overall_score.toFixed(1)}/100`
                                : "Pending"}
                            </span>
                            <span className="text-[10px] text-[#8C8C8C]">Composite score</span>
                          </div>
                        </div>
                      </td>

                      {/* Audit Outcome */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${
                            isPassed
                              ? "bg-[#ECFDF3] text-[#027A48] border-[#A6F4C5]"
                              : "bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]"
                          }`}
                        >
                          {isPassed ? (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5 text-[#12B76A]" />
                              Audit Passed
                            </>
                          ) : (
                            <>
                              <ShieldAlert className="w-3.5 h-3.5 text-[#F04438]" />
                              Attention Needed
                            </>
                          )}
                        </span>
                      </td>

                      {/* Date Completed */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col text-xs">
                          <span className="text-[#212121] font-medium">
                            {formatDate(run.completed_at || run.started_at)}
                          </span>
                          <span className="text-[10px] text-[#8C8C8C] font-mono">
                            ID: {run.id.slice(0, 8)}...
                          </span>
                        </div>
                      </td>

                      {/* Report Action */}
                      <td className="py-3.5 px-4 text-right">
                        <Link href={`/reports/${run.id}`}>
                          <Button
                            variant="secondary"
                            size="sm"
                            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                            className="group-hover:border-[#FF6C37] group-hover:text-[#FF6C37] transition-colors"
                          >
                            View Report
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
