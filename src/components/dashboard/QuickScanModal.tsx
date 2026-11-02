"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/common/Modal";
import { Select, Switch } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useWebsites } from "@/features/websites";
import { useScanProfiles } from "@/features/scan-profiles";
import { useTestPacks } from "@/features/test-packs";
import { useTriggerScan } from "@/features/test-runs";
import { Play, Sparkles, UserRound } from "lucide-react";
import { TestCaseMode } from "@/types/test-run";

interface QuickScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultWebsiteId?: string;
}

export function QuickScanModal({ isOpen, onClose, defaultWebsiteId }: QuickScanModalProps) {
  const router = useRouter();
  const { data: websites = [] } = useWebsites();
  const { data: profiles = [] } = useScanProfiles();
  const { data: packs = [] } = useTestPacks();
  const triggerScan = useTriggerScan();

  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>("");
  const [selectedProfileId, setSelectedProfileId] = useState<string>("");
  const [testMode, setTestMode] = useState<TestCaseMode>("ai");
  const [packId, setPackId] = useState<string>("");
  const [formError, setFormError] = useState<string>("");
  const [headedBrowser, setHeadedBrowser] = useState(false);

  // Derive active selections: explicit user selection > default prop > catalog first item
  const activeWebsiteId =
    selectedWebsiteId || defaultWebsiteId || (websites.length > 0 ? websites[0].id : "");
  const activeProfileId =
    selectedProfileId || (profiles.length > 0 ? profiles[0].id : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWebsiteId) return;
    // Human mode needs a test pack; AI mode never sends one (the two modes are exclusive).
    if (testMode === "human" && !packId) {
      setFormError("Choose a test pack to run human test cases.");
      return;
    }
    setFormError("");

    try {
      const run = await triggerScan.mutateAsync({
        website_id: activeWebsiteId,
        scan_profile_id: activeProfileId || undefined,
        test_pack_id: testMode === "human" ? packId : undefined,
        advanced_options: {
          headless: !headedBrowser,
          slow_mo_ms: headedBrowser ? 300 : 0,
        },
      });
      onClose();
      router.push(`/test-runs/${run.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert(`Failed to launch scan: ${message}`);
    }
  };

  const websiteOptions = websites.map((w) => ({
    label: `${w.name} (${w.base_url}) - [${w.verification_status.toUpperCase()}]`,
    value: w.id,
  }));

  const profileOptions = profiles.map((p) => ({
    label: `${p.name} (Rate: ${p.rate_limit} req/s)`,
    value: p.id,
  }));

  const validPacks = packs.filter((pk) => pk.is_valid && pk.cases_count > 0);
  const packOptions = [
    { label: validPacks.length ? "Select a test pack…" : "No saved test packs yet", value: "" },
    ...validPacks.map((pk) => ({
      label: `${pk.title} (${pk.cases_count} cases, v${pk.version})`,
      value: pk.id,
    })),
  ];

  const modeButtonClass = (active: boolean) =>
    `flex-1 flex items-center justify-center gap-2 h-9 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
      active ? "border-[#FF6C37] bg-[#FFF1EB] text-[#212121]" : "border-[#E6E6E6] bg-white text-[#594139] hover:border-[#FFB596]"
    }`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Launch Automated Quality Scan"
      description="Select the target website, the scan profile, and who writes the test cases (AI or human)."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Target Website *"
          options={websiteOptions}
          value={activeWebsiteId}
          onChange={(e) => setSelectedWebsiteId(e.target.value)}
          helperText="Select a registered domain from your target catalog."
        />

        <Select
          label="Scan Profile Policy *"
          options={profileOptions}
          value={activeProfileId}
          onChange={(e) => setSelectedProfileId(e.target.value)}
          helperText="Determines active pillars (Functional, Security, Performance, A11y) and safety guardrails."
        />

        <div>
          <span className="block text-sm font-medium mb-1.5">Who writes the test cases? *</span>
          <div className="flex gap-2" role="radiogroup" aria-label="Test case mode">
            <button
              type="button"
              role="radio"
              aria-checked={testMode === "ai"}
              onClick={() => { setTestMode("ai"); setFormError(""); }}
              className={modeButtonClass(testMode === "ai")}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF6C37]" /> AI test cases
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={testMode === "human"}
              onClick={() => { setTestMode("human"); setFormError(""); }}
              className={modeButtonClass(testMode === "human")}
            >
              <UserRound className="w-3.5 h-3.5 text-[#175CD3]" /> Human test cases
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-1.5">
            {testMode === "ai"
              ? "AI explores the site and writes the test cases."
              : "Only your test pack runs. No AI is used anywhere in the scan."}
          </p>
        </div>

        {testMode === "human" && (
          <Select
            label="Test Pack *"
            options={packOptions}
            value={packId}
            onChange={(e) => { setPackId(e.target.value); setFormError(""); }}
            error={formError || undefined}
            helperText={formError ? undefined : "Human-written test cases run in the Functional check."}
          />
        )}

        <div className="pt-2 border-t border-slate-800/80">
          <Switch
            id="quick-scan-headed-browser"
            checked={headedBrowser}
            onChange={setHeadedBrowser}
            label="Live Browser View (Headed Mode)"
            description="Opens a visible Chromium window on your desktop to watch Playwright execute test steps in real-time."
          />
        </div>

        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-start gap-3 mt-4">
          <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <p className="text-xs text-indigo-300 leading-relaxed">
            Upon trigger, the engine spins up Playwright ({headedBrowser ? "live visible Chromium window" : "headless Chromium"}), {testMode === "human" ? "runs your human test cases, " : "lets AI explore and write test cases, "}runs security header and exposure probes, evaluates Core Web Vitals telemetry, and assesses WCAG 2.1 AA rules.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={triggerScan.isPending}
            leftIcon={<Play className="w-4 h-4 fill-current" />}
          >
            Start Scan Now
          </Button>
        </div>
      </form>
    </Modal>
  );
}
