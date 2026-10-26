import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({
  className,
  hoverable = false,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-[#E6E6E6] rounded-xl p-5 text-[#212121] shadow-xs transition-all duration-150",
        hoverable && "hover:border-[#D4D4D4] hover:shadow-xs",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  title,
  subtitle,
  action,
}: {
  className?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("flex items-start justify-between mb-4 pb-3 border-b border-[#E6E6E6]", className)}>
      <div>
        <h3 className="text-base font-semibold text-[#212121] tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-[#6B6B6B] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export default Card;
