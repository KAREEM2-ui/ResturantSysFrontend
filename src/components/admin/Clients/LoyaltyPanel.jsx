export default function LoyaltyPanel({ client }) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3 text-sm">
      <div className="flex items-center justify-between gap-3 rounded-md border bg-background p-3">
        <span className="text-muted-foreground">Current tier</span>
        <span className="font-semibold">{client?.tier ?? "Regular"}</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Action label="Upgrade tier" />
        <Action label="Apply loyalty reward" />
      </div>
    </div>
  );
}

function Action({ label }) {
  return <div className="rounded-md border bg-background px-3 py-2 font-medium">{label}</div>;
}
