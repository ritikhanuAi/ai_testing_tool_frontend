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
      <div className="py-24 text-center text-[#8C8C8C]">
        <div className="w-8 h-8 rounded-full border-2 border-[#E6E6E6] border-t-[#FF6C37] animate-spin mx-auto mb-3" />
        <span className="text-sm font-medium">Loading multi-pillar report diagnostics...</span>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="py-24 text-center text-[#6B6B6B] space-y-4">
        <p className="text-base font-semibold text-[#212121]">Report for test run &quot;{runId}&quot; not found.</p>
        <Link href="/reports">
          <Button variant="outline">Back to Reports</Button>
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
          <Link href="/reports">
            <Button variant="ghost" size="sm" className="text-[#594139] hover:text-[#212121]">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-tight text-[#212121]">
                Multi-Pillar Quality Audit Report
              </h1>
              <span className="font-mono text-xs text-[#FF6C37] bg-[#FFF1EB] px-2.5 py-0.5 rounded border border-[#FEDF89] font-semibold">
                {runId}
              </span>
            </div>
            <p className="text-xs text-[#6B6B6B] mt-1">
              Target:{" "}
              <a
                href={report.report_data.target_url}
                target="_blank"
                rel="noreferrer"
                className="text-[#FF6C37] hover:underline font-mono"
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
      <Card className="p-6 md:p-8 bg-white border border-[#E6E6E6] rounded-xl shadow-xs relative overflow-hidden">
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
                      ? "bg-[#ECFDF3] text-[#027A48] border-[#A6F4C5]"
                      : "bg-[#FEF3F2] text-[#B42318] border-[#FECDCA]"
                  }`}
                >
                  {report.passed ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#12B76A]" />
                      AUDIT PASSED
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5 text-[#F04438]" />
                      AUDIT FAILED
                    </>
                  )}
                </span>
              </div>
              <p className="text-sm text-[#594139] max-w-md">
                Composite evaluation weighted across 4 quality pillars (Functional 35%, Security 25%, Performance 20%, Accessibility 20%).
              </p>
            </div>
          </div>

          {/* Right: Key Telemetry Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t lg:border-t-0 lg:border-l border-[#E6E6E6] lg:pl-8 pt-4 lg:pt-0 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C8C8C] block mb-0.5">
                Total Findings
              </span>
              <span className="text-lg font-bold text-[#212121] font-mono">
                {report.total_findings}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#B42318] block mb-0.5">
                Critical Severity
              </span>
              <span className="text-lg font-bold text-[#B42318] font-mono">
                {report.critical_findings}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#B54708] block mb-0.5">
                High Severity
              </span>
              <span className="text-lg font-bold text-[#B54708] font-mono">
                {report.high_findings}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C8C8C] block mb-0.5">
                Browser Engine
              </span>
              <span className="text-sm font-semibold text-[#212121]">Chromium Headless</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C8C8C] block mb-0.5">
                Evaluation Date
              </span>
              <span className="text-xs text-[#594139] font-mono">
                {formatDate(run?.completed_at || run?.started_at)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C8C8C] block mb-0.5">
                Remediation Status
              </span>
              <span className="text-xs text-[#FF6C37] font-semibold">Ready for Review</span>
            </div>
          </div>
        </div>
      </Card>

      {/* 4-Pillar Score Cards Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Functional */}
        <Card hoverable className="border-t-4 border-t-[#175CD3] bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#175CD3]">
              Functional
            </span>
            <div className="p-1.5 rounded-lg bg-[#EFF8FF] text-[#175CD3]">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#212121]">
              {report.functional_score.toFixed(1)}%
            </span>
            <span className="text-[10px] text-[#8C8C8C] uppercase font-semibold">Weight: 35%</span>
          </div>
          <p className="text-[11px] text-[#6B6B6B] mt-2">
            Synthetic Playwright actions, selector workflows, and assertions
          </p>
        </Card>

        {/* Pillar 2: Security */}
        <Card hoverable className="border-t-4 border-t-[#027A48] bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#027A48]">
              Security
            </span>
            <div className="p-1.5 rounded-lg bg-[#ECFDF3] text-[#027A48]">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#212121]">
              {report.security_score.toFixed(1)}%
            </span>
            <span className="text-[10px] text-[#8C8C8C] uppercase font-semibold">Weight: 25%</span>
          </div>
          <p className="text-[11px] text-[#6B6B6B] mt-2">
            OWASP header hardening, TLS grade, and exposure probes
          </p>
        </Card>

        {/* Pillar 3: Performance */}
        <Card hoverable className="border-t-4 border-t-[#C11574] bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C11574]">
              Performance
            </span>
            <div className="p-1.5 rounded-lg bg-[#FDF4FF] text-[#C11574]">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#212121]">
              {report.performance_score.toFixed(1)}%
            </span>
            <span className="text-[10px] text-[#8C8C8C] uppercase font-semibold">Weight: 20%</span>
          </div>
          <p className="text-[11px] text-[#6B6B6B] mt-2">
            Core Web Vitals telemetry: TTFB, LCP, CLS, and FID metrics
          </p>
        </Card>

        {/* Pillar 4: Accessibility */}
        <Card hoverable className="border-t-4 border-t-[#FF6C37] bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF6C37]">
              Accessibility
            </span>
            <div className="p-1.5 rounded-lg bg-[#FFF1EB] text-[#FF6C37]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-[#212121]">
              {report.accessibility_score.toFixed(1)}%
            </span>
            <span className="text-[10px] text-[#8C8C8C] uppercase font-semibold">Weight: 20%</span>
          </div>
          <p className="text-[11px] text-[#6B6B6B] mt-2">
            Automated WCAG 2.1 AA Axe checks, color contrast, and ARIA tags
          </p>
        </Card>
      </div>

      {/* AI Executive Summary Box */}
      <div className="p-4 rounded-xl bg-[#FFF8E6] border border-[#FEDF89] flex items-start gap-3.5">
        <Sparkles className="w-5 h-5 text-[#F79009] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <p className="font-bold text-[#B54708] uppercase tracking-wide">
            Autonomous Diagnostic Synthesis
          </p>
          <p className="text-[#7A2E0E] leading-relaxed">
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
      <Card className="p-0 overflow-hidden bg-white border border-[#E6E6E6] rounded-xl">
        <div className="p-5 border-b border-[#E6E6E6]">
          <h3 className="text-base font-semibold text-[#212121] tracking-tight">Audit Findings & Remediations</h3>
          <p className="text-xs text-[#6B6B6B] mt-0.5">
            Detected {allFindings.length} telemetry findings with deterministic SHA-1 fingerprints
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border-b border-[#E6E6E6] bg-[#FAFAFA]">
          {/* Severity Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {["all", "critical", "high", "medium", "low"].map((sev) => {
              const count =
                sev === "all" ? allFindings.length : allFindings.filter((f) => f.severity === sev).length;
              return (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    severityFilter === sev
                      ? "bg-[#212121] text-white shadow-xs"
                      : "bg-white text-[#6B6B6B] hover:text-[#212121] border border-[#E6E6E6]"
                  }`}
                >
                  {sev} <span className="ml-1 text-[10px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 text-[#8C8C8C] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title or fingerprint..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white border border-[#E6E6E6] text-xs text-[#212121] placeholder-[#8C8C8C] focus:outline-none focus:border-[#FF6C37]"
            />
          </div>
        </div>

        {/* Findings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E6E6E6] bg-[#F5F3F3] text-[#594139] uppercase tracking-wider text-[10px] font-semibold">
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Finding Title & Diagnosis</th>
                <th className="py-3 px-4">Fingerprint</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E6E6]">
              {filteredFindings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[#8C8C8C]">
                    No findings match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredFindings.map((finding) => (
                  <tr
                    key={finding.id}
                    onClick={() => setSelectedFinding(finding)}
                    className="hover:bg-[#F9F8F7] cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 align-top">
                      <SeverityPill severity={finding.severity} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 align-top max-w-lg">
                      <p className="font-semibold text-[#212121] text-sm">{finding.title}</p>
                      <p className="text-xs text-[#6B6B6B] mt-1 line-clamp-2">
                        {finding.description}
                      </p>
                      {finding.selector_or_url && (
                        <div className="mt-1.5 font-mono text-[11px] text-[#594139] bg-[#F5F3F3] px-2 py-0.5 rounded border border-[#E6E6E6] inline-block truncate max-w-md">
                          {finding.selector_or_url}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 align-top font-mono text-[#FF6C37] text-xs">
                      {finding.fingerprint}
                    </td>
                    <td className="py-3.5 px-4 align-top text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                        className="text-[#594139] hover:text-[#212121]"
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
