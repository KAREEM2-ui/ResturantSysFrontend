import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { branchInventoryService } from "../services/branchInventory.service";
import { branchesService } from "../services/branches.service";
import { selectBranchId } from "../features_State/appConfigSlice";

export const useBranchInventoryViewModel = (page = 1) => {
  const queryClient = useQueryClient();
  const selectedBranchId = useSelector(selectBranchId);

  // Fetch all branches
  const { data: branchesData = {} } = useQuery({
    queryKey: ["branches"],
    queryFn: () => branchesService.getBranches({ page: 1 }),
    staleTime: 5 * 60 * 1000,
  });

  const branches = branchesData?.data?.branches || [];

  // Fetch branch inventory for selected branch
  const { data: inventoryData , isLoading } = useQuery({
    queryKey: ["branchInventory", selectedBranchId, page],
    queryFn: () =>
      selectedBranchId
        ? branchInventoryService.getBranchInventoryByBranch(selectedBranchId, page, 10)
        : Promise.resolve({ data: [], total: 0 }),
    enabled: !!selectedBranchId,
    staleTime: 2 * 60 * 1000,
  });

  

  // Normalize branch inventory data
  const normalizeInventory = (entry) => ({
    ...entry,
    id: entry._id,
    item: entry.item?.name || "Unknown Item",
    itemId: entry.item?._id,
    // include the full joined item object so UIs can render details (ingredients, etc.)
    itemObject: entry.item || null,
    quantity: entry.currentStock ?? entry.quantity ?? 0,
    unit: entry.item?.unit || "unit",
    status:
      (entry.currentStock ?? entry.quantity ?? 0) > 10
        ? "OK"
        : (entry.currentStock ?? entry.quantity ?? 0) > 0
          ? "LOW"
          : "OUT_OF_STOCK",
    hasIngredients: Boolean(
      (entry.item && Array.isArray(entry.item.ItemIngredients) && entry.item.ItemIngredients.length > 0) ||
      (entry.item && Array.isArray(entry.item.ItemIngredientsPopulated) && entry.item.ItemIngredientsPopulated.length > 0)
    ),
  });

  return {
    branches,
    // Raw branch inventory rows (joined item present)
    rawBranchInventory: Array.isArray(inventoryData?.data?.branchInventory)
      ? inventoryData.data.branchInventory
      : [],
    branchInventory: Array.isArray(inventoryData?.data?.branchInventory)
      ? inventoryData.data.branchInventory.map(normalizeInventory)
      : [],
    totalCount: inventoryData?.total || 0,
    isLoading,
    isPending: isLoading,
  };
};
