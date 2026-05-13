import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { Loader2, AlertCircle } from "lucide-react";
import { useProduceFormViewModel } from "../../../viewmodels/useProduceFormViewModel";

export default function ProduceFormPreview({ event, branchId, createdBy, onSaved }) {
  const {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    isSaving,
    producibleItems,
    isLoadingItems,
    selectedItemId,
    selectedItemData,
    handleItemSelect,
    ingredientQuantities,
    handleIngredientQuantityChange,
    loadingItemDetails,
    error,
  } = useProduceFormViewModel(event, branchId, createdBy, onSaved);


  console.log(producibleItems);
  


  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
            Select Producible Item
          </Label>
          {isLoadingItems ? (
            <div className="flex items-center gap-2 p-2 border rounded-md bg-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading items...</span>
            </div>
          ) : (
            <Select 
              value={selectedItemId} 
              onValueChange={handleItemSelect}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an item to produce" />
              </SelectTrigger>
              <SelectContent>
                {producibleItems.length > 0 ? (
                  producibleItems.map(item => (
                    <SelectItem key={item._id} value={item._id}>
                      {item.name} ({item.unit})
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-2 text-sm text-muted-foreground">No items available</div>
                )}
              </SelectContent>
            </Select>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
            Quantity Produced
          </Label>
          <div className="flex gap-2">
            <Input
              type="number"
              name="quantityProduced"
              value={formData.quantityProduced}
              onChange={handleChange}
              placeholder="0"
              disabled={isLoadingItems}
              min="0"
              step="0.1"
            />
            <Select value={formData.unit} onValueChange={(value) => setFormData((prev) => ({ ...prev, unit: value }))} disabled={isLoadingItems}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="g">g</SelectItem>
                <SelectItem value="Liter">Liter</SelectItem>
                <SelectItem value="ml">ml</SelectItem>
                <SelectItem value="pieces">pieces</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
            Status
          </Label>
          <Select value={formData.status} onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))} disabled={isLoadingItems}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
            Production Date
          </Label>
          <Input
            type="date"
            name="productionDate"
            value={formData.productionDate}
            onChange={handleChange}
            disabled={isLoadingItems}
          />
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium text-muted-foreground mb-2 block">
          Notes
        </Label>
        <Textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any additional notes..."
          disabled={isLoadingItems}
          className="min-h-24"
        />
      </div>

      {loadingItemDetails && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading ingredient details...</span>
        </div>
      )}

      {selectedItemData?.ItemIngredients && selectedItemData.ItemIngredients.length > 0 && (
        <div className="rounded-lg border bg-muted/20 p-4">
          <h4 className="text-sm font-medium mb-4 border-b pb-2">Required Ingredients</h4>
          <div className="space-y-3">
            {selectedItemData.ItemIngredients.map((ing, idx) => (
              <div key={idx} className="flex items-end gap-3">
                <div className="flex-1">
                  <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                    {ing.name || `Ingredient ${idx + 1}`}
                  </Label>
                  <div className="h-9 flex items-center px-3 rounded-md border border-input bg-background text-sm">
                    {ing.name || "Ingredient"}
                  </div>
                </div>
                <div className="w-24">
                  <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Quantity
                  </Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={ingredientQuantities[ing._id || ing.ingredientId] || ""}
                    onChange={(e) => handleIngredientQuantityChange(ing._id || ing.ingredientId, e.target.value)}
                    disabled={isLoadingItems}
                    min="0"
                    step="0.1"
                    className="h-9"
                  />
                </div>
                <div className="w-20">
                  <Label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Unit
                  </Label>
                  <div className="h-9 flex items-center px-3 rounded-md border border-input bg-muted text-sm">
                    {ing.unit || "unit"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={isLoadingItems || isSaving || !formData.producedItem.trim()}
        className="w-full"
      >
        {isLoadingItems || isSaving ? "Saving..." : event ? "Update Event" : "Log Production Event"}
      </Button>
    </div>
  );
}
