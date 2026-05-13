export default function CategoryPanel({ product }) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3 text-sm">
      <div className="rounded-md border bg-background p-3">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Category</div>
        <div className="mt-1 font-semibold">{product?.category ?? "Unassigned"}</div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <CategoryMetric label="Visibility" value={product?.status ?? "Active"} />
        <CategoryMetric label="Price group" value={product?.price ?? "$0.00"} />
      </div>
    </div>
  );
}

function CategoryMetric({ label, value }) {
  return (
    <div className="rounded-md border bg-background p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
