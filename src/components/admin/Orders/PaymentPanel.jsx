export default function PaymentPanel({ order }) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3 text-sm">
      <div className="flex items-center justify-between gap-3 rounded-md border bg-background p-3">
        <span className="text-muted-foreground">Amount due</span>
        <span className="text-lg font-semibold">{order?.total}</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Method label="Cash" />
        <Method label="Card" />
        <Method label="Online" />
      </div>
    </div>
  );
}

function Method({ label }) {
  return (
    <div className="rounded-md border bg-background px-3 py-2 text-center font-medium">
      {label}
    </div>
  );
}
