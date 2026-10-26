"use client";

import React, { useState } from "react";
import { Modal } from "@/components/common/Modal";
import { Input, Switch } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { useCreateScanProfile } from "@/features/scan-profiles";
import { AlertTriangle, Sliders } from "lucide-react";

interface AddProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddProfileModal({ isOpen, onClose }: AddProfileModalProps) {
  const createProfile = useCreateScanProfile();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [checkFunctional, setCheckFunctional] = useState(true);
  const [checkSecurity, setCheckSecurity] = useState(true);
  const [checkPerformance, setCheckPerformance] = useState(true);
  const [checkAccessibility, setCheckAccessibility] = useState(true);
  const [allowStateChanging, setAllowStateChanging] = useState(false);
  const [rateLimit, setRateLimit] = useState(15);
  const [timeoutSeconds, setTimeoutSeconds] = useState(300);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      await createProfile.mutateAsync({
        name,
        description: description || undefined,
        check_functional: checkFunctional,
        check_security: checkSecurity,
        check_performance: checkPerformance,
        check_accessibility: checkAccessibility,
        allow_state_changing: allowStateChanging,
        rate_limit: Number(rateLimit),
        timeout_seconds: Number(timeoutSeconds),
      });

      setName("");
      setDescription("");
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error creating profile";
      alert(message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Custom Scan Profile"
      description="Configure quality pillar toggles, concurrency limits, and safety boundaries."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Profile Name *"
          placeholder="e.g. Nightly CI/CD Regression Check"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <Input
          label="Description"
          placeholder="Rapid test focusing on functional login and critical security headers"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* 4 Pillars Switchboard */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Active Quality Pillars
          </span>
          <Switch
            label="1. Functional Pillar (Playwright)"
            description="Executes synthetic browser user flows, form fills, clicks, and assertions."
            checked={checkFunctional}
            onChange={setCheckFunctional}
          />
          <div className="border-t border-slate-800/60" />
          <Switch
            label="2. Security Pillar (OWASP Probes)"
            description="Analyzes HTTP headers (HSTS, CSP), cookie flags, TLS certificates, and file exposures."
            checked={checkSecurity}
            onChange={setCheckSecurity}
          />
          <div className="border-t border-slate-800/60" />
          <Switch
            label="3. Performance Pillar (Core Web Vitals)"
            description="Measures client-side load performance: TTFB, LCP, CLS, and First Input Delay."
            checked={checkPerformance}
            onChange={setCheckPerformance}
          />
          <div className="border-t border-slate-800/60" />
          <Switch
            label="4. Accessibility Pillar (Axe-Core WCAG)"
            description="Evaluates automated WCAG 2.1 AA rules, contrast ratios, and screen-reader accessibility."
            checked={checkAccessibility}
            onChange={setCheckAccessibility}
          />
        </div>

        {/* Safety & Concurrency Limits */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Guardrails & Concurrency
          </span>

          {/* Rate Limit Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Rate Limit Concurrency</span>
              <span className="font-mono text-indigo-400 font-bold">{rateLimit} req/sec</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={rateLimit}
              onChange={(e) => setRateLimit(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Timeout */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 font-medium">Execution Timeout (Seconds)</span>
              <span className="font-mono text-indigo-400 font-bold">{timeoutSeconds}s ({Math.round(timeoutSeconds / 60)}m)</span>
            </div>
            <input
              type="range"
              min="30"
              max="1800"
              step="30"
              value={timeoutSeconds}
              onChange={(e) => setTimeoutSeconds(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* State Changing Warning Switch */}
          <div className="pt-2 border-t border-slate-800/60">
            <Switch
              label="Allow State-Changing Actions (Read-Write)"
              description="Permits test actions that modify backend database state (e.g. DELETE, POST mutations)."
              checked={allowStateChanging}
              onChange={setAllowStateChanging}
            />
            {allowStateChanging && (
              <div className="mt-2 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p>
                  Caution: State-changing scans require verified domain ownership and should only be targeted against staging or sandbox environments.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={createProfile.isPending}
            leftIcon={<Sliders className="w-4 h-4" />}
          >
            Save Profile
          </Button>
        </div>
      </form>
    </Modal>
  );
}
