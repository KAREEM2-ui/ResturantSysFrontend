import { useMemo, useState } from "react";

function buildInitialForm(item) {
  return {
    name: item?.name || "",
    category: item?.category || "",
    unit: item?.unit || "kg",
    itemType: item?.itemType || "row",
    lowStockThreshold: item?.lowStockThreshold || 0,
    trackInventory: item?.trackInventory !== false,
    ingredients: (item?.ItemIngredients || []).map((ing, idx) => ({
      id: `${String(ing.ingredientId)}-${idx}`,
      inventoryItemId: String(ing.ingredientId),
      quantity: "",
      unit: "",
    })),
  };
}

export function useInventoryFormViewModel({ item = {}, inventoryItems = [], onSave }) {
  const [formData, setFormData] = useState(() => buildInitialForm(item));

  const inventoryById = useMemo(() => new Map(inventoryItems.map((i) => [String(i._id), i])), [inventoryItems]);

  const updateFormField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const addIngredient = () => {
    const first = inventoryItems[0];
    setFormData((current) => ({
      ...current,
      ingredients: [
        ...current.ingredients,
        {
          id: `${Date.now()}`,
          inventoryItemId: first ? String(first._id) : "",
          quantity: "",
          unit: first?.unit || "",
        },
      ],
    }));
  };

  const removeIngredient = (id) => {
    setFormData((current) => ({
      ...current,
      ingredients: current.ingredients.filter((ing) => ing.id !== id),
    }));
  };

  const updateIngredient = (id, patch) => {
    setFormData((current) => ({
      ...current,
      ingredients: current.ingredients.map((ing) => {
        if (ing.id !== id) {
          return ing;
        }

        const next = { ...ing, ...patch };
        if (patch.inventoryItemId) {
          next.unit = inventoryById.get(String(patch.inventoryItemId))?.unit || next.unit;
        }

        return next;
      }),
    }));
  };

  const buildPayload = () => {
    const payload = {
      name: formData.name.trim(),
      category: formData.category || undefined,
      unit: formData.unit,
      itemType: formData.itemType,
    };

    if (formData.itemType === "producible") {
      payload.ItemIngredients = formData.ingredients
        .filter((ing) => ing.inventoryItemId)
        .map((ing) => ({ ingredientId: ing.inventoryItemId }));
    }

    return payload;
  };

  const handleSubmit = async (event) => {
    event?.preventDefault?.();

    if (!formData.name.trim()) {
      return;
    }

    const payload = buildPayload();
    await onSave?.(payload);
  };

  return {
    formData,
    inventoryById,
    updateFormField,
    addIngredient,
    removeIngredient,
    updateIngredient,
    handleSubmit,
  };
}
