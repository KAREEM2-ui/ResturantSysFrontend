export default function AssignmentPanel({ discount, target }) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3 text-sm">
      <div className="font-medium">Assign {discount?.name ?? "this discount"}</div>
      <div className="grid gap-2">
        <AssignmentRow label="Target" value={target} />
        <AssignmentRow label="Current scope" value={discount?.scopeSummary ?? "No targets"} />
        <AssignmentRow label="Rate" value={discount?.rate ?? "0%"} />
      </div>
    </div>
  );
}

function AssignmentRow({ label, value }) {
  return (
    <div className="flex justify-between gap-3 rounded-md border bg-background px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
