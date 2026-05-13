export default function LinkedProductsPanel({ produce }) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3 text-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">Product links</span>
        <span className="rounded-full bg-secondary px-2 py-1 text-xs font-medium">{produce?.linkedProducts ?? "0 products"}</span>
      </div>
      <LinkRow label="Allocation" value="Quantity used per product" />
      <LinkRow label="Batch impact" value="Tracked as products sell" />
    </div>
  );
}

function LinkRow({ label, value }) {
  return (
    <div className="flex justify-between gap-3 rounded-md border bg-background px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
