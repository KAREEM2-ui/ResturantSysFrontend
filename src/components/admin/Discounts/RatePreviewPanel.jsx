export default function RatePreviewPanel({ discount }) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3 text-sm">
      <div className="rounded-md border bg-background p-3">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Applied rate</div>
        <div className="mt-1 text-lg font-semibold">{discount?.rate ?? "0%"}</div>
      </div>
      <div className="grid gap-2">
        <PreviewRow label="Campaign" value={discount?.name ?? "Selected discount"} />
        <PreviewRow label="Scope" value={discount?.scopeSummary ?? "No scope"} />
      </div>
    </div>
  );
}

function PreviewRow({ label, value }) {
  return (
    <div className="flex justify-between gap-3 rounded-md border bg-background px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
