import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesService } from "../services/roles.service";

export function useRolesViewModel(page = 1) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["roles", page],
    queryFn: () => rolesService.getRoles({ page }),
  });

  const createMutation = useMutation({
    mutationFn: rolesService.createRole,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles"] }),
  });

  return {
    roles: data?.data?.roles || data?.data || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    isError,
    error,
    createRole: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
}