import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { purchaseOrdersService } from "../services/purchaseOrders.service";

export function usePurchaseOrdersViewModel(page = 1) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["purchaseOrders", page],
    queryFn: () => purchaseOrdersService.getPurchaseOrders({ page }),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always", // Dynamic data
  });

  const createMutation = useMutation({
    mutationFn: purchaseOrdersService.createPurchaseOrder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["purchaseOrders"] }),
  });

  return {
    purchaseOrders: data?.data?.purchaseOrders || data?.data || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    isError,
    error,
    createPurchaseOrder: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
}