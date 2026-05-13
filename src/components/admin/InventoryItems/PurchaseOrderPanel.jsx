export default function PurchaseOrderPanel({ item }) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3 text-sm">
      <div className="font-medium">Purchase order for {item?.item ?? "this item"}</div>
      <div className="grid gap-2">
        <OrderLine label="Supplier" value={item?.supplierSummary ?? "Select supplier"} />
        <OrderLine label="Requested unit" value={item?.unit ?? "-"} />
        <OrderLine label="Current stock" value={item?.stock ?? "Not set"} />
      </div>
    </div>
  );
}

function OrderLine({ label, value }) {
  return (
    <div className="flex justify-between gap-3 rounded-md border bg-background px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
