import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

export default function StockAdjustmentForm({ item, onSave }) {
  const [newQuantity, setNewQuantity] = useState(item?.quantity || 0);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(newQuantity);
    } finally {
      setIsSaving(false);
    }
  };

  if (!item) {
    return <div className="text-center text-muted-foreground">No item selected</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{item.item}</span> @ {item.branch}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Current Stock: <span className="font-bold text-foreground">{item.quantity} {item.unit}</span>
        </p>
      </div>

      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          New Quantity
        </label>
        <Input
          type="number"
          value={newQuantity}
          onChange={(e) => setNewQuantity(parseFloat(e.target.value) || 0)}
          placeholder="Enter new quantity"
          min="0"
        />
      </div>

      <div className="bg-blue-50 p-3 rounded-md">
        <p className="text-sm text-blue-900">
          Change: <span className="font-semibold">{newQuantity - item.quantity > 0 ? '+' : ''}{newQuantity - item.quantity} {item.unit}</span>
        </p>
      </div>

      <Button
        onClick={handleSave}
        disabled={isSaving || newQuantity === item.quantity}
        className="w-full"
      >
        {isSaving ? "Updating..." : "Update Stock"}
      </Button>
    </div>
  );
}
