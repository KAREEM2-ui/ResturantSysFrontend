export default function AuthoritiesSummary({ user }) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3 text-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">Current access</span>
        <span className="rounded-full bg-secondary px-2 py-1 text-xs font-medium">{user?.authoritySummary ?? "0 authorities"}</span>
      </div>
      <div className="grid gap-2">
        <Authority label="Orders and payments" />
        <Authority label="Inventory operations" />
        <Authority label="Reports and dashboard" />
      </div>
    </div>
  );
}

function Authority({ label }) {
  return (
    <div className="flex items-center justify-between rounded-md border bg-background px-3 py-2">
      <span>{label}</span>
      <span className="text-xs font-medium text-muted-foreground">Review</span>
    </div>
  );
}
