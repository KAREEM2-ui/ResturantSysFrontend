import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersService } from "../services/users.service";

export function useUsersViewModel(page = 1) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", page],
    queryFn: () => usersService.getUsers({ page }),
  });

  const createMutation = useMutation({
    mutationFn: usersService.createUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  return {
    users: data?.data?.users || data?.data || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    isError,
    error,
    createUser: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
}