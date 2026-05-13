import { Badge } from "../../ui/badge";

export default function BranchInventorySummary({ item, branches }) {
  if (!item) {
    return <div className="text-center text-muted-foreground">No item selected</div>;
  }

  console.log(item);
  

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Item Name</label>
          <p className="text-lg font-semibold mt-1">{item.item}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Branch</label>
          <p className="text-lg font-semibold mt-1">
            {branches.find((b) => b._id === item.branchId)?.name || "Unknown Branch"}
          </p>
        </div>
      </div>

      {item.itemObject && (item.itemObject.ItemIngredientsPopulated || item.itemObject.ItemIngredients) && (
        <div>
          <label className="text-sm font-medium text-muted-foreground">Ingredients</label>
          <div className="mt-2 space-y-2">
            {item.itemObject.ItemIngredientsPopulated && item.itemObject.ItemIngredientsPopulated.length > 0 ? (
              item.itemObject.ItemIngredientsPopulated.map((ing) => (
                <div key={String(ing._id)} className="flex items-center justify-between rounded-md border p-2">
                  <div className="text-sm">{ing.name}</div>
                  <div className="text-xs text-muted-foreground">{ing.unit || "unit"}</div>
                </div>
              ))
            ) : (
              Array.isArray(item.itemObject.ItemIngredients) && item.itemObject.ItemIngredients.length > 0 ? (
                item.itemObject.ItemIngredients.map((ing, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-md border p-2">
                    <div className="text-sm">{ing.ingredientId || ing}</div>
                    <div className="text-xs text-muted-foreground">id</div>
                  </div>
                ))
              ) : null
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Quantity</label>
          <p className="text-2xl font-bold mt-1">{item.quantity}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Unit</label>
          <p className="text-lg font-semibold mt-1">{item.unit}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Status</label>
          <div className="mt-1">
            <Badge
              variant="secondary"
              className={
                item.status === "OK"
                  ? "bg-emerald-100 text-emerald-800"
                  : item.status === "LOW"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-red-100 text-red-800"
              }
            >
              {item.status}
            </Badge>
          </div>
        </div>
      </div>

      {item.description && (
        <div>
          <label className="text-sm font-medium text-muted-foreground">Description</label>
          <p className="text-sm mt-1 text-foreground">{item.description}</p>
        </div>
      )}
    </div>
  );
}
