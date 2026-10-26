import { axiosClient } from "../axios";
import { API_CONFIG } from "../config";
import { TEST_PACK_ENDPOINTS } from "../endpoints";
import { mockStore } from "@/lib/mock/store";
import { ResponseEnvelope } from "@/types/api";
import {
  TestPackResponse,
  TestPackCreateRequest,
  TestPackValidationResponse,
} from "@/types/test-pack";

export async function getTestPacks(): Promise<TestPackResponse[]> {
  if (API_CONFIG.useMock) return mockStore.getTestPacks();
  const res = await axiosClient.get<ResponseEnvelope<TestPackResponse[]>>(TEST_PACK_ENDPOINTS.LIST);
  return res.data.data;
}

export async function getTestPack(id: string): Promise<TestPackResponse> {
  if (API_CONFIG.useMock) {
    const pack = await mockStore.getTestPack(id);
    if (!pack) throw new Error("Test pack not found");
    return pack;
  }
  const res = await axiosClient.get<ResponseEnvelope<TestPackResponse>>(
    TEST_PACK_ENDPOINTS.DETAIL(id)
  );
  return res.data.data;
}

export async function createTestPack(data: TestPackCreateRequest): Promise<TestPackResponse> {
  if (API_CONFIG.useMock) return mockStore.createTestPack(data);
  const res = await axiosClient.post<ResponseEnvelope<TestPackResponse>>(
    TEST_PACK_ENDPOINTS.CREATE,
    data
  );
  return res.data.data;
}

export async function validateTestPack(rawYaml: string): Promise<TestPackValidationResponse> {
  if (API_CONFIG.useMock) return mockStore.validateRawYaml(rawYaml);
  const res = await axiosClient.post<ResponseEnvelope<TestPackValidationResponse>>(
    TEST_PACK_ENDPOINTS.VALIDATE,
    { raw_yaml: rawYaml }
  );
  return res.data.data;
}
