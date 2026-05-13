import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function BranchAvailabilityPanel({ product, branches = [], selectedBranchIds = [], onToggleBranch }) {
  return (
    <div className="space-y-4 py-4">
      <div className="text-sm text-muted-foreground">
        Toggle the branches where <strong>{product?.name || "this product"}</strong> is available for sale.
      </div>

      <div className="space-y-3">
        {branches.map((branch) => {
          const branchId = String(branch._id);
          const checked = selectedBranchIds.includes(branchId);

          return (
            <div key={branchId} className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label className="text-base">{branch.name}</Label>
                <p className="text-xs text-muted-foreground">Set availability for {branch.name}</p>
              </div>
              <Switch checked={checked} onCheckedChange={(value) => onToggleBranch?.(branchId, value)} />
            </div>
          );
        })}

        {!branches.length ? <p className="text-sm text-muted-foreground">No branches found.</p> : null}
      </div>
    </div>
  );
}
