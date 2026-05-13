export default function InventoryUsagePanel({ product }) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3 text-sm">
      <div className="font-medium">{product?.name ?? "Product"} usage</div>
      <div className="grid gap-2">
        <Usage label="Ingredient count" value={product?.ingredientsSummary ?? "0 ingredients"} />
        <Usage label="Stock impact" value="Updates inventory after sale" />
        <Usage label="Branch usage" value="Tracked per branch" />
      </div>
    </div>
  );
}

function Usage({ label, value }) {
  return (
    <div className="flex justify-between gap-3 rounded-md border bg-background px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
