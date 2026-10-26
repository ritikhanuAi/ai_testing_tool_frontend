"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useTestPacks } from "@/features/test-packs";
import {
  FileCode,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
} from "lucide-react";

export default function TestPacksPage() {
  const { data: packs = [], isLoading } = useTestPacks();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            YAML Test Packs
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Declarative Playwright synthetic test suites, user action workflows, and automated assertions.
          </p>
        </div>
        <Link href="/test-packs/new">
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Author New YAML Pack
          </Button>
        </Link>
      </div>

      {/* Packs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {isLoading ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            Loading test packs...
          </div>
        ) : (
          packs.map((pack) => (
            <Card key={pack.id} hoverable className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-100">{pack.title}</h3>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                        <span>v{pack.version}</span>
                        <span>•</span>
                        <span>ID: {pack.id}</span>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      pack.is_valid
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                    }`}
                  >
                    {pack.is_valid ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        VALID SCHEMA
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        INVALID
                      </>
                    )}
                  </span>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Parsed Test Cases:</span>
                  </div>
                  <span className="font-mono text-cyan-400 font-bold">{pack.cases_count} Scenarios</span>
                </div>

                {/* Code Preview snippet */}
                <div className="mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    YAML Definition Snippet
                  </span>
                  <pre className="p-3 rounded-lg bg-slate-950 border border-slate-900 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-32">
                    {pack.raw_yaml.split("\n").slice(0, 7).join("\n")}
                  </pre>
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">Playwright Chromium Execution</span>
                <Link href="/test-runs">
                  <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Run in Scan
                  </Button>
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
