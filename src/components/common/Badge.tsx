import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "success" | "warning" | "error" | "info" | "indigo" | "cyan" | "emerald" | "amber" | "rose" | "slate";
  size?: "sm" | "md";
  dot?: boolean;
}

export function Badge({
  className,
  variant = "default",
  size = "sm",
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const variantStyles: Record<string, string> = {
    default: "bg-[#F5F3F3] text-[#594139] border-[#E6E6E6]",
    primary: "bg-[#FFF1EB] text-[#FF6C37] border-[#FF6C37]/30",
    success: "bg-[#ECFDF3] text-[#006D3C] border-[#006D3C]/20",
    emerald: "bg-[#ECFDF3] text-[#006D3C] border-[#006D3C]/20",
    warning: "bg-[#FFFAEB] text-[#7A3E00] border-[#F79009]/20",
    amber: "bg-[#FFFAEB] text-[#7A3E00] border-[#F79009]/20",
    error: "bg-[#FEF3F2] text-[#93000A] border-[#BA1A1A]/20",
    rose: "bg-[#FEF3F2] text-[#93000A] border-[#BA1A1A]/20",
    info: "bg-[#F0F9FF] text-[#004667] border-[#006492]/20",
    cyan: "bg-[#F0F9FF] text-[#004667] border-[#006492]/20",
    indigo: "bg-[#FFF1EB] text-[#FF6C37] border-[#FF6C37]/30",
    slate: "bg-[#F5F3F3] text-[#6B6B6B] border-[#E6E6E6]",
  };

  const dotColors: Record<string, string> = {
    default: "bg-[#8C8C8C]",
    primary: "bg-[#FF6C37]",
    success: "bg-[#12B76A]",
    emerald: "bg-[#12B76A]",
    warning: "bg-[#F79009]",
    amber: "bg-[#F79009]",
    error: "bg-[#F04438]",
    rose: "bg-[#F04438]",
    info: "bg-[#0BA5EC]",
    cyan: "bg-[#0BA5EC]",
    indigo: "bg-[#FF6C37]",
    slate: "bg-[#8C8C8C]",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-full border tracking-wide uppercase",
        variantStyles[variant] || variantStyles.default,
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant] || dotColors.default)} />}
      {children}
    </span>
  );
}

export default Badge;
