export default function ClientSummary({ client }) {
  if (!client) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Metric label="Visits" value={client.visits} />
        <Metric label="Total spend" value={client.spend} />
      </div>
      <div className="grid gap-2 rounded-lg border bg-muted/20 p-3 text-sm">
        <SummaryRow label="Tier" value={client.tier} />
        <SummaryRow label="Preferences" value={client.favoritesSummary} />
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
