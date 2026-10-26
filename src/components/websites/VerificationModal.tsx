"use client";

import React, { useState } from "react";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { useVerifyWebsite } from "@/hooks/useWebsites";
import { WebsiteResponse } from "@/types/website";
import { Check, Copy, Shield, Globe, FileText } from "lucide-react";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  website: WebsiteResponse | null;
}

export function VerificationModal({ isOpen, onClose, website }: VerificationModalProps) {
  const verifyWebsite = useVerifyWebsite();
  const [activeTab, setActiveTab] = useState<"dns" | "http">("dns");
  const [copied, setCopied] = useState(false);
  const [verificationResult, setVerificationResult] = useState<string | null>(null);

  if (!website) return null;

  const hostname = (() => {
    try {
      return new URL(website.base_url).hostname;
    } catch {
      return website.base_url;
    }
  })();

  const token = website.verification_token || `ai-verify-${website.id}`;
  const dnsTxtValue = `ai-testing-verify=${token}`;
  const httpUrl = `${website.base_url}/.well-known/ai-testing-token.txt`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerify = async () => {
    try {
      const res = await verifyWebsite.mutateAsync(website.id);
      setVerificationResult(res.message);
      setTimeout(() => {
        onClose();
        setVerificationResult(null);
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Verification failed";
      alert(message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify Domain Ownership"
      description={`Prove administrative ownership of ${hostname} to unlock state-changing test capabilities and unthrottled audits.`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Verification Status Pill */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">Current Authorization Status</p>
              <p className="text-[11px] text-slate-400">Required before running full-scale vulnerability scans</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
              website.verification_status === "verified"
                ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                : "bg-amber-500/15 text-amber-300 border-amber-500/30"
            }`}
          >
            {website.verification_status.toUpperCase()}
          </span>
        </div>

        {/* Method Tabs */}
        <div className="flex border-b border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("dns")}
            className={`flex items-center gap-2 pb-2.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "dns"
                ? "border-indigo-500 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Method 1: DNS TXT Record (Recommended)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("http")}
            className={`flex items-center gap-2 pb-2.5 px-4 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "http"
                ? "border-indigo-500 text-indigo-300"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Method 2: HTTP File Upload
          </button>
        </div>

        {/* Tab 1: DNS TXT */}
        {activeTab === "dns" && (
          <div className="space-y-3.5">
            <p className="text-xs text-slate-300 leading-relaxed">
              Add the following TXT record to your DNS zone provider (Cloudflare, Route 53, Namecheap, etc.):
            </p>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Record Host / Name</span>
                  <span className="font-mono text-slate-200">{`_ai-testing.${hostname}`}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`_ai-testing.${hostname}`)}
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Record Value</span>
                  <span className="font-mono text-indigo-300">{dnsTxtValue}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(dnsTxtValue)}
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: HTTP File */}
        {activeTab === "http" && (
          <div className="space-y-3.5">
            <p className="text-xs text-slate-300 leading-relaxed">
              Upload a plain-text file to your web server so it is publicly reachable at:
            </p>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 truncate">
              {httpUrl}
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">File Content</span>
                <span className="font-mono text-indigo-300">{token}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(token)}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </Button>
            </div>
          </div>
        )}

        {/* Result Message */}
        {verificationResult && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{verificationResult}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            isLoading={verifyWebsite.isPending}
            onClick={handleVerify}
            leftIcon={<Shield className="w-4 h-4" />}
          >
            Verify Domain Ownership Now
          </Button>
        </div>
      </div>
    </Modal>
  );
}
