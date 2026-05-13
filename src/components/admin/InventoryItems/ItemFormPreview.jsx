import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useInventoryFormViewModel } from "../../../viewmodels/useInventoryFormViewModel";

export default function ItemFormPreview({ item = {}, inventoryItems = [], onSave, onCancel, isSaving = false }) {
  const {
    formData,
    inventoryById,
    updateFormField,
    addIngredient,
    removeIngredient,
    updateIngredient,
    handleSubmit,
  } = useInventoryFormViewModel({ item, inventoryItems, onSave });

  return (
    <form className="grid gap-6 py-4" onSubmit={handleSubmit}>
      <div className="flex items-center gap-3 border-b pb-4 mb-2">
        {item && <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-sm py-1.5 px-3">SKU-{Math.floor(Math.random()*10000)}</Badge>}
        <span className="text-sm text-muted-foreground font-medium">{item ? `Editing: ${item.name}` : "New Item"}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Name</Label>
          <Input value={formData.name} onChange={(e) => updateFormField("name", e.target.value)} disabled={isSaving} />
        </div>

        <div>
          <Label>Item Type</Label>
          <Select value={formData.itemType} onValueChange={(v) => updateFormField("itemType", v)} disabled={isSaving}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="row">Raw / Row</SelectItem>
              <SelectItem value="producible">Producible (recipe)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Category</Label>
          <Input value={formData.category} onChange={(e) => updateFormField("category", e.target.value)} disabled={isSaving} />
        </div>

        <div>
          <Label>Unit</Label>
          <Select value={formData.unit} onValueChange={(v) => updateFormField("unit", v)} disabled={isSaving}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="g">g</SelectItem>
              <SelectItem value="L">L</SelectItem>
              <SelectItem value="ml">ml</SelectItem>
              <SelectItem value="pcs">pcs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 pt-5 border-t">
        <label className="flex items-center justify-between p-4 bg-card rounded-md cursor-pointer">
          <div>
            <div className="font-medium">Track Inventory Counts</div>
            <div className="text-sm text-muted-foreground">Adjust stock when this item is used in sales/production.</div>
          </div>
          <Switch checked={formData.trackInventory} onCheckedChange={(v) => updateFormField("trackInventory", v)} disabled={isSaving} />
        </label>
      </div>

      {formData.itemType === "producible" && (
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between mb-3">
            <Label>Ingredients</Label>
            <Button type="button" variant="outline" size="sm" onClick={addIngredient} disabled={isSaving}><Plus className="h-4 w-4"/> Add</Button>
          </div>

          <div className="space-y-3">
            {formData.ingredients.map((ing) => (
              <div key={ing.id} className="flex gap-3 items-center">
                <div className="flex-1">
                  <Select
                    value={ing.inventoryItemId}
                    onValueChange={(v) => updateIngredient(ing.id, { inventoryItemId: v })}
                    disabled={inventoryItems.length === 0 || isSaving}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={inventoryItems.length === 0 ? "No items available" : "Select item"} />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryItems.map((it) => (
                        <SelectItem key={it._id} value={String(it._id)}>
                          {it.name || it.item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-28">
                  <Input placeholder="qty" value={ing.quantity} onChange={(e) => updateIngredient(ing.id, { quantity: e.target.value })} disabled={isSaving} />
                </div>
                <div className="w-24 text-sm">{ing.unit || inventoryById.get(String(ing.inventoryItemId))?.unit || "unit"}</div>
                <Button type="button" variant="ghost" onClick={() => removeIngredient(ing.id)} disabled={isSaving}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>Cancel</Button>
        ) : null}
        <Button type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</Button>
      </div>
    </form>
  );
}
