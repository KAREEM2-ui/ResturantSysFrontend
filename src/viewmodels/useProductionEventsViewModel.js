import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productionEventsService } from "../services/productionEvents.service";

export const useProductionEventsViewModel = (page = 1, branches = []) => {
  const queryClient = useQueryClient();
  const branchNameById = useMemo(() => {
    return new Map(
      (Array.isArray(branches) ? branches : []).map((branch) => [String(branch?._id), branch?.name || "Unknown Branch"])
    );
  }, [branches]);

  const formatStatus = (status) => {
    if (status === "completed") return "Completed";
    if (status === "cancelled") return "Cancelled";
    return "In Progress";
  };

  // Fetch production events
  const { data: eventsData = { data: { productionEvents: [] }, totalCount: 0 }, isLoading } = useQuery({
    queryKey: ["productionEvents", page],
    queryFn: () => productionEventsService.getProductionEvents(page),
    staleTime: 2 * 60 * 1000,
  });

  // Delete mutation
  const { mutate: deleteEvent, isPending: isDeleting } = useMutation({
    mutationFn: (id) => productionEventsService.deleteProductionEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productionEvents"],
      });
    },
  });

  // Normalize production event data
  const normalizeEvent = (event) => ({
    id: event._id,
    producedItem: event.producedItemId?.name || event.producedItem?.name || event.producedItem || "Unknown",
    quantity: event.quantity ?? event.quantityProduced ?? 0,
    unit: event.unit || "unit",
    status: formatStatus(event.status),
    cost: event.totalCost || 0,
    date: event.productionDate
      ? new Date(event.productionDate).toLocaleDateString()
      : new Date(event.createdAt).toLocaleDateString(),
    branchId: typeof event.branchId === "object" ? event.branchId?._id || null : event.branchId || null,
    branch: branchNameById.get(String(typeof event.branchId === "object" ? event.branchId?._id || "" : event.branchId || ""))
      || event.branchId?.name
      || "Unknown Branch",
    ingredients: event.ingredients || [],
    userId: event.userId,
    producedItemId: typeof event.producedItemId === "object" ? event.producedItemId?._id || null : event.producedItemId || null,
  });

  return {
    productionEvents: Array.isArray(eventsData?.data?.productionEvents)
      ? eventsData.data.productionEvents.map(normalizeEvent)
      : [],
    totalCount: eventsData?.totalCount || 0,
    isLoading,
    deleteEvent,
    isPending: isDeleting,
  };
};
