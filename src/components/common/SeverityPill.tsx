import React from "react";
import { cn, getSeverityBadge } from "@/lib/utils";
import { FindingSeverity } from "@/types/api";

interface SeverityPillProps {
  severity: FindingSeverity | string;
  size?: "sm" | "md";
  className?: string;
}

export function SeverityPill({ severity, size = "md", className }: SeverityPillProps) {
  const badge = getSeverityBadge(severity);

  const sizeStyles = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-full border uppercase tracking-wider select-none",
        badge.classes,
        sizeStyles[size],
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", badge.dot)} />
      {badge.label}
    </span>
  );
}
