import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryService } from "../services/inventory.service";

export function useInventoryViewModel(page = 1) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["inventory", page],
    queryFn: () => inventoryService.getInventoryItems({ page }),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always", // Critical resource
  });

  const createMutation = useMutation({
    mutationFn: inventoryService.createInventoryItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => inventoryService.updateInventoryItem(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["inventory"] }),
  });

  const saveInventoryItem = async (itemId, payload) => {
    if (itemId) {
      return updateMutation.mutateAsync({ id: itemId, payload });
    }

    return createMutation.mutateAsync(payload);
  };

  return {
    inventoryItems: data?.data?.inventoryItems || data?.data || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    isError,
    error,
    saveInventoryItem,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
}