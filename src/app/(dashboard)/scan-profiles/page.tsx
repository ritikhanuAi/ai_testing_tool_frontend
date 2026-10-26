"use client";

import React, { useState } from "react";
import { Card } from "@/components/common/Card";
import { Button } from "@/components/common/Button";
import { useScanProfiles } from "@/features/scan-profiles";
import { AddProfileModal } from "@/components/scan-profiles/AddProfileModal";
import {
  Sliders,
  Plus,
  Gauge,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

export default function ScanProfilesPage() {
  const { data: profiles = [], isLoading } = useScanProfiles();
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Scan Profile Configurations
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Quality pillar selection, safety policies, execution concurrency limits, and timeouts.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddOpen(true)}
        >
          Create Profile
        </Button>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {isLoading ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            Loading scan profiles...
          </div>
        ) : (
          profiles.map((prof) => (
            <Card key={prof.id} hoverable className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-100">{prof.name}</h3>
                      <span className="text-[10px] font-mono text-slate-400">ID: {prof.id}</span>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      prof.allow_state_changing
                        ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                        : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                    }`}
                  >
                    {prof.allow_state_changing ? "STATE-CHANGING" : "READ-ONLY"}
                  </span>
                </div>

                {prof.description && (
                  <p className="text-xs text-slate-400 mt-2 mb-4 leading-relaxed">
                    {prof.description}
                  </p>
                )}

                {/* 4 Pillars Status Indicators */}
                <div className="grid grid-cols-2 gap-2 my-4">
                  {[
                    { label: "Functional", active: prof.check_functional, color: "text-blue-400" },
                    { label: "Security", active: prof.check_security, color: "text-emerald-400" },
                    { label: "Performance", active: prof.check_performance, color: "text-purple-400" },
                    { label: "Accessibility", active: prof.check_accessibility, color: "text-rose-400" },
                  ].map((p) => (
                    <div
                      key={p.label}
                      className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${
                        p.active
                          ? "bg-slate-900/80 border-slate-700 text-slate-200"
                          : "bg-slate-950/40 border-slate-900 text-slate-400"
                      }`}
                    >
                      <span className="font-medium">{p.label}</span>
                      {p.active ? (
                        <CheckCircle2 className={`w-4 h-4 ${p.color}`} />
                      ) : (
                        <XCircle className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Guardrail Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Gauge className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Rate Limit:</span>
                    <span className="font-mono text-slate-200 font-semibold">{prof.rate_limit} req/s</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Timeout:</span>
                    <span className="font-mono text-slate-200 font-semibold">{prof.timeout_seconds}s</span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <AddProfileModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
}
