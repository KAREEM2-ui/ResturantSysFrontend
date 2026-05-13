import { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

export default function StockTransferForm({
  item,
  branches,
  currentBranchId,
  onSave,
}) {
  const [targetBranchId, setTargetBranchId] = useState("");
  const [transferQuantity, setTransferQuantity] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!targetBranchId || transferQuantity <= 0) {
      alert("Please select a branch and enter a valid quantity");
      return;
    }

    if (transferQuantity > (item?.quantity || 0)) {
      alert("Cannot transfer more than available quantity");
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        fromBranchId: item.branchId,
        toBranchId: targetBranchId,
        itemId: item.itemId,
        quantity: transferQuantity,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!item) {
    return <div className="text-center text-muted-foreground">No item selected</div>;
  }

  const targetBranch = branches.find((b) => b._id === targetBranchId);
  const availableBranches = branches.filter((b) => b._id !== currentBranchId);

  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{item.item}</span> @ {item.branch}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Available to Transfer: <span className="font-bold text-foreground">{item.quantity} {item.unit}</span>
        </p>
      </div>

      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Transfer To
        </label>
        <Select value={targetBranchId} onValueChange={setTargetBranchId}>
          <SelectTrigger>
            <SelectValue placeholder="Select destination branch" />
          </SelectTrigger>
          <SelectContent>
            {availableBranches.map((branch) => (
              <SelectItem key={branch._id} value={branch._id}>
                {branch.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-muted-foreground mb-2 block">
          Quantity to Transfer
        </label>
        <Input
          type="number"
          value={transferQuantity}
          onChange={(e) => setTransferQuantity(parseFloat(e.target.value) || 0)}
          placeholder="Enter quantity"
          min="0"
          max={item.quantity}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Max: {item.quantity} {item.unit}
        </p>
      </div>

      {targetBranch && transferQuantity > 0 && (
        <div className="bg-green-50 p-3 rounded-md">
          <p className="text-sm text-green-900">
            Transfer {transferQuantity} {item.unit} to <span className="font-semibold">{targetBranch.name}</span>
          </p>
        </div>
      )}

      <Button
        onClick={handleSave}
        disabled={
          isSaving || !targetBranchId || transferQuantity <= 0 || transferQuantity > item.quantity
        }
        className="w-full"
      >
        {isSaving ? "Transferring..." : "Transfer Stock"}
      </Button>
    </div>
  );
}
