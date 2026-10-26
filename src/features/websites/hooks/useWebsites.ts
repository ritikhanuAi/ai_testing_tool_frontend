import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as websiteService from "../api/websiteService";
import { WebsiteCreateRequest, CredentialCreateRequest } from "@/types/website";

export function useWebsites() {
  return useQuery({
    queryKey: ["websites"],
    queryFn: websiteService.getWebsites,
  });
}

export function useWebsite(id: string) {
  return useQuery({
    queryKey: ["website", id],
    queryFn: () => websiteService.getWebsite(id),
    enabled: !!id,
  });
}

export function useCreateWebsite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WebsiteCreateRequest) => websiteService.createWebsite(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websites"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
  });
}

export function useVerifyWebsite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => websiteService.verifyWebsite(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["websites"] });
      queryClient.invalidateQueries({ queryKey: ["website", id] });
    },
  });
}

export function useAddCredential() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ websiteId, data }: { websiteId: string; data: CredentialCreateRequest }) =>
      websiteService.addCredential(websiteId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["website", variables.websiteId] });
    },
  });
}
