export default function InventoryTransferPanel({ branch }) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3 text-sm">
      <div className="font-medium">Transfer from {branch?.branch ?? "this branch"}</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <TransferField label="Source" value={branch?.branch ?? "Selected branch"} />
        <TransferField label="Destination" value="Choose receiving branch" />
        <TransferField label="Items" value="Select inventory items" />
        <TransferField label="Approval" value="Manager approval required" />
      </div>
    </div>
  );
}

function TransferField({ label, value }) {
  return (
    <div className="rounded-md border bg-background p-2">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1">{value}</div>
    </div>
  );
}
