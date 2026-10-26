import React from "react";
import { cn, getGradeBadge } from "@/lib/utils";

interface GradeBadgeProps {
  grade?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  className?: string;
}

export function GradeBadge({ grade = "F", size = "md", showLabel = false, className }: GradeBadgeProps) {
  const info = getGradeBadge(grade);

  const sizeStyles = {
    sm: "text-xs px-2 py-0.5 font-bold",
    md: "text-sm px-2.5 py-1 font-bold",
    lg: "text-xl px-4 py-2 font-black tracking-tight",
    xl: "text-4xl px-6 py-3 font-black tracking-tight",
  };

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "rounded-xl border shadow-inner flex items-center justify-center select-none",
          info.bg,
          info.glow,
          sizeStyles[size]
        )}
      >
        {info.grade}
      </span>
      {showLabel && (
        <span className="text-xs font-medium text-slate-400 capitalize">{info.label} Quality</span>
      )}
    </div>
  );
}
