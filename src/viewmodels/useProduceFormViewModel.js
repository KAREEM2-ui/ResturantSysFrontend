import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { branchInventoryService } from "../services/branchInventory.service";
import { productionEventsService } from "../services/productionEvents.service";
import { selectBranchId } from "../features_State/appConfigSlice";

const statusMap = {
  "In Progress": "in_progress",
  Completed: "completed",
  Cancelled: "cancelled",
};

const statusLabelMap = {
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

function getIngredientKey(ingredient) {
  return ingredient?.ingredientId?._id || ingredient?.ingredientId || ingredient?._id || "";
}

function getIngredientName(ingredient) {
  return ingredient?.name || ingredient?.ingredientId?.name || "Ingredient";
}

function getIngredientUnit(ingredient) {
  return ingredient?.unit || ingredient?.ingredientId?.unit || "unit";
}

export const useProduceFormViewModel = (event, branchId, createdBy, onSaved) => {
  const selectedBranchId = useSelector(selectBranchId);
  const activeBranchId = branchId || selectedBranchId;
  // Local form state
  const [formData, setFormData] = useState({
    producedItem: event?.producedItem || "",
    quantityProduced: event?.quantity || 0,
    unit: event?.unit || "kg",
    status: statusLabelMap[event?.status] || event?.status || "In Progress",
    productionDate: event?.date
      ? new Date(event.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    notes: event?.notes || "",
  });

  const [selectedItemData, setSelectedItemData] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [editedEventId, setEditedEventId] = useState(event?.id || event?._id || null);
  const [ingredientQuantities, setIngredientQuantities] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loadingItemDetails, setLoadingItemDetails] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync: saveEvent, isPending: isSaving } = useMutation({
    mutationFn: (payload) => {
      if (editedEventId) {
        return productionEventsService.updateProductionEvent({ id: editedEventId, ...payload });
      }

      return productionEventsService.createProductionEvent(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["productionEvents"] });
      await queryClient.invalidateQueries({ queryKey: ["branchInventory", activeBranchId] });
      onSaved?.();
    },
  });

  // Query: Fetch all producible items (cached)
  const { data: itemsData = [], isLoading: isLoadingItems } = useQuery({
    queryKey: ["producibleItems", activeBranchId],
    queryFn: () => branchInventoryService.getProducibleItemsByBranch(activeBranchId),
    enabled: Boolean(activeBranchId),
    staleTime: 10 * 60 * 1000, // 10 min cache
  });

  const producibleItems = Array.isArray(itemsData)
    ? itemsData.map((entry) => entry?.item || entry).filter(Boolean)
    : [];

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantityProduced" ? parseFloat(value) || 0 : value,
    }));
  };

  // Handle item selection and load ingredients
  const handleItemSelect = async (itemId) => {
    setSelectedItemId(itemId);
    const selectedItem = producibleItems.find(item => item._id === itemId);
    if (selectedItem) {
      setFormData(prev => ({
        ...prev,
        producedItem: selectedItem.name || "",
        unit: selectedItem.unit || "kg",
      }));

      try {
        setLoadingItemDetails(true);
        setError(null);
        const itemDetails = await productionEventsService.getInventoryItem(itemId);
        const resolvedItemDetails = itemDetails?.data || itemDetails;
        setSelectedItemData(resolvedItemDetails);
        
        // Initialize ingredient quantities to empty
        const initialQuantities = {};
        if (resolvedItemDetails?.ItemIngredients?.length > 0) {
          resolvedItemDetails.ItemIngredients.forEach((ing) => {
            initialQuantities[getIngredientKey(ing)] = "";
          });
        }
        setIngredientQuantities(initialQuantities);
      } catch (err) {
        setError(`Failed to load item details: ${err.message}`);
        console.error("Error loading item details:", err);
        setSelectedItemData(selectedItem);
      } finally {
        setLoadingItemDetails(false);
      }
    }
  };

  useEffect(() => {
    if (!selectedItemId || selectedItemData || !Array.isArray(producibleItems) || producibleItems.length === 0) {
      return;
    }

    const eventProducedItemId = event?.producedItemId?._id || event?.producedItemId || null;
    const fallbackByName = producibleItems.find((item) => item.name === formData.producedItem);
    const match = producibleItems.find((item) => item._id === selectedItemId) || fallbackByName || (eventProducedItemId ? producibleItems.find((item) => item._id === eventProducedItemId) : null);

    if (!match) {
      return;
    }

    const selectedItemIdFromMatch = match._id;
    setSelectedItemId(selectedItemIdFromMatch);
    setFormData((prev) => ({
      ...prev,
      producedItem: match.name || prev.producedItem,
      unit: match.unit || prev.unit,
    }));

    const initialQuantities = {};
    const itemIngredients = match.ItemIngredients || selectedItemData?.ItemIngredients || [];
    itemIngredients.forEach((ing) => {
      const ingredientKey = getIngredientKey(ing);
      initialQuantities[ingredientKey] = ingredientQuantities[ingredientKey] || "";
    });
    setIngredientQuantities((prev) => ({ ...initialQuantities, ...prev }));
    setSelectedItemData(match);
  }, [event, formData.producedItem, ingredientQuantities, producibleItems, selectedItemData, selectedItemId]);

  useEffect(() => {
    if (event && producibleItems.length > 0) {
      setEditedEventId(event?.id || event?._id || null);
      setSelectedItemId(event?.producedItemId?._id || event?.producedItemId || "");
    }
  }, [event, producibleItems]);

  // Handle ingredient quantity input
  const handleIngredientQuantityChange = (ingredientId, value) => {
    setIngredientQuantities(prev => ({
      ...prev,
      [ingredientId]: value,
    }));
  };

  // Handle form submission - delegate to parent callback
  const handleSubmit = async () => {
    if (!formData.producedItem.trim()) {
      setError("Please select a produced item");
      return;
    }

    if (!activeBranchId) {
      setError("Please select a branch first");
      return;
    }

    if (formData.quantityProduced <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    // Build ingredients array
    const itemIngredients = selectedItemData?.ItemIngredients || event?.producedItemId?.ItemIngredients || [];
    const ingredients = itemIngredients.map((ing) => {
      const ingredientId = getIngredientKey(ing);

      return {
        itemId: ingredientId,
        quantity: parseFloat(ingredientQuantities[ingredientId]) || 0,
        unit: getIngredientUnit(ing),
      };
    }) || [];

    const payload = {
      branchId: activeBranchId,
      producedItemId: selectedItemId,
      producedItem: formData.producedItem,
      quantity: formData.quantityProduced,
      unit: formData.unit,
      status: statusMap[formData.status] || "in_progress",
      productionDate: formData.productionDate,
      notes: formData.notes,
      createdBy,
      ingredients,
    };

    try {
      await saveEvent(payload);
      // Reset form on success
      setFormData({
        producedItem: "",
        quantityProduced: 0,
        unit: "kg",
        status: "In Progress",
        productionDate: new Date().toISOString().split("T")[0],
        notes: "",
      });
      setSelectedItemData(null);
      setSelectedItemId("");
      setIngredientQuantities({});
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to save production event");
    }
  };

  return {
    // Form state
    formData,
    setFormData,
    handleChange,
    handleSubmit,

    // Item selection
    producibleItems,
    isLoadingItems,
    selectedItemId,
    selectedItemData,
    handleItemSelect,

    // Ingredients
    ingredientQuantities,
    handleIngredientQuantityChange,
    loadingItemDetails,

    // Loading & error states
    error,
    setError,
    isSubmitting,
    isSaving,
  };
};
