"use client";

import React from "react";
import Link from "next/link";
import { Globe, ClipboardList, ArrowRight } from "lucide-react";

export function ActionCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
      {/* Card 1: Website Testing */}
      <Link
        href="/websites"
        className="group relative bg-white border border-[#E6E6E6] rounded-xl p-4 sm:p-5 transition-all duration-150 hover:border-[#D4D4D4] hover:shadow-xs flex flex-col justify-between cursor-pointer select-none"
      >
        <div>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-[#FFF1EB] flex items-center justify-center text-[#FF6C37] group-hover:scale-105 transition-transform duration-150">
              <Globe className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-md bg-[#F5F3F3] text-[11px] font-semibold tracking-wide text-[#6B6B6B]">
              Automated Crawl
            </span>
          </div>

          <h2 className="text-sm sm:text-base font-semibold text-[#212121] mt-3 group-hover:text-[#FF6C37] transition-colors">
            Website Testing
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed mt-1">
            Enter a URL and let AI test it automatically. Crawls pages, checks UI elements, and verifies links.
          </p>
        </div>

        <div className="pt-3">
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#FF6C37] group-hover:text-[#E8590C] transition-colors">
            <span>Launch test</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>

      {/* Card 2: Testing with Input Cases */}
      <Link
        href="/test-packs"
        className="group relative bg-white border border-[#E6E6E6] rounded-xl p-4 sm:p-5 transition-all duration-150 hover:border-[#D4D4D4] hover:shadow-xs flex flex-col justify-between cursor-pointer select-none"
      >
        <div>
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-lg bg-[#FFF1EB] flex items-center justify-center text-[#FF6C37] group-hover:scale-105 transition-transform duration-150">
              <ClipboardList className="w-5 h-5" />
            </div>
            <span className="px-2.5 py-0.5 rounded-md bg-[#F5F3F3] text-[11px] font-semibold tracking-wide text-[#6B6B6B]">
              Custom Scenarios
            </span>
          </div>

          <h2 className="text-sm sm:text-base font-semibold text-[#212121] mt-3 group-hover:text-[#FF6C37] transition-colors">
            Testing with Input Cases
          </h2>
          <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed mt-1">
            Upload or write your own custom test cases. AI executes scenarios step-by-step and records assertions.
          </p>
        </div>

        <div className="pt-3">
          <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#FF6C37] group-hover:text-[#E8590C] transition-colors">
            <span>Upload cases</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ActionCards;
