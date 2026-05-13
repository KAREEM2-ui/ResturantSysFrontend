export default function OrderHistoryPanel({ client }) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3 text-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">{client?.name ?? "Client"} orders</span>
        <span className="text-muted-foreground">{client?.visits ?? 0} visits</span>
      </div>
      <HistoryRow label="Recent order" value={client?.spend ?? "$0"} />
      <HistoryRow label="Favorite items" value={client?.favoritesSummary ?? "Not recorded"} />
    </div>
  );
}

function HistoryRow({ label, value }) {
  return (
    <div className="flex justify-between gap-3 rounded-md border bg-background px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
