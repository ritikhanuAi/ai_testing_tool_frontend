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
      bg: "bg-[#ECFDF3] border-[#12B76A]/40 text-[#027A48]",
      glow: "",
      label: "Excellent",
    };
  }
  if (g.startsWith("B")) {
    return {
      grade: g,
      bg: "bg-[#EFF8FF] border-[#0BA5EC]/40 text-[#026AA2]",
      glow: "",
      label: "Good",
    };
  }
  if (g.startsWith("C")) {
    return {
      grade: g,
      bg: "bg-[#FFFAEB] border-[#F79009]/40 text-[#B54708]",
      glow: "",
      label: "Moderate",
    };
  }
  if (g.startsWith("D")) {
    return {
      grade: g,
      bg: "bg-[#FFF4ED] border-[#FB6514]/40 text-[#B93815]",
      glow: "",
      label: "Poor",
    };
  }
  return {
    grade: g,
    bg: "bg-[#FEF3F2] border-[#F04438]/40 text-[#B42318]",
    glow: "",
    label: "Failing",
  };
}

export function getSeverityBadge(severity: FindingSeverity | string) {
  const sev = (severity || "info").toLowerCase();
  switch (sev) {
    case "critical":
      return {
        label: "Critical",
        classes: "bg-[#FEF3F2] text-[#93000A] border-[#F04438]/30",
        dot: "bg-[#F04438]",
      };
    case "high":
      return {
        label: "High",
        classes: "bg-[#FFF4ED] text-[#B93815] border-[#FB6514]/30",
        dot: "bg-[#FB6514]",
      };
    case "medium":
      return {
        label: "Medium",
        classes: "bg-[#FFFAEB] text-[#7A3E00] border-[#F79009]/30",
        dot: "bg-[#F79009]",
      };
    case "low":
      return {
        label: "Low",
        classes: "bg-[#EFF8FF] text-[#026AA2] border-[#0BA5EC]/30",
        dot: "bg-[#0BA5EC]",
      };
    default:
      return {
        label: "Info",
        classes: "bg-[#F5F3F3] text-[#594139] border-[#E6E6E6]",
        dot: "bg-[#8C8C8C]",
      };
  }
}

export function getStatusBadge(status: RunStatus | string) {
  const s = (status || "pending").toLowerCase();
  switch (s) {
    case "completed":
      return {
        label: "Completed",
        classes: "bg-[#ECFDF3] text-[#006D3C] border-[#12B76A]/30",
        dot: "bg-[#12B76A]",
        pulse: false,
      };
    case "running":
      return {
        label: "Running",
        classes: "bg-[#F0F9FF] text-[#004667] border-[#0BA5EC]/30",
        dot: "bg-[#0BA5EC]",
        pulse: true,
      };
    case "queued":
    case "pending":
      return {
        label: s === "queued" ? "Queued" : "Pending",
        classes: "bg-[#FFFAEB] text-[#7A3E00] border-[#F79009]/30",
        dot: "bg-[#F79009]",
        pulse: true,
      };
    case "cancelled":
      return {
        label: "Cancelled",
        classes: "bg-[#F5F3F3] text-[#6B6B6B] border-[#E6E6E6]",
        dot: "bg-[#8C8C8C]",
        pulse: false,
      };
    case "failed":
    default:
      return {
        label: "Failed",
        classes: "bg-[#FEF3F2] text-[#93000A] border-[#F04438]/30",
        dot: "bg-[#F04438]",
        pulse: false,
      };
  }
}
