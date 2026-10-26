import { axiosClient } from "@/lib/api/axios";
import { API_CONFIG } from "@/lib/api/config";
import { SCAN_PROFILE_ENDPOINTS } from "./endpoints";
import { mockStore } from "@/lib/mock/store";
import { ResponseEnvelope } from "@/types/api";
import { ScanProfileResponse, ScanProfileCreateRequest } from "@/types/scan-profile";

export async function getScanProfiles(): Promise<ScanProfileResponse[]> {
  if (API_CONFIG.useMock) return mockStore.getScanProfiles();
  const res = await axiosClient.get<ResponseEnvelope<ScanProfileResponse[]>>(
    SCAN_PROFILE_ENDPOINTS.LIST
  );
  return res.data.data;
}

export async function getScanProfile(id: string): Promise<ScanProfileResponse> {
  if (API_CONFIG.useMock) {
    const profile = await mockStore.getScanProfile(id);
    if (!profile) throw new Error("Scan profile not found");
    return profile;
  }
  const res = await axiosClient.get<ResponseEnvelope<ScanProfileResponse>>(
    SCAN_PROFILE_ENDPOINTS.DETAIL(id)
  );
  return res.data.data;
}

export async function createScanProfile(
  data: ScanProfileCreateRequest
): Promise<ScanProfileResponse> {
  if (API_CONFIG.useMock) return mockStore.createScanProfile(data);
  const res = await axiosClient.post<ResponseEnvelope<ScanProfileResponse>>(
    SCAN_PROFILE_ENDPOINTS.CREATE,
    data
  );
  return res.data.data;
}
