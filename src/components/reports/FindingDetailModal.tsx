"use client";

import React, { useState } from "react";
import { Modal } from "@/components/common/Modal";
import { SeverityPill } from "@/components/common/SeverityPill";
import { Button } from "@/components/common/Button";
import { PillarFinding } from "@/types/report";
import { Copy, Check, Terminal, Lightbulb, ImageIcon } from "lucide-react";

interface FindingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  finding: PillarFinding | null;
}

export function FindingDetailModal({ isOpen, onClose, finding }: FindingDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!finding) return null;

  const copyFingerprint = () => {
    navigator.clipboard.writeText(finding.fingerprint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={finding.title}
      description={`Finding ID: ${finding.id}`}
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Severity & Fingerprint Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Severity:</span>
            <SeverityPill severity={finding.severity} size="md" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">SHA-1 Fingerprint:</span>
            <span className="font-mono text-xs text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              {finding.fingerprint}
            </span>
            <button
              onClick={copyFingerprint}
              className="p-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              title="Copy Fingerprint"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Technical Diagnosis
          </span>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            {finding.description}
          </p>
        </div>

        {/* Selector or URL Location */}
        {finding.selector_or_url && (
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Affected DOM Element or Endpoint
            </span>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 flex items-center justify-between">
              <span className="truncate">{finding.selector_or_url}</span>
            </div>
          </div>
        )}

        {/* Suggested Fix Action */}
        {finding.suggested_fix && (
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              Suggested Remediation Guidance
            </span>
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 leading-relaxed font-mono">
              {finding.suggested_fix}
            </div>
          </div>
        )}

        {/* Simulated Evidence Screenshot Lightbox */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-indigo-400" />
            Captured Visual Evidence & DOM Snapshot
          </span>
          <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
              <Terminal className="w-6 h-6 text-indigo-400" />
            </div>
            <p className="text-xs text-slate-300 font-mono">
              {finding.evidence_path || `storage/evidence/${finding.fingerprint}.png`}
            </p>
            <p className="text-[11px] text-slate-400">
              High-resolution viewport screenshot and DOM tree captured at step execution.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
