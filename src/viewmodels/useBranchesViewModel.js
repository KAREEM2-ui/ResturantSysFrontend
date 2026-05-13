import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { branchesService } from "../services/branches.service";

export function useBranchesViewModel(page = 1) {

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["branches", page],
    queryFn: () => branchesService.getBranches({ page }),
    // Static data -> Standard caching is okay
  });



  return {
    branches: data?.data?.branches || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    isError,
    error
  };
}