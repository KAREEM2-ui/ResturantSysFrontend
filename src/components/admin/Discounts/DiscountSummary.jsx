export default function DiscountSummary({ discount }) {
  if (!discount) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Metric label="Rate" value={discount.rate} />
        <Metric label="Status" value={discount.status} tone={discount.status === "Active" ? "success" : "info"} />
      </div>
      <div className="grid gap-2 rounded-lg border bg-muted/20 p-3 text-sm">
        <SummaryRow label="Ends" value={discount.ends} />
        <SummaryRow label="Scope" value={discount.scopeSummary} />
      </div>
    </div>
  );
}

function Metric({ label, value, tone = "default" }) {
  const toneClass = tone === "success" ? "bg-emerald-50 text-emerald-700" : tone === "info" ? "bg-blue-50 text-blue-700" : "bg-background";

  return (
    <div className={`rounded-lg border p-3 ${toneClass}`}>
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
