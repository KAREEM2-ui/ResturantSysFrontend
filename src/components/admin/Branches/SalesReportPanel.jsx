export default function SalesReportPanel({ branch }) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3 text-sm">
      <div className="rounded-md border bg-background p-3">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Current sales</div>
        <div className="mt-1 text-lg font-semibold">{branch?.sales ?? "$0"}</div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <ReportMetric label="Occupancy" value={branch?.occupancy ?? "0%"} />
        <ReportMetric label="Team" value={branch?.teamSummary ?? "0 users"} />
      </div>
    </div>
  );
}

function ReportMetric({ label, value }) {
  return (
    <div className="rounded-md border bg-background p-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
