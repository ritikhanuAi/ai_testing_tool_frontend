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
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#F8F9FA] border border-[#E6E6E6]">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B6B6B]">Severity:</span>
            <SeverityPill severity={finding.severity} size="md" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B6B6B]">SHA-1 Fingerprint:</span>
            <span className="font-mono text-xs text-[#FF6C37] bg-[#FFF1EB] px-2 py-0.5 rounded border border-[#FEDF89]">
              {finding.fingerprint}
            </span>
            <button
              onClick={copyFingerprint}
              className="p-1 text-[#8C8C8C] hover:text-[#212121] transition-colors cursor-pointer"
              title="Copy Fingerprint"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#12B76A]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#594139] block">
            Technical Diagnosis
          </span>
          <p className="text-xs text-[#212121] leading-relaxed bg-[#F8F9FA] p-3.5 rounded-xl border border-[#E6E6E6]">
            {finding.description}
          </p>
        </div>

        {/* Selector or URL Location */}
        {finding.selector_or_url && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#594139] block">
              Affected DOM Element or Endpoint
            </span>
            <div className="p-3 rounded-xl bg-[#F5F3F3] border border-[#E6E6E6] font-mono text-xs text-[#212121] flex items-center justify-between">
              <span className="truncate">{finding.selector_or_url}</span>
            </div>
          </div>
        )}

        {/* Suggested Fix Action */}
        {finding.suggested_fix && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#027A48] flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-[#12B76A]" />
              Suggested Remediation Guidance
            </span>
            <div className="p-3.5 rounded-xl bg-[#ECFDF3] border border-[#A6F4C5] text-xs text-[#027A48] leading-relaxed font-mono">
              {finding.suggested_fix}
            </div>
          </div>
        )}

        {/* Simulated Evidence Screenshot Lightbox */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#594139] flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-[#FF6C37]" />
            Captured Visual Evidence & DOM Snapshot
          </span>
          <div className="p-6 rounded-xl bg-[#F8F9FA] border border-[#E6E6E6] flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-white border border-[#E6E6E6] flex items-center justify-center text-[#FF6C37] shadow-xs">
              <Terminal className="w-6 h-6 text-[#FF6C37]" />
            </div>
            <p className="text-xs text-[#212121] font-mono font-medium">
              {finding.evidence_path || `storage/evidence/${finding.fingerprint}.png`}
            </p>
            <p className="text-[11px] text-[#6B6B6B]">
              High-resolution viewport screenshot and DOM tree captured at step execution.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-[#E6E6E6]">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
