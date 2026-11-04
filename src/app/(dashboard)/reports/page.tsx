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
  ChevronDown,
  Zap,
  Shield,
  Gauge,
  Eye,
} from "lucide-react";

const PILLARS = [
  { key: "functional",    label: "Functional",    icon: Zap,    scoreKey: "functional_score"    as const, color: "text-[#175CD3] bg-[#EFF8FF] border-[#B2DDFF]" },
  { key: "security",      label: "Security",      icon: Shield, scoreKey: "security_score"      as const, color: "text-[#B42318] bg-[#FEF3F2] border-[#FECDCA]" },
  { key: "performance",   label: "Performance",   icon: Gauge,  scoreKey: "performance_score"   as const, color: "text-[#027A48] bg-[#ECFDF3] border-[#A6F4C5]" },
  { key: "accessibility", label: "Accessibility", icon: Eye,    scoreKey: "accessibility_score" as const, color: "text-[#C11574] bg-[#FDF4FF] border-[#EEAAFD]" },
] as const;

type PillarKey = typeof PILLARS[number]["key"];

function PillarScoreBar({ score, color }: { score?: number | null; color: string }) {
  if (score == null) return <span className="text-[10px] text-[#8C8C8C]">—</span>;
  const pct = Math.min(100, Math.max(0, score));
  const textColor = color.split(" ")[0];
  return (
    <div className="flex items-center gap-1.5 w-full">
      <div className="flex-1 h-1 rounded-full bg-[#F0F0F0] overflow-hidden">
        <div
          className={`h-full rounded-full ${pct >= 75 ? "bg-[#12B76A]" : pct >= 50 ? "bg-[#F79009]" : "bg-[#F04438]"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-[10px] font-semibold font-mono w-8 text-right ${textColor}`}>{pct.toFixed(0)}</span>
    </div>
  );
}

