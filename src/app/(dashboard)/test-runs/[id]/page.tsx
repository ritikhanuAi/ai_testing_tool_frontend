"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/common/Button";
import { GradeBadge } from "@/components/common/GradeBadge";
import { getStatusBadge } from "@/lib/utils";
import { useTestRun, useCancelScan } from "@/features/test-runs";
import { useWebsites } from "@/features/websites";
import { useScanProfiles } from "@/features/scan-profiles";
import { TestRunPillarPipeline } from "@/components/test-runs/TestRunPillarPipeline";
import { TestRunTerminalStream } from "@/components/test-runs/TestRunTerminalStream";
import {
  ArrowLeft,
  Square,
  CheckCircle2,
  ArrowRight,
  Loader2,
  FlaskConical,
  Ban,
  AlertCircle,
  Play,
} from "lucide-react";

function TestRunMonitorContent() {
  const params = useParams();
  const runId = params.id as string;

  const { data: run, isLoading } = useTestRun(runId);
  const { data: websites = [] } = useWebsites();
  const { data: profiles = [] } = useScanProfiles();
  const cancelScan = useCancelScan();
  const [abortError, setAbortError] = useState<string | null>(null);

  const site = websites.find((w) => w.id === run?.website_id);
  const profile = profiles.find((p) => p.id === run?.scan_profile_id);

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="inline-flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#FF6C37]" />
          <span className="text-xs text-[#8C8C8C] font-medium">Loading run execution telemetry...</span>
        </div>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#F5F3F3] border border-[#E6E6E6] flex items-center justify-center text-[#6B6B6B] mx-auto">
          <FlaskConical className="w-6 h-6 text-[#FF6C37]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-[#212121]">Test Run Not Found</h3>
          <p className="text-xs text-[#6B6B6B]">The requested execution session could not be located.</p>
        </div>
        <Link href="/test-runs">
          <Button variant="secondary" size="sm">Back to Test Runs</Button>
        </Link>
      </div>
    );
  }

  const isRunning = run.status === "running" || run.status === "pending" || run.status === "queued";
  const isCompleted = run.status === "completed";
  const isCancelled = run.status === "cancelled";
  const statusBadge = getStatusBadge(run.status);

  const handleAbort = async () => {
    if (window.confirm("Are you sure you want to abort this active scan? This will immediately terminate all running worker processes.")) {
      try {
        setAbortError(null);
        await cancelScan.mutateAsync(run.id);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to abort scan. Please try again.";
        setAbortError(msg);
      }
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Abort Error Banner if any */}
      {abortError && (
        <div className="p-3.5 rounded-lg bg-[#FEF3F2] border border-[#F04438]/30 text-xs text-[#93000A] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#F04438] shrink-0" />
            <span>{abortError}</span>
          </div>
          <button
            onClick={() => setAbortError(null)}
            className="text-[11px] font-semibold text-[#93000A] hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/test-runs">
            <Button variant="secondary" size="sm" className="h-9 w-9 p-0">
              <ArrowLeft className="w-4 h-4 text-[#6B6B6B]" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold tracking-tight text-[#212121]">
                {site?.name || "Website Execution Monitor"}
              </h1>
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
            </div>
            <p className="text-xs text-[#6B6B6B] mt-0.5 flex items-center gap-1.5 font-mono">
              <span>Target:</span>
              <span className="text-[#212121] font-medium">{site?.base_url || run.website_id}</span>
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {isRunning && (
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Square className="w-3.5 h-3.5 fill-current" />}
              isLoading={cancelScan.isPending}
              onClick={handleAbort}
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
              >
                View 4-Pillar Report
              </Button>
            </Link>
          )}

          {isCancelled && (
            <Link href="/websites">
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Play className="w-3 h-3 fill-current" />}
              >
                Rerun Test
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-r from-[#F6FEF9] to-white border border-[#12B76A]/30 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#ECFDF3] text-[#12B76A] border border-[#12B76A]/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold text-[#212121]">
                  Audit Execution Complete
                </span>
                <GradeBadge grade={run.grade || "A"} size="sm" />
              </div>
              <p className="text-xs text-[#6B6B6B] mt-0.5">
                All 4 quality pillars passed evaluation with an overall score of{" "}
                <span className="font-bold text-[#12B76A] font-mono">
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

      {/* Cancelled Banner */}
      {isCancelled && (
        <div className="p-5 sm:p-6 rounded-xl bg-[#F5F3F3] border border-[#E6E6E6] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-white text-[#8C8C8C] border border-[#E6E6E6] flex items-center justify-center shrink-0">
              <Ban className="w-5 h-5 text-[#8C8C8C]" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#212121]">
                Scan Execution Aborted
              </h3>
              <p className="text-xs text-[#6B6B6B] mt-0.5">
                This audit session was manually cancelled before all quality pillars could complete.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/test-runs">
              <Button variant="secondary" size="sm">
                Back to Test Runs
              </Button>
            </Link>
            <Link href="/websites">
              <Button variant="primary" size="sm" leftIcon={<Play className="w-3 h-3 fill-current" />}>
                Launch New Scan
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* 4-Pillar Live Execution Stepper */}
      <TestRunPillarPipeline
        isCompleted={isCompleted}
        isRunning={isRunning}
      />

      {/* Terminal Live Trace Console */}
      <TestRunTerminalStream
        startedAt={run.started_at}
        targetUrl={site?.base_url || run.website_id}
        profileName={profile?.name}
        rateLimit={profile?.rate_limit}
        overallScore={run.overall_score}
        isCompleted={isCompleted}
        isRunning={isRunning}
        isCancelled={isCancelled}
      />
    </div>
  );
}

export default function TestRunMonitorPage() {
  return (
    <React.Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="inline-flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-[#FF6C37]" />
            <span className="text-xs text-[#8C8C8C] font-medium">Loading run execution telemetry...</span>
          </div>
        </div>
      }
    >
      <TestRunMonitorContent />
    </React.Suspense>
  );
}
