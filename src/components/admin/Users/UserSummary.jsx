export default function UserSummary({ user }) {
  if (!user) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3 rounded-lg border bg-muted/20 p-3">
        <div>
          <div className="font-medium">{user.user}</div>
          <div className="mt-1 text-sm text-muted-foreground">{user.branch}</div>
        </div>
        <span className={user.status === "Active" ? "rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800" : "rounded-full bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700"}>
          {user.status}
        </span>
      </div>

      <div className="grid gap-2 rounded-lg border bg-muted/20 p-3 text-sm">
        <SummaryRow label="Role" value={user.role} />
        <SummaryRow label="Authorities" value={user.authoritySummary} />
      </div>
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
