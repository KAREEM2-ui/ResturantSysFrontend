import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo,useState } from "react";
import { ordersService } from "../services/orders.service";
import { useBranchesViewModel } from "./useBranchesViewModel";
import { useDispatch, useSelector } from "react-redux";
import { selectBranchId, setSelectedBranchId } from "../features_State/appConfigSlice";
import { set } from "date-fns";

export function useOrdersViewModel(page = 1) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const {
    branches,
    isLoading: isLoadingBranches,
    isError: isBranchesError,
    error: branchesError,
  } = useBranchesViewModel(1);


  const BranchIdRequired = useSelector(selectBranchId);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["orders", BranchIdRequired, page],
    queryFn: () => ordersService.getBranchOrders({ branchId: BranchIdRequired, page }),
    staleTime: 0,
    gcTime: 0,
    enabled: BranchIdRequired !== null, // Only fetch if branchId is available
    refetchOnMount: "always",
  });

  const branchesByName = useMemo(() => {
    return new Map(
      (branches || []).map((branch) => [String(branch._id), branch.name || "Unknown Branch"])
    );
  },[branches]);

  

  const orders = useMemo(() => {
    const rawOrders = data?.data?.orders || [];
    const branchNameById = branchesByName;  

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
  }, [data?.data?.orders, branchesByName]);



   const [ordersTimers, setOrdersTimers] = useState({});

  // counter for  the time difference 
  useEffect(()=>{
    if(orders.length === 0 || !BranchIdRequired) return;

    function updateTimers() {

      const updatedTimers = [];
      
      

        orders.filter((order) => order.status === "pending").map((order) => {

        const from = new Date(order.createdAt).getTime();
        const now = Date.now()

        const diff = Math.ceil((now - from)/1000); // in minutes

        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;

        const formatted = 
          String(hours).padStart(2, "0") + ":" +
          String(minutes).padStart(2, "0") + ":" +
          String(seconds).padStart(2, "0");

      
        updatedTimers[order.id] = formatted;
      
      });


      setOrdersTimers(updatedTimers);

    } 


    updateTimers(); 
    const timer = setInterval(updateTimers, 1000); // Update every minute


  return ()=> {
    clearInterval(timer);
  }
    
  },[orders]);


  const ordersWithTimers = useMemo(() => {
    return orders.map((order) => ({
      ...order,
      time: ordersTimers[order.id] !== undefined ? ordersTimers[order.id] : order.createdAt,
    }));
  }, [ordersTimers, orders]);

  const updateOrderStatusMutation = useMutation({
    mutationFn: ordersService.updateOrderStatus,
    onSuccess: (updatedOrder) => {
      queryClient.setQueriesData({ queryKey: ["orders"] }, (old) => {
        if (!old?.data?.orders) return old;

        return {
          ...old,
          data: {
            ...old.data,
            orders: old.data.orders.map((order) =>
              String(order._id ?? order.id) === String(updatedOrder._id ?? updatedOrder.id)
                ? { ...order, ...updatedOrder }
                : order
            ),
          },
        };
      });


      setOrdersTimers((prev) => {

        const newState = { ...prev }
        delete newState[updatedOrder.id];
        return {
          ...newState
        }

      });

    },
  });



  return {
    orders: ordersWithTimers,
    totalCount: data?.totalCount || 0,
    isLoading: isLoading || isLoadingBranches,
    isError: isError || isBranchesError,
    error: error || branchesError,
    branchId: BranchIdRequired,
    setBranchId: (value) => dispatch(setSelectedBranchId(value)),
    updateOrderStatus: updateOrderStatusMutation.mutateAsync,
    isUpdatingOrderStatus: updateOrderStatusMutation.isPending,
  };

}