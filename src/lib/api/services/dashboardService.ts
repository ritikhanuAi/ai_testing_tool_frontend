import { axiosClient } from "../axios";
import { API_CONFIG } from "../config";
import { DASHBOARD_ENDPOINTS } from "../endpoints";
import { mockStore } from "@/lib/mock/store";
import { ResponseEnvelope } from "@/types/api";
import { DashboardSummaryResponse, RecentActivityItem } from "@/types/dashboard";

export async function getDashboardSummary(): Promise<DashboardSummaryResponse> {
  if (API_CONFIG.useMock) return mockStore.getDashboardSummary();
  const res = await axiosClient.get<ResponseEnvelope<DashboardSummaryResponse>>(
    DASHBOARD_ENDPOINTS.SUMMARY
  );
  return res.data.data;
}

export async function getRecentActivity(): Promise<RecentActivityItem[]> {
  if (API_CONFIG.useMock) return mockStore.getRecentActivity();
  const res = await axiosClient.get<ResponseEnvelope<RecentActivityItem[]>>(
    DASHBOARD_ENDPOINTS.RECENT_ACTIVITY
  );
  return res.data.data;
}
