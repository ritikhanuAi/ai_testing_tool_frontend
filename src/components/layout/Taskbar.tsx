"use client";

import React, { useState } from "react";
import { Search, Play } from "lucide-react";
import { QuickScanModal } from "@/components/dashboard/QuickScanModal";

interface TaskbarProps {
  environment?: string;
  environmentStatus?: "Stable" | "Degraded" | "Maintenance";
  onSearch?: (query: string) => void;
  onNewRun?: () => void;
}

export function Taskbar({
  environment = "Production (v2.4.0)",
  environmentStatus = "Stable",
  onSearch,
  onNewRun,
}: TaskbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleLaunchClick = () => {
    if (onNewRun) {
      onNewRun();
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-60 right-0 h-14 bg-white/95 backdrop-blur-md border-b border-[#E6E6E6] z-40 flex items-center justify-between px-6 transition-colors">
        {/* Left: Test Environment Telemetry Badge */}
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-[#594139] font-medium tracking-tight">
            Test Environment: <span className="text-[#212121] font-semibold">{environment}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-[#ECFDF3] text-[#006D3C] border border-[#006D3C]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#12B76A]" />
            {environmentStatus}
          </span>
        </div>

        {/* Right: Quick Search and New Run Action */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-2.5 text-[#8C8C8C] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search tests, runs, suites..."
              className="h-8 w-60 pl-8 pr-3 rounded-lg bg-[#F5F3F3] border border-[#E6E6E6] text-xs text-[#212121] placeholder-[#8C8C8C] transition-all duration-150 focus:outline-none focus:border-[#FF6C37] focus:bg-white focus:ring-2 focus:ring-[#FFF1EB]"
            />
          </div>

          <button
            type="button"
            onClick={handleLaunchClick}
            className="h-8 px-3 rounded-lg bg-[#FF6C37] hover:bg-[#E8590C] active:bg-[#D9480F] text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer select-none"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>New Run</span>
          </button>
        </div>
      </header>

      {/* Quick Launch Modal if triggered */}
      <QuickScanModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default Taskbar;
