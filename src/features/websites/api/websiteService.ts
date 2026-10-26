import { axiosClient } from "@/lib/api/axios";
import { API_CONFIG } from "@/lib/api/config";
import { WEBSITE_ENDPOINTS } from "./endpoints";
import { mockStore } from "@/lib/mock/store";
import { ResponseEnvelope } from "@/types/api";
import {
  WebsiteResponse,
  WebsiteCreateRequest,
  WebsiteVerificationResponse,
  CredentialCreateRequest,
  CredentialResponse,
} from "@/types/website";

export async function getWebsites(): Promise<WebsiteResponse[]> {
  if (API_CONFIG.useMock) return mockStore.getWebsites();
  const res = await axiosClient.get<ResponseEnvelope<WebsiteResponse[]>>(WEBSITE_ENDPOINTS.LIST);
  return res.data.data;
}

export async function getWebsite(id: string): Promise<WebsiteResponse> {
  if (API_CONFIG.useMock) {
    const site = await mockStore.getWebsite(id);
    if (!site) throw new Error("Website not found");
    return site;
  }
  const res = await axiosClient.get<ResponseEnvelope<WebsiteResponse>>(WEBSITE_ENDPOINTS.DETAIL(id));
  return res.data.data;
}

export async function createWebsite(data: WebsiteCreateRequest): Promise<WebsiteResponse> {
  if (API_CONFIG.useMock) return mockStore.createWebsite(data);
  const res = await axiosClient.post<ResponseEnvelope<WebsiteResponse>>(WEBSITE_ENDPOINTS.CREATE, data);
  return res.data.data;
}

export async function verifyWebsite(id: string): Promise<WebsiteVerificationResponse> {
  if (API_CONFIG.useMock) return mockStore.verifyWebsite(id);
  const res = await axiosClient.post<ResponseEnvelope<WebsiteVerificationResponse>>(
    WEBSITE_ENDPOINTS.VERIFY(id)
  );
  return res.data.data;
}

export async function addCredential(
  id: string,
  data: CredentialCreateRequest
): Promise<CredentialResponse> {
  if (API_CONFIG.useMock) return mockStore.addCredential(id, data);
  const res = await axiosClient.post<ResponseEnvelope<CredentialResponse>>(
    WEBSITE_ENDPOINTS.CREDENTIALS(id),
    data
  );
  return res.data.data;
}
