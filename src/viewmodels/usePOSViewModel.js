import { useQuery } from "@tanstack/react-query";
import {
  createNewWindow,
  setActiveWindow,
  closeWindow,
  addItem,
  removeItem,
  addCoupon,
  removeCoupon,
  saveOrder,
  setOrderType
} from '../features_State/posSlice';
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import {inventoryService} from "../services/inventory.service";
import { selectBranchId, setSelectedBranchId } from "../features_State/appConfigSlice";

export function usePOSViewModel() {
  const dispatch = useDispatch();
  const windows = useSelector((state) => state.pos.windows);
  const activeWindowId = useSelector((state) => state.pos.activeWindowId);
  const authUser = useSelector((state) => state.auth.user);
  const branchId = useSelector(selectBranchId);


  // Initialize first window if none exist
  useEffect(() => {
    if (windows.length === 0) {
      dispatch(createNewWindow());
    }
  }, []);

  const activeWindow = windows.find(w => w.id === activeWindowId) || { items: [], coupon: null,orderType: "dine_in" };

  // 2. Fetch Products
  const {
    data: productsResp,
    isLoading: isLoadingProducts,
    isError: isProductsError,
    error: productsError,
  } = useQuery({
    queryKey: ["products", branchId],  // Add branchId to key
    queryFn: () => inventoryService.getBranchProducts(branchId),  // Use new method
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    enabled: branchId !== null, // Only fetch if branchId is available
  });

  // UI Actions
  const createNewWindowHandler = useCallback(() => {
    dispatch(createNewWindow());
  }, [dispatch]);

  const setActiveWindowHandler = useCallback((id) => {
    dispatch(setActiveWindow(id));
  }, [dispatch]);

  const closeWindowHandler = useCallback((e, id) => {
    e.stopPropagation();
    dispatch(closeWindow(id));
  }, [dispatch]);

  // Order Actions mapped to activeWindowId
  const handleAddToBill = useCallback((item) => {
    if (activeWindowId) {
      // Find if item already exists to increase qty (optional, for now just simple add)
      dispatch(addItem({ windowId: activeWindowId, item: { ...item, qty: 1 } }));
    }
  }, [dispatch, activeWindowId]);

  const removeFromBill = useCallback((itemIndex) => {
    if (activeWindowId) {
      dispatch(removeItem({ windowId: activeWindowId, itemIndex }));
    }
  }, [dispatch, activeWindowId]);

  const applyCouponHandler = useCallback((coupon) => {
    if (activeWindowId) {
      dispatch(addCoupon({ windowId: activeWindowId, coupon }));
    }
  }, [dispatch, activeWindowId]);

  const removeCouponHandler = useCallback(() => {
    if (activeWindowId) {
      dispatch(removeCoupon({ windowId: activeWindowId }));
    }
  }, [dispatch, activeWindowId]);

  const setOrderTypeHandler = useCallback((orderType) => {
    if (activeWindowId) {
      dispatch(setOrderType({ windowId: activeWindowId, orderType }));
    }
  }, [dispatch, activeWindowId]);

  const handlePlaceOrder = useCallback(async () => {
    if (activeWindowId && activeWindow.items.length > 0) {
      
      const resolvedBranchId = branchId || authUser?.branchId; // Use selected branch or fall back to user's branch
      const createdBy = authUser?._id || authUser?.id;

      const orderData = {
        branchId: resolvedBranchId,
        channel: activeWindow.orderType || "dine_in",
        createdBy,
        items: activeWindow.items.map(item => ({
             productId: item._id, 
             name: item.name,
             qty: item.qty || 1,
             unitPrice: item.price
        })),
        payment: {
          status: "paid"
        }
      };
      await dispatch(saveOrder({ windowId: activeWindowId, orderData }));
    }
  }, [dispatch, activeWindowId, activeWindow, authUser, branchId]);



  const getItemQuantityInBill = useCallback((itemId) => {
    const itemInBill = activeWindow.items.find(i => i._id === itemId);
    return itemInBill ? itemInBill.qty || 1 : 0;
  }, [activeWindow.items]);
  
  return {
    // Data
    productsResp,
    isLoadingProducts,
    isProductsError,
    productsError,

    // POS Window State
    windows,
    activeWindowId,
    activeWindow,
    
    // Window Actions
    createNewWindowHandler,
    setActiveWindowHandler,
    closeWindowHandler,
    setOrderTypeHandler,

    // Actions
    handleAddToBill,
    removeFromBill,
    applyCoupon: applyCouponHandler,
    removeCouponHandler,
    handlePlaceOrder,
    setBranchId: (value) => dispatch(setSelectedBranchId(value)),
    branchId,
    getItemQuantityInBill
  };
}

