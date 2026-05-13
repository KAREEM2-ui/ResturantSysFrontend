export default function StoragePanel({ produce }) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3 text-sm">
      <div className="font-medium">Cold storage move</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <StorageField label="Produce" value={produce?.produce ?? "Selected produce"} />
        <StorageField label="Quantity" value={produce?.quantity ?? "-"} />
        <StorageField label="Freshness" value={produce?.freshness ?? "-"} />
        <StorageField label="Destination" value="Cold storage" />
      </div>
    </div>
  );
}

function StorageField({ label, value }) {
  return (
    <div className="rounded-md border bg-background p-2">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1">{value}</div>
    </div>
  );
}
