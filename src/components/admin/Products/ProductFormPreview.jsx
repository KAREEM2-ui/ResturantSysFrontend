import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

function getInitialState(product) {
  const ingredients = Array.isArray(product?.ingredients) ? product.ingredients : [];
  const itemId = typeof product?.item === "string" ? product.item : product?.item?._id || "";

  return {
    name: product?.name || "",
    category: product?.category || "",
    price: product?.price != null ? String(product.price) : "",
    status: product?.status || "Active",
    description: product?.description || "",
    mode: ingredients.length > 0 ? "ingredients" : "item",
    item: itemId,
    ingredients: ingredients.map((ingredient, index) => ({
      id: `${ingredient.inventoryItemId}-${index}`,
      inventoryItemId: String(ingredient.inventoryItemId || ""),
      quantity: String(ingredient.quantity ?? ""),
      unit: ingredient.unit || "",
    })),
  };
}

export default function ProductFormPreview({
  product,
  inventoryItems = [],
  onSave,
  onCancel,
  isSaving = false,
}) {
  const [form, setForm] = useState(() => getInitialState(product));
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setForm(getInitialState(product));
    setValidationError("");
  }, [product]);

  const inventoryById = useMemo(() => {
    return new Map(inventoryItems.map((item) => [String(item._id), item]));
  }, [inventoryItems]);

  const addIngredient = () => {
    const firstItem = inventoryItems[0];
    setForm((current) => ({
      ...current,
      ingredients: [
        ...current.ingredients,
        {
          id: `${Date.now()}`,
          inventoryItemId: firstItem ? String(firstItem._id) : "",
          quantity: "",
          unit: firstItem?.unit || "",
        },
      ],
    }));
  };

  const removeIngredient = (id) => {
    setForm((current) => ({
      ...current,
      ingredients: current.ingredients.filter((ingredient) => ingredient.id !== id),
    }));
  };

  const updateIngredient = (id, patch) => {
    setForm((current) => ({
      ...current,
      ingredients: current.ingredients.map((ingredient) => {
        if (ingredient.id !== id) {
          return ingredient;
        }

        const next = { ...ingredient, ...patch };
        if (patch.inventoryItemId) {
          const selected = inventoryById.get(String(patch.inventoryItemId));
          if (selected?.unit) {
            next.unit = selected.unit;
          }
        }

        return next;
      }),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidationError("");

    if (!form.name.trim()) {
      setValidationError("Product name is required");
      return;
    }

    const price = Number(form.price);
    if (Number.isNaN(price) || price < 0) {
      setValidationError("Please enter a valid price");
      return;
    }

    if (form.mode === "item" && !form.item) {
      setValidationError("Select an inventory item for item-based product");
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category.trim() || undefined,
      price,
      status: form.status,
      description: form.description.trim() || undefined,
    };

    if (form.mode === "item") {
      payload.item = form.item;
      payload.ingredients = [];
    } else {
      const ingredients = form.ingredients
        .filter((ingredient) => ingredient.inventoryItemId && ingredient.quantity !== "")
        .map((ingredient) => ({
          inventoryItemId: ingredient.inventoryItemId,
          quantity: Number(ingredient.quantity),
          unit: ingredient.unit || inventoryById.get(String(ingredient.inventoryItemId))?.unit || "unit",
        }))
        .filter((ingredient) => !Number.isNaN(ingredient.quantity) && ingredient.quantity >= 0);

      if (!ingredients.length) {
        setValidationError("Add at least one valid ingredient");
        return;
      }

      payload.ingredients = ingredients;
      payload.item = undefined;
    }

    await onSave?.(payload);
  };

  return (
    <form className="space-y-4 py-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="productName">Product Name</Label>
          <Input
            id="productName"
            placeholder="e.g. Truffle Pasta"
            value={form.name}
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            placeholder="e.g. Main Course"
            value={form.category}
            onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            placeholder="14.00"
            value={form.price}
            onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={form.status} onValueChange={(value) => setForm((current) => ({ ...current, status: value }))}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="INActive">INActive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          placeholder="Details about this product"
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="product-mode">Product Type</Label>
        <Select value={form.mode} onValueChange={(value) => setForm((current) => ({ ...current, mode: value }))}>
          <SelectTrigger id="product-mode">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ingredients">Ingredients Recipe</SelectItem>
            <SelectItem value="item">Single Inventory Item</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {form.mode === "item" ? (
        <div className="space-y-2">
          <Label htmlFor="product-item">Inventory Item</Label>
          <Select value={form.item} onValueChange={(value) => setForm((current) => ({ ...current, item: value }))}>
            <SelectTrigger id="product-item">
              <SelectValue placeholder="Select inventory item" />
            </SelectTrigger>
            <SelectContent>
              {inventoryItems.map((item) => (
                <SelectItem key={item._id} value={String(item._id)}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="space-y-3 rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <Label>Ingredients</Label>
            <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
              <Plus className="h-4 w-4" /> Add Ingredient
            </Button>
          </div>

          {form.ingredients.map((ingredient) => (
            <div key={ingredient.id} className="grid grid-cols-[1fr_90px_90px_auto] items-center gap-2">
              <Select
                value={ingredient.inventoryItemId}
                onValueChange={(value) => updateIngredient(ingredient.id, { inventoryItemId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select item" />
                </SelectTrigger>
                <SelectContent>
                  {inventoryItems.map((item) => (
                    <SelectItem key={item._id} value={String(item._id)}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Qty"
                value={ingredient.quantity}
                onChange={(event) => updateIngredient(ingredient.id, { quantity: event.target.value })}
              />

              <Input
                placeholder="Unit"
                value={ingredient.unit}
                onChange={(event) => updateIngredient(ingredient.id, { unit: event.target.value })}
              />

              <Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(ingredient.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {validationError ? <p className="text-sm text-destructive">{validationError}</p> : null}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : product ? "Save Changes" : "Add Product"}
        </Button>
      </div>
    </form>
  );
}
