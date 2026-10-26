import React, { Suspense } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Taskbar } from "@/components/layout/Taskbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-[#FBF9F8] text-[#212121]">
      {/* Fixed Left Sidebar (240px / w-60) */}
      <Sidebar />

      {/* Main View Area Offset by Sidebar (pl-60) */}
      <div className="pl-60 min-h-screen flex flex-col bg-[#FBF9F8]">
        {/* Fixed Top Taskbar (h-14) */}
        <Taskbar />

        {/* Scrollable Main Content Canvas Offset by Header (pt-14) */}
        <main className="relative pt-14 flex-1 w-full bg-[#FBF9F8]">
          <div className="max-w-6xl mx-auto px-5 py-4 md:px-8 md:py-5">
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-7 h-7 rounded-full border-2 border-[#E6E6E6] border-t-[#FF6C37] animate-spin" />
                    <span className="text-xs text-[#8C8C8C] font-medium">Loading view...</span>
                  </div>
                </div>
              }
            >
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}