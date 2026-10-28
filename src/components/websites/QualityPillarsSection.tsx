"use client";

import React from "react";
import { Layers, Shield, Zap, Activity, AlertCircle, CheckSquare, Square } from "lucide-react";

interface QualityPillarsSectionProps {
  checkFunctional: boolean;
  setCheckFunctional: (val: boolean) => void;
  checkSecurity: boolean;
  setCheckSecurity: (val: boolean) => void;
  checkPerformance: boolean;
  setCheckPerformance: (val: boolean) => void;
  checkAccessibility: boolean;
  setCheckAccessibility: (val: boolean) => void;
  selectedCount: number;
  allSelected: boolean;
  toggleSelectAll: () => void;
  pillarError: string;
  clearPillarError: () => void;
}

export function QualityPillarsSection({
  checkFunctional,
  setCheckFunctional,
  checkSecurity,
  setCheckSecurity,
  checkPerformance,
  setCheckPerformance,
  checkAccessibility,
  setCheckAccessibility,
  selectedCount,
  allSelected,
  toggleSelectAll,
  pillarError,
  clearPillarError,
}: QualityPillarsSectionProps) {
  return (
    <div className="pt-3 border-t border-[#E6E6E6]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-[#212121]">
            Quality Pillars to Test *
          </label>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F5F3F3] text-[#594139] border border-[#E6E6E6]">
            {selectedCount} of 4 active
          </span>
        </div>

        <button
          type="button"
          onClick={toggleSelectAll}
          className="text-xs font-medium text-[#FF6C37] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
        >
          {allSelected ? (
            <>
              <Square className="w-3.5 h-3.5" />
              Deselect All
            </>
          ) : (
            <>
              <CheckSquare className="w-3.5 h-3.5" />
              Select All
            </>
          )}
        </button>
      </div>

      {pillarError && (
        <div className="mb-2.5 p-2 rounded-lg bg-[#FFF1F0] border border-[#FFA39E] text-xs text-[#BA1A1A] font-medium flex items-center gap-1.5 animate-in fade-in duration-150">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {pillarError}
        </div>
      )}

      {/* Minimized 4 Pillars Toggle Chips Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Pillar 1: Functional */}
        <div
          onClick={() => {
            setCheckFunctional(!checkFunctional);
            clearPillarError();
          }}
          role="checkbox"
          aria-checked={checkFunctional}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              setCheckFunctional(!checkFunctional);
              clearPillarError();
            }
          }}
          className={`py-2 px-3 rounded-lg border transition-all duration-150 cursor-pointer flex items-center justify-between gap-2 select-none focus:outline-none focus:ring-2 focus:ring-[#0BA5EC]/30 ${
            checkFunctional
              ? "bg-[#F0F9FF] border-[#0BA5EC] shadow-2xs text-[#026AA2]"
              : "bg-white border-[#E6E6E6] text-[#6B6B6B] hover:border-[#D0D0D0] opacity-80"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                checkFunctional ? "bg-[#0BA5EC] text-white" : "bg-[#F5F3F3] text-[#8C8C8C]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold truncate">Functional</span>
          </div>
          <span
            className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border text-[10px] font-bold ${
              checkFunctional
                ? "bg-[#0BA5EC] border-[#0BA5EC] text-white"
                : "border-[#D0D0D0] bg-white text-transparent"
            }`}
          >
            {checkFunctional ? "✓" : ""}
          </span>
        </div>

        {/* Pillar 2: Security */}
        <div
          onClick={() => {
            setCheckSecurity(!checkSecurity);
            clearPillarError();
          }}
          role="checkbox"
          aria-checked={checkSecurity}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              setCheckSecurity(!checkSecurity);
              clearPillarError();
            }
          }}
          className={`py-2 px-3 rounded-lg border transition-all duration-150 cursor-pointer flex items-center justify-between gap-2 select-none focus:outline-none focus:ring-2 focus:ring-[#12B76A]/30 ${
            checkSecurity
              ? "bg-[#ECFDF3] border-[#12B76A] shadow-2xs text-[#027A48]"
              : "bg-white border-[#E6E6E6] text-[#6B6B6B] hover:border-[#D0D0D0] opacity-80"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                checkSecurity ? "bg-[#12B76A] text-white" : "bg-[#F5F3F3] text-[#8C8C8C]"
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold truncate">Security & TLS</span>
          </div>
          <span
            className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border text-[10px] font-bold ${
              checkSecurity
                ? "bg-[#12B76A] border-[#12B76A] text-white"
                : "border-[#D0D0D0] bg-white text-transparent"
            }`}
          >
            {checkSecurity ? "✓" : ""}
          </span>
        </div>

        {/* Pillar 3: Performance */}
        <div
          onClick={() => {
            setCheckPerformance(!checkPerformance);
            clearPillarError();
          }}
          role="checkbox"
          aria-checked={checkPerformance}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              setCheckPerformance(!checkPerformance);
              clearPillarError();
            }
          }}
          className={`py-2 px-3 rounded-lg border transition-all duration-150 cursor-pointer flex items-center justify-between gap-2 select-none focus:outline-none focus:ring-2 focus:ring-[#F79009]/30 ${
            checkPerformance
              ? "bg-[#FFF8E6] border-[#F79009] shadow-2xs text-[#B54708]"
              : "bg-white border-[#E6E6E6] text-[#6B6B6B] hover:border-[#D0D0D0] opacity-80"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                checkPerformance ? "bg-[#F79009] text-white" : "bg-[#F5F3F3] text-[#8C8C8C]"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold truncate">Performance</span>
          </div>
          <span
            className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border text-[10px] font-bold ${
              checkPerformance
                ? "bg-[#F79009] border-[#F79009] text-white"
                : "border-[#D0D0D0] bg-white text-transparent"
            }`}
          >
            {checkPerformance ? "✓" : ""}
          </span>
        </div>

        {/* Pillar 4: Accessibility */}
        <div
          onClick={() => {
            setCheckAccessibility(!checkAccessibility);
            clearPillarError();
          }}
          role="checkbox"
          aria-checked={checkAccessibility}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              setCheckAccessibility(!checkAccessibility);
              clearPillarError();
            }
          }}
          className={`py-2 px-3 rounded-lg border transition-all duration-150 cursor-pointer flex items-center justify-between gap-2 select-none focus:outline-none focus:ring-2 focus:ring-[#9333EA]/30 ${
            checkAccessibility
              ? "bg-[#FAF5FF] border-[#9333EA] shadow-2xs text-[#7E22CE]"
              : "bg-white border-[#E6E6E6] text-[#6B6B6B] hover:border-[#D0D0D0] opacity-80"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                checkAccessibility ? "bg-[#9333EA] text-white" : "bg-[#F5F3F3] text-[#8C8C8C]"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold truncate">Accessibility</span>
          </div>
          <span
            className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border text-[10px] font-bold ${
              checkAccessibility
                ? "bg-[#9333EA] border-[#9333EA] text-white"
                : "border-[#D0D0D0] bg-white text-transparent"
            }`}
          >
            {checkAccessibility ? "✓" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
