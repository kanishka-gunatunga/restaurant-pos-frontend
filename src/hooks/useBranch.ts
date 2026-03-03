import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as branchService from "@/services/branchService";
import { CreateBranchData } from "@/types/branch";

export const BRANCH_KEYS = {
  all: ["branches"] as const,
  lists: () => [...BRANCH_KEYS.all, "list"] as const,
};

export const useGetBranches = () => {
  return useQuery({
    queryKey: BRANCH_KEYS.lists(),
    queryFn: () => branchService.getBranches(),
    staleTime: 1 * 60 * 1000,
  });
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBranchData) => branchService.createBranch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BRANCH_KEYS.all });
    },
  });
};
