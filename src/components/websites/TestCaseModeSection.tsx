"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Sparkles, UserRound, Upload, FileText, X, AlertCircle } from "lucide-react";
import { TestCaseMode } from "@/types/test-run";
import { TestPackResponse } from "@/types/test-pack";
import { TEST_CASE_FILE_ACCEPT } from "@/features/test-packs";

interface TestCaseModeSectionProps {
  mode: TestCaseMode;
  setMode: (mode: TestCaseMode) => void;
  packs: TestPackResponse[];
  selectedPackId: string;
  setSelectedPackId: (id: string) => void;
  uploadedFileName: string | null;
  uploadedCasesCount: number;
  onFileSelected: (file: File) => void;
  onClearFile: () => void;
  error?: string;
}

/**
 * Choose who writes the test cases for this scan. The two modes are exclusive:
 * AI mode never runs human cases, and human mode uses no AI at all.
 */
export function TestCaseModeSection({
  mode,
  setMode,
  packs,
  selectedPackId,
  setSelectedPackId,
  uploadedFileName,
  uploadedCasesCount,
  onFileSelected,
  onClearFile,
  error,
}: TestCaseModeSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const validPacks = packs.filter((pack) => pack.is_valid && pack.cases_count > 0);

  const optionClass = (active: boolean) =>
    `flex-1 text-left p-3 rounded-xl border transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FFF1EB] ${
      active ? "border-[#FF6C37] bg-[#FFF1EB]" : "border-[#E6E6E6] bg-white hover:border-[#FFB596]"
    }`;

  return (
    <div className="pt-1 space-y-3">
      <div>
        <h3 className="text-xs sm:text-sm font-semibold text-[#212121]">Who writes the test cases?</h3>
        <p className="text-xs text-[#6B6B6B] mt-0.5">
          Each scan uses one mode only.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5" role="radiogroup" aria-label="Test case mode">
        <button
          type="button"
          role="radio"
          aria-checked={mode === "ai"}
          onClick={() => setMode("ai")}
          className={optionClass(mode === "ai")}
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-[#212121]">
            <Sparkles className="w-4 h-4 text-[#FF6C37]" />
            AI test cases
          </span>
          <span className="block text-xs text-[#6B6B6B] mt-1">
            AI explores the site and writes the test cases. AI also explains problems and reviews screenshots.
          </span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={mode === "human"}
          onClick={() => setMode("human")}
          className={optionClass(mode === "human")}
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-[#212121]">
            <UserRound className="w-4 h-4 text-[#175CD3]" />
            Human test cases
          </span>
          <span className="block text-xs text-[#6B6B6B] mt-1">
            Run only your own test cases (YAML or JSON). No AI is used anywhere in the scan.
          </span>
        </button>
      </div>

      {mode === "human" && (
        <div className="p-3.5 rounded-xl border border-[#E6E6E6] bg-[#FBF9F8] space-y-3">
          <div>
            <label htmlFor="human-test-pack" className="block text-[11px] font-medium text-[#594139] mb-1">
              Choose a saved test pack
            </label>
            <select
              id="human-test-pack"
              value={uploadedFileName ? "" : selectedPackId}
              onChange={(e) => {
                setSelectedPackId(e.target.value);
                if (e.target.value) onClearFile();
              }}
              disabled={validPacks.length === 0}
              className="w-full h-8 px-2 rounded-lg bg-white border border-[#E6E6E6] text-xs text-[#212121] focus:outline-none focus:border-[#FF6C37] disabled:bg-[#F5F3F3] disabled:text-[#8C8C8C]"
            >
              <option value="">
                {validPacks.length === 0 ? "No saved test packs yet" : "Select a test pack…"}
              </option>
              {validPacks.map((pack) => (
                <option key={pack.id} value={pack.id}>
                  {pack.title} ({pack.cases_count} case{pack.cases_count === 1 ? "" : "s"}, v{pack.version})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#8C8C8C]">
            <span className="flex-1 h-px bg-[#E6E6E6]" />
            or
            <span className="flex-1 h-px bg-[#E6E6E6]" />
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept={TEST_CASE_FILE_ACCEPT}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onFileSelected(file);
                e.target.value = ""; // allow picking the same file again
              }}
            />
            {uploadedFileName ? (
              <div className="flex items-center gap-2 h-9 px-3 rounded-lg bg-white border border-[#A6F4C5] text-xs text-[#212121]">
                <FileText className="w-4 h-4 text-[#12B76A] shrink-0" />
                <span className="font-mono truncate">{uploadedFileName}</span>
                <span className="text-[#027A48] shrink-0">
                  {uploadedCasesCount} case{uploadedCasesCount === 1 ? "" : "s"}
                </span>
                <button
                  type="button"
                  onClick={onClearFile}
                  aria-label="Remove uploaded file"
                  className="ml-auto p-1 rounded hover:bg-[#F5F3F3] text-[#8C8C8C] hover:text-[#212121] cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-9 flex items-center justify-center gap-2 rounded-lg border border-dashed border-[#D0D0D0] bg-white text-xs font-medium text-[#594139] hover:border-[#FF6C37] hover:text-[#FF6C37] transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload a test case file (.yaml, .yml, .json)
              </button>
            )}
          </div>

          <p className="text-[11px] text-[#6B6B6B]">
            Need to write test cases first?{" "}
            <Link href="/test-packs/new" className="text-[#FF6C37] font-medium hover:underline">
              Create a test pack
            </Link>
            . Human test cases run in the Functional check.
          </p>
        </div>
      )}

      {error && (
        <p className="flex items-start gap-1.5 text-xs text-[#BA1A1A]" role="alert">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          {error}
        </p>
      )}
    </div>
  );
}
