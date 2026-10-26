import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as scanProfileService from "../api/scanProfileService";
import { ScanProfileCreateRequest } from "@/types/scan-profile";

export function useScanProfiles() {
  return useQuery({
    queryKey: ["scan-profiles"],
    queryFn: scanProfileService.getScanProfiles,
  });
}

export function useScanProfile(id: string) {
  return useQuery({
    queryKey: ["scan-profile", id],
    queryFn: () => scanProfileService.getScanProfile(id),
    enabled: !!id,
  });
}

export function useCreateScanProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ScanProfileCreateRequest) => scanProfileService.createScanProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scan-profiles"] });
    },
  });
}
