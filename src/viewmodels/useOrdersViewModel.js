import { useQuery } from "@tanstack/react-query";
import { useMemo,useState } from "react";
import { ordersService } from "../services/orders.service";
import { useBranchesViewModel } from "./useBranchesViewModel";
import { useSelector } from "react-redux";

export function useOrdersViewModel(page = 1) {
  const {
    branches,
    isLoading: isLoadingBranches,
    isError: isBranchesError,
    error: branchesError,
  } = useBranchesViewModel(1);

  const user = useSelector((state) => state.auth.user);
  const [BranchIdRequired, setBranchIdRequired] = useState(user?.branchId || null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["orders", BranchIdRequired, page],
    queryFn: () => ordersService.getBranchOrders({ branchId: BranchIdRequired, page }),
    staleTime: 0,
    gcTime: 0,
    enabled: BranchIdRequired !== null, // Only fetch if branchId is available
    refetchOnMount: "always",
  });


  const orders = useMemo(() => {
    const rawOrders = data?.data?.orders || [];
    const branchNameById = new Map(
      (branches || []).map((branch) => [String(branch._id), branch.name || "Unknown Branch"])
    );

    return rawOrders.map((order) => {
      const items = Array.isArray(order.items) ? order.items : [];
      const itemsSummary = items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
      const totalValue = items.reduce(
        (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.unitPrice) || 0),
        0
      );

      return {
        ...order,
        id: order._id,
        branch: branchNameById.get(String(order.branchId)) || String(order.branchId || "Unknown Branch"),
        itemsSummary,
        total: `$${totalValue.toFixed(2)}`,
      };
    });
  }, [data?.data?.orders, branches]);

  return {
    orders,
    totalCount: data?.totalCount || 0,
    isLoading: isLoading || isLoadingBranches,
    isError: isError || isBranchesError,
    error: error || branchesError,
    branchId: BranchIdRequired,
    setBranchId: setBranchIdRequired
  };
}