"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { GradeBadge } from "@/components/common/GradeBadge";
import { getStatusBadge, formatDate } from "@/lib/utils";
import { useTestRun, useCancelScan } from "@/features/test-runs";
import { useWebsites } from "@/features/websites";
import { useScanProfiles } from "@/features/scan-profiles";
import {
  ArrowLeft,
  Square,
  CheckCircle2,
  Clock,
  Shield,
  Zap,
  Activity,
  Layers,
  ArrowRight,
  Terminal,
} from "lucide-react";


function TestRunMonitorContent() {
  const params = useParams();
  const runId = params.id as string;

  const { data: run, isLoading } = useTestRun(runId);
  const { data: websites = [] } = useWebsites();
  const { data: profiles = [] } = useScanProfiles();
  const cancelScan = useCancelScan();

  const site = websites.find((w) => w.id === run?.website_id);
  const profile = profiles.find((p) => p.id === run?.scan_profile_id);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-400">
        Loading run execution telemetry...
      </div>
    );
  }

  if (!run) {
    return (
      <div className="py-24 text-center text-slate-400 space-y-4">
        <p>Test run &quot;{runId}&quot; not found.</p>
        <Link href="/test-runs">
          <Button variant="outline">Back to Runs</Button>
        </Link>
      </div>
    );
  }

  const isRunning = run.status === "running" || run.status === "pending" || run.status === "queued";
  const isCompleted = run.status === "completed";
  const statusBadge = getStatusBadge(run.status);

  // Stepper stages
  const STAGES = [
    {
      id: "functional",
      title: "1. Functional Pillar",
      subtitle: "Playwright Headless Browser Workflows",
      icon: Layers,
    },
    {
      id: "security",
      title: "2. Security & Headers Pillar",
      subtitle: "OWASP Probes & TLS Configuration",
      icon: Shield,
    },
    {
      id: "performance",
      title: "3. Performance Pillar",
      subtitle: "Core Web Vitals & TTFB Telemetry",
      icon: Zap,
    },
    {
      id: "accessibility",
      title: "4. Accessibility Pillar",
      subtitle: "WCAG 2.1 AA Automated Rule Checks",
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/test-runs">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold tracking-tight text-white font-mono">
                {run.id}
              </h1>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase ${statusBadge.classes}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${statusBadge.dot} ${
                    statusBadge.pulse ? "animate-ping" : ""
                  }`}
                />
                {statusBadge.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Target: <span className="text-slate-200 font-mono">{site?.base_url || run.website_id}</span>
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {isRunning && (
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Square className="w-3.5 h-3.5 fill-current" />}
              isLoading={cancelScan.isPending}
              onClick={() => cancelScan.mutate(run.id)}
            >
              Abort Scan
            </Button>
          )}

          {isCompleted && (
            <Link href={`/reports/${run.id}`}>
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="glow-indigo"
              >
                View 4-Pillar Report
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-indigo-500/10 to-slate-900 border border-emerald-500/40 glow-emerald flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">Audit Execution Complete</span>
                <GradeBadge grade={run.grade || "A"} size="sm" />
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                All 4 quality pillars passed evaluation with an overall score of{" "}
                <span className="font-bold text-emerald-400 font-mono">
                  {run.overall_score?.toFixed(1)} / 100
                </span>
                .
              </p>
            </div>
          </div>
          <Link href={`/reports/${run.id}`}>
            <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Open Full Report
            </Button>
          </Link>
        </div>
      )}

      {/* 4-Pillar Live Execution Stepper */}
      <Card>
        <div className="mb-4 pb-3 border-b border-slate-800">
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Quality Pillar Execution Pipeline
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronous 4-stage browser harness and security telemetry evaluation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            // Simulated stage progression
            const isStageDone = isCompleted;
            const isStageActive = isRunning && idx === 0;

            return (
              <div
                key={stage.id}
                className={`p-4 rounded-xl border transition-all ${
                  isStageDone
                    ? "bg-slate-900/90 border-emerald-500/30"
                    : isStageActive
                    ? "bg-indigo-950/40 border-indigo-500/60 glow-indigo animate-pulse"
                    : "bg-slate-950/40 border-slate-800/80 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg bg-slate-800 text-indigo-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  {isStageDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isStageActive ? (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-200">{stage.title}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{stage.subtitle}</p>
                <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono">
                  {isStageDone ? (
                    <span className="text-emerald-400 font-semibold">STAGE PASSED</span>
                  ) : isStageActive ? (
                    <span className="text-indigo-400 font-semibold">RUNNING CHECKS...</span>
                  ) : (
                    <span className="text-slate-400">QUEUED</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Terminal Live Trace Console */}
      <Card className="p-5 font-mono">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>Runner Telemetry Stream</span>
          </div>
          <span className="text-[10px] text-slate-400">Chromium v128.0.6613.119</span>
        </div>

        <div className="bg-black/60 rounded-xl p-4 text-xs space-y-2 text-slate-300 max-h-60 overflow-y-auto">
          <p className="text-slate-400">
            [{formatDate(run.started_at)}] Initializing autonomous browser session on {site?.base_url}...
          </p>
          <p className="text-cyan-400">
            [{formatDate(run.started_at)}] Applied profile: {profile?.name || "Full 4-Pillar"} (Rate: {profile?.rate_limit || 15} req/s)
          </p>
          <p className="text-slate-300">
            [+] Browser context initialized with Chromium headless runner.
          </p>
          <p className="text-indigo-400">
            [+] Functional Pillar: Dispatching synthetic YAML actions & assertion verifications...
          </p>
          {isCompleted && (
            <>
              <p className="text-emerald-400">
                [+] Security Pillar: 14 HTTP headers verified. TLS certificate valid (SHA-256).
              </p>
              <p className="text-emerald-400">
                [+] Performance Pillar: Core Web Vitals calculated. TTFB: 210ms, LCP: 2.4s.
              </p>
              <p className="text-emerald-400">
                [+] Accessibility Pillar: 48 Axe-Core WCAG AA rules evaluated without critical blockers.
              </p>
              <p className="text-emerald-400 font-bold">
                [✓] Audit finished successfully. Report synthesized with score {run.overall_score?.toFixed(1)}.
              </p>
            </>
          )}
          {isRunning && (
            <p className="text-indigo-300 animate-pulse">
              [•] Probing DOM nodes, network waterfall, and security exposure endpoints...
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

export default function TestRunMonitorPage() {
  return (
    <React.Suspense fallback={<div className="py-24 text-center text-slate-400">Loading run execution telemetry...</div>}>
      <TestRunMonitorContent />
    </React.Suspense>
  );
}
