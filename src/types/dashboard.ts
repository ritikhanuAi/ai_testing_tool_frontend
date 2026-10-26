export interface DashboardSummaryResponse {
  total_websites: number;
  total_runs: number;
  average_score: number;
  runs_by_status: Record<string, number>;
  pass_rate_percentage: number;
}

export interface RecentActivityItem {
  run_id: string;
  website_id: string;
  website_name: string;
  target_url: string;
  status: string;
  score?: number;
  started_at: string;
  finished_at?: string;
}