export default function ReportsHubPage() {
  const { data: runs = [], isLoading: isRunsLoading } = useTestRuns();
  const { data: websites = [], isLoading: isWebsitesLoading } = useWebsites();

  const [searchQuery, setSearchQuery] = useState("");
  const [outcomeFilter, setOutcomeFilter] = useState<"all" | "passed" | "failed">("all");
  const [pillarFilter, setPillarFilter] = useState<PillarKey | "all">("all");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [moduleDropdownOpen, setModuleDropdownOpen] = useState(false);

  const websitesMap = useMemo(() => new Map(websites.map((w) => [w.id, w])), [websites]);

  const reportRuns = useMemo(
    () => runs.filter((r) => r.status === "completed" || r.overall_score != null),
    [runs]
  );

  // Unique module names from run_name field
  const moduleNames = useMemo(() => {
    const names = new Set<string>();
    reportRuns.forEach((r) => { if (r.run_name) names.add(r.run_name); });
    return Array.from(names).sort();
  }, [reportRuns]);

  const metrics = useMemo(() => {
    if (reportRuns.length === 0)
      return { total: 0, avgScore: 0, passRate: 0, passedCount: 0, failedCount: 0 };
    const scores = reportRuns.map((r) => r.overall_score || 0);
    const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;
    const passedCount = reportRuns.filter((r) => (r.overall_score || 0) >= 75).length;
    return {
      total: reportRuns.length,
      avgScore: Math.round(avgScore * 10) / 10,
      passRate: Math.round((passedCount / reportRuns.length) * 100),
      passedCount,
      failedCount: reportRuns.length - passedCount,
    };
  }, [reportRuns]);

  const filteredRuns = useMemo(() => {
    return reportRuns.filter((run) => {
      const site = websitesMap.get(run.website_id);
      const q = searchQuery.toLowerCase().trim();

      if (q) {
        const targetUrl = (site?.base_url || "").toLowerCase();
        const siteName = (site?.name || "").toLowerCase();
        const runName = (run.run_name || "").toLowerCase();
        const runId = run.id.toLowerCase();
        if (!targetUrl.includes(q) && !siteName.includes(q) && !runName.includes(q) && !runId.includes(q)) return false;
      }

      if (outcomeFilter === "passed" && (run.overall_score || 0) < 75) return false;
      if (outcomeFilter === "failed" && (run.overall_score || 0) >= 75) return false;

      if (pillarFilter !== "all") {
        const p = PILLARS.find((x) => x.key === pillarFilter)!;
        const score = run[p.scoreKey];
        if (score == null || score >= 75) return false;
      }

      if (moduleFilter !== "all") {
        if ((run.run_name || "") !== moduleFilter) return false;
      }

      return true;
    });
  }, [reportRuns, websitesMap, searchQuery, outcomeFilter, pillarFilter, moduleFilter]);

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
          <h1 className="text-2xl font-semibold tracking-tight text-[#212121]">
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
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Total Audit Reports</span>
            <div className="p-1.5 rounded-lg bg-[#EFF8FF] text-[#175CD3]"><FileText className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#212121] font-mono">{metrics.total}</span>
            <span className="text-xs text-[#8C8C8C]">scans completed</span>
          </div>
        </Card>
        <Card className="bg-white border border-[#E6E6E6]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Average Quality Score</span>
            <div className="p-1.5 rounded-lg bg-[#FFF1EB] text-[#FF6C37]"><Sparkles className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#212121] font-mono">
              {metrics.total > 0 ? metrics.avgScore : "N/A"}
            </span>
            <span className="text-xs text-[#8C8C8C]">/ 100 benchmark</span>
          </div>
        </Card>
        <Card className="bg-white border border-[#E6E6E6]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Compliance Pass Rate</span>
            <div className="p-1.5 rounded-lg bg-[#ECFDF3] text-[#027A48]"><ShieldCheck className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#027A48] font-mono">
              {metrics.total > 0 ? `${metrics.passRate}%` : "100%"}
            </span>
            <span className="text-xs text-[#8C8C8C]">{metrics.passedCount} passed / {metrics.failedCount} review</span>
          </div>
        </Card>
        <Card className="bg-white border border-[#E6E6E6]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">Quality Pillars</span>
            <div className="p-1.5 rounded-lg bg-[#FDF4FF] text-[#C11574]"><Layers className="w-4 h-4" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#212121] font-mono">4 Pillars</span>
            <span className="text-xs text-[#8C8C8C]">Func · Sec · Perf · A11y</span>
          </div>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 bg-white border border-[#E6E6E6] space-y-3">
        {/* Row 1: Outcome tabs + Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: "All Reports", count: reportRuns.length },
              { id: "passed", label: "Passed (≥75%)", count: metrics.passedCount },
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
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8C8C] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by URL, module name, or run ID..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#F8F9FA] border border-[#E6E6E6] text-xs text-[#212121] placeholder-[#8C8C8C] focus:outline-none focus:border-[#FF6C37] focus:bg-white"
            />
          </div>
        </div>

        {/* Row 2: Pillar filter + Module filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C8C8C]">Filter by:</span>

          {/* Pillar buttons */}
          <button
            onClick={() => setPillarFilter("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              pillarFilter === "all"
                ? "bg-[#212121] text-white border-[#212121]"
                : "bg-white text-[#6B6B6B] border-[#E6E6E6] hover:text-[#212121]"
            }`}
          >
            All Pillars
          </button>
          {PILLARS.map(({ key, label, icon: Icon, color }) => {
            const isActive = pillarFilter === key;
            const colorParts = color.split(" ");
            return (
              <button
                key={key}
                onClick={() => setPillarFilter(isActive ? "all" : key)}
                title={`Show reports where ${label} score < 75`}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  isActive
                    ? `${colorParts[1]} ${colorParts[0]} ${colorParts[2]} border`
                    : "bg-white text-[#6B6B6B] border-[#E6E6E6] hover:text-[#212121]"
                }`}
              >
                <Icon className="w-3 h-3" />
                {label}
                {isActive && <span className="text-[10px] opacity-75">needs attention</span>}
              </button>
            );
          })}

          {/* Module dropdown */}
          {moduleNames.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setModuleDropdownOpen((v) => !v)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  moduleFilter !== "all"
                    ? "bg-[#FFF1EB] text-[#FF6C37] border-[#FFBA97]"
                    : "bg-white text-[#6B6B6B] border-[#E6E6E6] hover:text-[#212121]"
                }`}
              >
                <Layers className="w-3 h-3" />
                {moduleFilter === "all" ? "All Modules" : moduleFilter}
                <ChevronDown className="w-3 h-3" />
              </button>
              {moduleDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 z-20 w-52 bg-white border border-[#E6E6E6] rounded-xl shadow-lg py-1">
                  <button
                    onClick={() => { setModuleFilter("all"); setModuleDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#F8F9FA] transition-colors ${moduleFilter === "all" ? "font-semibold text-[#212121]" : "text-[#6B6B6B]"}`}
                  >
                    All Modules
                  </button>
                  {moduleNames.map((name) => (
                    <button
                      key={name}
                      onClick={() => { setModuleFilter(name); setModuleDropdownOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#F8F9FA] transition-colors truncate ${moduleFilter === name ? "font-semibold text-[#FF6C37]" : "text-[#6B6B6B]"}`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Active filter count */}
          {filteredRuns.length !== reportRuns.length && (
            <span className="text-[11px] text-[#8C8C8C]">
              Showing {filteredRuns.length} of {reportRuns.length}
            </span>
          )}
        </div>
      </Card>

      {/* Reports Table */}
      <Card className="p-0 overflow-hidden bg-white border border-[#E6E6E6] rounded-xl shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E6E6E6] bg-[#F5F3F3] text-[#594139] uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-4">Target Website & Module</th>
                <th className="py-3 px-4">Overall Score</th>
                <th className="py-3 px-4">Pillar Breakdown</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4">Date Completed</th>
                <th className="py-3 px-4 text-right">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E6E6]">
              {filteredRuns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#8C8C8C]">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileText className="w-8 h-8 text-[#D4D4D4]" />
                      <p className="text-sm font-semibold text-[#212121]">No audit reports found</p>
                      <p className="text-xs text-[#6B6B6B] max-w-sm">
                        {reportRuns.length === 0
                          ? "Run a website test scan to generate your first multi-pillar audit report."
                          : "No reports match your current filters."}
                      </p>
                      {reportRuns.length === 0 && (
                        <Link href="/websites" className="pt-2">
                          <Button variant="primary" size="sm">Go to Website Testing</Button>
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
                      {/* Target + Module */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-[#8C8C8C] shrink-0" />
                            <span className="font-semibold text-sm text-[#212121] truncate max-w-[240px]">
                              {site?.name || displayUrl}
                            </span>
                            {site?.environment && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-[#EFF8FF] text-[#175CD3] border border-[#B2DDFF]">
                                {site.environment}
                              </span>
                            )}
                          </div>
                          {run.run_name && (
                            <div className="flex items-center gap-1.5 ml-5">
                              <Layers className="w-3 h-3 text-[#FF6C37]" />
                              <span className="text-[11px] font-medium text-[#FF6C37] truncate max-w-[220px]">
                                {run.run_name}
                              </span>
                            </div>
                          )}
                          <span className="font-mono text-[10px] text-[#8C8C8C] ml-5 truncate max-w-[280px]">
                            {site?.base_url || run.id}
                          </span>
                        </div>
                      </td>

                      {/* Overall Score */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <GradeBadge grade={run.grade || (isPassed ? "A" : "C")} size="sm" />
                          <div className="flex flex-col">
                            <span className="font-mono text-sm font-bold text-[#212121]">
                              {run.overall_score != null ? `${run.overall_score.toFixed(1)}/100` : "Pending"}
                            </span>
                            <span className="text-[10px] text-[#8C8C8C]">Composite</span>
                          </div>
                        </div>
                      </td>

                      {/* Pillar Breakdown */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1 w-36">
                          {PILLARS.map(({ key, label, scoreKey }) => (
                            <div key={key} className="flex items-center gap-1.5">
                              <span className="text-[9px] text-[#8C8C8C] w-14 shrink-0 uppercase tracking-wide">{label.slice(0, 5)}</span>
                              <PillarScoreBar score={run[scoreKey]} color={PILLARS.find(p => p.key === key)!.color} />
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Outcome */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${
                            isPassed
                              ? "bg-[#ECFDF3] text-[#027A48] border-[#A6F4C5]"
                              : "bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]"
                          }`}
                        >
                          {isPassed ? (
                            <><ShieldCheck className="w-3.5 h-3.5 text-[#12B76A]" />Audit Passed</>
                          ) : (
                            <><ShieldAlert className="w-3.5 h-3.5 text-[#F04438]" />Attention Needed</>
                          )}
                        </span>
                      </td>

                      {/* Date */}
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

                      {/* Action */}
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
