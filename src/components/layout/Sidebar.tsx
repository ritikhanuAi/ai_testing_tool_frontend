"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Globe,
  CheckSquare,
  PlayCircle,
  BarChart3,
  Settings,
  HelpCircle,
  Zap,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  matchPrefix?: boolean;
}

const PRIMARY_NAV: NavItem[] = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
    matchPrefix: false,
  },
  {
    name: "Website Testing",
    href: "/websites",
    icon: Globe,
    matchPrefix: true,
  },
  {
    name: "Test Cases",
    href: "/test-packs",
    icon: CheckSquare,
    matchPrefix: true,
  },
  {
    name: "Test Runs",
    href: "/test-runs",
    icon: PlayCircle,
    matchPrefix: true,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
    matchPrefix: true,
  },
];

const SECONDARY_NAV: NavItem[] = [
  {
    name: "Settings",
    href: "/scan-profiles",
    icon: Settings,
    matchPrefix: true,
  },
  {
    name: "Help",
    href: "#help",
    icon: HelpCircle,
    matchPrefix: false,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isItemActive = (item: NavItem) => {
    if (item.href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/";
    }
    if (item.matchPrefix) {
      return pathname.startsWith(item.href);
    }
    return pathname === item.href;
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-[#E6E6E6] z-50 flex flex-col justify-between select-none">
      {/* Top Group: Logo & Main Navigation */}
      <div className="flex flex-col">
        {/* Brand Header */}
        <div className="h-14 px-4 flex items-center gap-2.5 border-b border-[#E6E6E6]">
          {/* TestPilot Logo Mark */}
          <div className="w-8 h-8 rounded-lg bg-[#FF6C37] flex items-center justify-center text-white shrink-0 shadow-xs">
            <Zap className="w-4 h-4 fill-white" />
          </div>
          <span className="font-semibold text-base tracking-tight text-[#212121]">
            TestPilot
          </span>
        </div>

        {/* Section Heading */}
        <div className="px-4 pt-4 pb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8C8C8C]">
            DASHBOARD
          </span>
        </div>

        {/* Main Nav Items */}
        <nav className="flex flex-col px-3 space-y-1">
          {PRIMARY_NAV.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "h-10 px-3 flex items-center gap-2.5 rounded-lg text-sm transition-colors duration-150",
                  active
                    ? "bg-[#FFF1EB] text-[#FF6C37] font-medium"
                    : "text-[#594139] hover:bg-[#F5F3F3] hover:text-[#212121] font-normal"
                )}
              >
                <Icon
                  className={cn(
                    "w-[18px] h-[18px] shrink-0 transition-colors",
                    active ? "text-[#FF6C37]" : "text-[#6B6B6B]"
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Group: Settings & Help */}
      <div className="border-t border-[#E6E6E6] pt-3 pb-4 px-3 flex flex-col space-y-1">
        <nav className="flex flex-col space-y-1">
          {SECONDARY_NAV.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "h-10 px-3 flex items-center gap-2.5 rounded-lg text-sm transition-colors duration-150",
                  active
                    ? "bg-[#FFF1EB] text-[#FF6C37] font-medium"
                    : "text-[#594139] hover:bg-[#F5F3F3] hover:text-[#212121] font-normal"
                )}
              >
                <Icon
                  className={cn(
                    "w-[18px] h-[18px] shrink-0 transition-colors",
                    active ? "text-[#FF6C37]" : "text-[#6B6B6B]"
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
