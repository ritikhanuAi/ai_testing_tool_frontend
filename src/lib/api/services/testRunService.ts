import { axiosClient } from "../axios";
import { API_CONFIG } from "../config";
import { TEST_RUN_ENDPOINTS } from "../endpoints";
import { mockStore } from "@/lib/mock/store";
import { ResponseEnvelope } from "@/types/api";
import { TestRunResponse, TriggerScanRequest } from "@/types/test-run";

export async function getTestRuns(): Promise<TestRunResponse[]> {
  if (API_CONFIG.useMock) return mockStore.getTestRuns();
  const res = await axiosClient.get<ResponseEnvelope<TestRunResponse[]>>(TEST_RUN_ENDPOINTS.LIST);
  return res.data.data;
}

export async function getTestRun(id: string): Promise<TestRunResponse> {
  if (API_CONFIG.useMock) {
    const run = await mockStore.getTestRun(id);
    if (!run) throw new Error("Test run not found");
    return run;
  }
  const res = await axiosClient.get<ResponseEnvelope<TestRunResponse>>(
    TEST_RUN_ENDPOINTS.DETAIL(id)
  );
  return res.data.data;
}

export async function triggerScan(payload: TriggerScanRequest): Promise<TestRunResponse> {
  if (API_CONFIG.useMock) return mockStore.triggerScan(payload);
  const res = await axiosClient.post<ResponseEnvelope<TestRunResponse>>(
    TEST_RUN_ENDPOINTS.TRIGGER,
    payload
  );
  return res.data.data;
}

export async function cancelScan(id: string): Promise<TestRunResponse> {
  if (API_CONFIG.useMock) return mockStore.cancelScan(id);
  const res = await axiosClient.post<ResponseEnvelope<TestRunResponse>>(
    TEST_RUN_ENDPOINTS.CANCEL(id)
  );
  return res.data.data;
}
