import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { FindingSeverity, RunStatus } from "@/types/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "--";
  const totalSeconds = Math.round(seconds);
  const hrs = Math.floor(totalSeconds / 3600);
  const remainingSeconds = totalSeconds % 3600;
  const rawMins = Math.round(remainingSeconds / 60);
  const mins = totalSeconds > 0 && hrs === 0 && rawMins === 0 ? 1 : rawMins;
  const finalHrs = hrs + Math.floor(mins / 60);
  const finalMins = mins % 60;
  return `${finalHrs} hr:${finalMins} m`;
}


export function getGradeBadge(grade?: string) {
  const g = (grade || "F").toUpperCase();
  if (g.startsWith("A")) {
    return {
      grade: g,
      bg: "bg-emerald-500/15 border-emerald-500/40 text-emerald-400",
      glow: "glow-emerald",
      label: "Excellent",
    };
  }
  if (g.startsWith("B")) {
    return {
      grade: g,
      bg: "bg-blue-500/15 border-blue-500/40 text-blue-400",
      glow: "glow-indigo",
      label: "Good",
    };
  }
  if (g.startsWith("C")) {
    return {
      grade: g,
      bg: "bg-amber-500/15 border-amber-500/40 text-amber-400",
      glow: "glow-cyan",
      label: "Moderate",
    };
  }
  if (g.startsWith("D")) {
    return {
      grade: g,
      bg: "bg-orange-500/15 border-orange-500/40 text-orange-400",
      glow: "",
      label: "Poor",
    };
  }
  return {
    grade: g,
    bg: "bg-rose-500/15 border-rose-500/40 text-rose-400",
    glow: "glow-rose",
    label: "Failing",
  };
}

export function getSeverityBadge(severity: FindingSeverity | string) {
  const sev = (severity || "info").toLowerCase();
  switch (sev) {
    case "critical":
      return {
        label: "Critical",
        classes: "bg-rose-500/20 text-rose-300 border-rose-500/50",
        dot: "bg-rose-500",
      };
    case "high":
      return {
        label: "High",
        classes: "bg-orange-500/20 text-orange-300 border-orange-500/50",
        dot: "bg-orange-500",
      };
    case "medium":
      return {
        label: "Medium",
        classes: "bg-amber-500/20 text-amber-300 border-amber-500/50",
        dot: "bg-amber-500",
      };
    case "low":
      return {
        label: "Low",
        classes: "bg-blue-500/20 text-blue-300 border-blue-500/50",
        dot: "bg-blue-500",
      };
    default:
      return {
        label: "Info",
        classes: "bg-slate-500/20 text-slate-300 border-slate-500/40",
        dot: "bg-slate-400",
      };
  }
}

export function getStatusBadge(status: RunStatus | string) {
  const s = (status || "pending").toLowerCase();
  switch (s) {
    case "completed":
      return {
        label: "Completed",
        classes: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
        dot: "bg-emerald-500",
        pulse: false,
      };
    case "running":
      return {
        label: "Running",
        classes: "bg-indigo-500/20 text-indigo-300 border-indigo-500/50",
        dot: "bg-indigo-400",
        pulse: true,
      };
    case "queued":
    case "pending":
      return {
        label: s === "queued" ? "Queued" : "Pending",
        classes: "bg-amber-500/15 text-amber-300 border-amber-500/30",
        dot: "bg-amber-400",
        pulse: true,
      };
    case "cancelled":
      return {
        label: "Cancelled",
        classes: "bg-slate-500/20 text-slate-400 border-slate-500/30",
        dot: "bg-slate-400",
        pulse: false,
      };
    case "failed":
    default:
      return {
        label: "Failed",
        classes: "bg-rose-500/20 text-rose-400 border-rose-500/40",
        dot: "bg-rose-500",
        pulse: false,
      };
  }
}
