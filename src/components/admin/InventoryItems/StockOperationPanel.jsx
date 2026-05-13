export default function StockOperationPanel({ item, action }) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3 text-sm">
      <div className="font-medium">{action} for {item?.item ?? "this item"}</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <OperationField label="Current stock" value={item?.stock ?? "Not set"} />
        <OperationField label="Unit" value={item?.unit ?? "-"} />
        <OperationField label="Reason" value="Operational adjustment" />
        <OperationField label="Approval" value="Manager review" />
      </div>
    </div>
  );
}

function OperationField({ label, value }) {
  return (
    <div className="rounded-md border bg-background p-2">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1">{value}</div>
    </div>
  );
}
