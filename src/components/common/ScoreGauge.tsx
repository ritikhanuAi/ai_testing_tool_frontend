import React from "react";
import { cn } from "@/lib/utils";

interface ScoreGaugeProps {
  score: number; // 0 to 100
  size?: number; // width & height in px
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export function ScoreGauge({
  score,
  size = 130,
  strokeWidth = 10,
  label = "Overall Score",
  className,
}: ScoreGaugeProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 90) return "#10b981"; // emerald
    if (s >= 80) return "#3b82f6"; // blue
    if (s >= 70) return "#f59e0b"; // amber
    if (s >= 60) return "#f97316"; // orange
    return "#ef4444"; // red
  };

  const color = getColor(clampedScore);

  return (
    <div className={cn("flex flex-col items-center justify-center relative", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            transition: "stroke-dashoffset 0.8s ease-out, stroke 0.4s ease",
          }}
        />
      </svg>
      {/* Centered Score Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-extrabold text-slate-100 tracking-tight">
          {clampedScore.toFixed(1)}
        </span>
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">/ 100</span>
      </div>
      {label && <p className="text-xs text-slate-400 mt-2 font-medium">{label}</p>}
    </div>
  );
}
