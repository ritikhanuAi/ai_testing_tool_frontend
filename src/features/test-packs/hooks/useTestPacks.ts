import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as testPackService from "../api/testPackService";
import { TestPackCreateRequest } from "@/types/test-pack";

export function useTestPacks() {
  return useQuery({
    queryKey: ["test-packs"],
    queryFn: testPackService.getTestPacks,
  });
}

export function useTestPack(id: string) {
  return useQuery({
    queryKey: ["test-pack", id],
    queryFn: () => testPackService.getTestPack(id),
    enabled: !!id,
  });
}

export function useCreateTestPack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TestPackCreateRequest) => testPackService.createTestPack(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["test-packs"] });
    },
  });
}

export function useValidateTestPack() {
  return useMutation({
    mutationFn: (rawYaml: string) => testPackService.validateTestPack(rawYaml),
  });
}
