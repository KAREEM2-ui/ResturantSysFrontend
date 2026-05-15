import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { inventoryService } from "../services/inventory.service";
import { productsService } from "../services/products.service";
import { useBranchesViewModel } from "./useBranchesViewModel";
import { useDispatch, useSelector } from "react-redux";
import { selectBranchId, setSelectedBranchId } from "../features_State/appConfigSlice";

function toProductVM(product) {
  const ingredients = Array.isArray(product?.ingredients) ? product.ingredients : [];
  const hasItem = Boolean(product?.item);

  return {
    ...product,
    id: product?._id,
    price: Number(product?.price) || 0,
    status: product?.status || "Active",
    ingredients,
    ingredientsSummary: ingredients.length
      ? `${ingredients.length} ingredients`
      : hasItem
        ? "Single item"
        : "0 ingredients",
  };
}

export function useProductsViewModel(page = 1) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const selectedBranchId = useSelector(selectBranchId);
  const {
    branches,
    isLoading: isLoadingBranches,
    isError: isBranchesError,
    error: branchesError,
  } = useBranchesViewModel(1);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", page],
    queryFn: () => productsService.getProducts({ page }),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: "always",
  });

  const {
    data: branchProductsData,
    isLoading: isLoadingBranchProducts,
    isError: isBranchProductsError,
    error: branchProductsError,
  } = useQuery({
    queryKey: ["products", "branch", selectedBranchId],
    queryFn: () => productsService.getBranchProducts({ branchId: selectedBranchId }),
    enabled: Boolean(selectedBranchId),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: "always",
  });

  const {
    data: inventoryData,
    isLoading: isLoadingInventory,
  } = useQuery({
    queryKey: ["inventory-items", 1, 100],
    queryFn: () => inventoryService.getInventoryItems({ page: 1, limit: 100 }),
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: productsService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: productsService.updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });


  const products = useMemo(() => {
    const raw = data?.data?.products || [];
    return raw.map(toProductVM);
  }, [data]);

  const branchProducts = useMemo(() => {
    const raw = branchProductsData?.data?.products || [];
    return raw.map(toProductVM);
  }, [branchProductsData]);

  const inventoryItems = useMemo(() => {
    return inventoryData?.data?.inventoryItems || [];
  }, [inventoryData]);

  return {
    products,
    branchProducts,
    totalCount: data?.totalCount || 0,
    selectedBranchId,
    setSelectedBranchId: (value) => dispatch(setSelectedBranchId(value)),
    branches,
    inventoryItems,
    isLoading: isLoading || isLoadingBranches,
    isLoadingBranchProducts,
    isLoadingInventory,
    isError: isError || isBranchesError || isBranchProductsError,
    error: error || branchesError || branchProductsError,

    createProduct: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateProduct: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    
  };
}
