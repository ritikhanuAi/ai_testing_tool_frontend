"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { GradeBadge } from "@/components/common/GradeBadge";
import { ScoreGauge } from "@/components/common/ScoreGauge";
import { SeverityPill } from "@/components/common/SeverityPill";
import { FindingDetailModal } from "@/components/reports/FindingDetailModal";
import { useReportSummary } from "@/features/reports";
import { useTestRun } from "@/features/test-runs";
import { PillarFinding } from "@/types/report";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Layers,
  Shield,
  Zap,
  Activity,
  Search,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function ReportDetailPage() {
  const params = useParams();
  const runId = params.runId as string;

  const { data: report, isLoading } = useReportSummary(runId);
  const { data: run } = useTestRun(runId);

  const [selectedFinding, setSelectedFinding] = useState<PillarFinding | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-400">
        Loading multi-pillar report diagnostics...
      </div>
    );
  }

  if (!report) {
    return (
      <div className="py-24 text-center text-slate-400 space-y-4">
        <p>Report for test run &quot;{runId}&quot; not found.</p>
        <Link href="/test-runs">
          <Button variant="outline">Back to Runs</Button>
        </Link>
      </div>
    );
  }

  const allFindings: PillarFinding[] = report.report_data.all_findings || [];

  const filteredFindings = allFindings.filter((f) => {
    if (severityFilter !== "all" && f.severity !== severityFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = f.title.toLowerCase().includes(q);
      const matchDesc = f.description.toLowerCase().includes(q);
      const matchFp = f.fingerprint.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchFp) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/test-runs">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Multi-Pillar Quality Audit Report
              </h1>
              <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                {runId}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Target:{" "}
              <a
                href={report.report_data.target_url}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:underline font-mono"
              >
                {report.report_data.target_url}
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/test-runs">
            <Button variant="outline" size="sm">
              Scan History
            </Button>
          </Link>
        </div>
      </div>

      {/* Scorecard Hero Banner */}
      <Card className="p-6 md:p-8 bg-gradient-to-r from-[#0d162b] via-[#0f172a] to-[#141b2d] border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          {/* Left: Score Gauge & Grade */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <ScoreGauge score={report.overall_score} size={140} strokeWidth={12} label="" />

            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <GradeBadge grade={report.grade} size="lg" />
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                    report.passed
                      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                      : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                  }`}
                >
                  {report.passed ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      AUDIT PASSED
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      AUDIT FAILED
                    </>
                  )}
                </span>
              </div>
              <p className="text-sm text-slate-300 max-w-md">
                Composite evaluation weighted across 4 quality pillars (Functional 35%, Security 25%, Performance 20%, Accessibility 20%).
              </p>
            </div>
          </div>

          {/* Right: Key Telemetry Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t lg:border-t-0 lg:border-l border-slate-800 lg:pl-8 pt-4 lg:pt-0 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Total Findings
              </span>
              <span className="text-lg font-bold text-slate-100 font-mono">
                {report.total_findings}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-400 block mb-0.5">
                Critical Severity
              </span>
              <span className="text-lg font-bold text-rose-400 font-mono">
                {report.critical_findings}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-orange-400 block mb-0.5">
                High Severity
              </span>
              <span className="text-lg font-bold text-orange-400 font-mono">
                {report.high_findings}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Browser Engine
              </span>
              <span className="text-sm font-semibold text-slate-200">Chromium Headless</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Evaluation Date
              </span>
              <span className="text-xs text-slate-300 font-mono">
                {formatDate(run?.completed_at || run?.started_at)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Remediation Status
              </span>
              <span className="text-xs text-indigo-400 font-medium">Ready for Review</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 4-Pillar Score Cards Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Functional */}
        <Card hoverable className="border-t-4 border-t-blue-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Functional
            </span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">
              {report.functional_score.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Weight: 35%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Synthetic Playwright actions, selector workflows, and assertions
          </p>
        </Card>

        {/* Pillar 2: Security */}
        <Card hoverable className="border-t-4 border-t-emerald-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Security
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">
              {report.security_score.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Weight: 25%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            OWASP header hardening, TLS grade, and exposure probes
          </p>
        </Card>

        {/* Pillar 3: Performance */}
        <Card hoverable className="border-t-4 border-t-purple-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Performance
            </span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">
              {report.performance_score.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Weight: 20%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Core Web Vitals telemetry: TTFB, LCP, CLS, and FID metrics
          </p>
        </Card>

        {/* Pillar 4: Accessibility */}
        <Card hoverable className="border-t-4 border-t-rose-500">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Accessibility
            </span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">
              {report.accessibility_score.toFixed(1)}%
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Weight: 20%</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Automated WCAG 2.1 AA Axe checks, color contrast, and ARIA tags
          </p>
        </Card>
      </div>

      {/* AI Executive Summary Box */}
      <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3.5">
        <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <p className="font-bold text-indigo-200 uppercase tracking-wide">
            Autonomous Diagnostic Synthesis
          </p>
          <p className="text-indigo-300/90 leading-relaxed">
            The target achieved an overall score of <span className="font-bold">{report.overall_score.toFixed(1)}/100</span> (Grade {report.grade}).
            {report.critical_findings > 0
              ? ` Critical security exposures were detected that require immediate mitigation before production sign-off.`
              : report.high_findings > 0
              ? ` Security and performance improvements recommended, primarily Content-Security-Policy headers and image asset decoding.`
              : ` Excellent quality across all pillars with zero blocking defects.`}
          </p>
        </div>
      </div>

      {/* Findings Section */}
      <Card>
        <CardHeader
          title="Audit Findings & Remediations"
          subtitle={`Detected ${allFindings.length} telemetry findings with deterministic SHA-1 fingerprints`}
        />

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
          {/* Severity Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {["all", "critical", "high", "medium", "low"].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  severityFilter === sev
                    ? "bg-slate-700 text-white"
                    : "bg-slate-900/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title or fingerprint..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Findings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                <th className="pb-3 font-semibold">Severity</th>
                <th className="pb-3 font-semibold">Finding Title & Diagnosis</th>
                <th className="pb-3 font-semibold">Fingerprint</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredFindings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No findings match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredFindings.map((finding) => (
                  <tr
                    key={finding.id}
                    onClick={() => setSelectedFinding(finding)}
                    className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 align-top">
                      <SeverityPill severity={finding.severity} size="sm" />
                    </td>
                    <td className="py-3.5 align-top max-w-lg">
                      <p className="font-semibold text-slate-100 text-sm">{finding.title}</p>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {finding.description}
                      </p>
                      {finding.selector_or_url && (
                        <div className="mt-1.5 font-mono text-[11px] text-cyan-400/90 truncate max-w-md">
                          {finding.selector_or_url}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 align-top font-mono text-indigo-300 text-xs">
                      {finding.fingerprint}
                    </td>
                    <td className="py-3.5 align-top text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Finding Detail Modal */}
      <FindingDetailModal
        isOpen={!!selectedFinding}
        onClose={() => setSelectedFinding(null)}
        finding={selectedFinding}
      />
    </div>
  );
}
