export default function TimedEventPanel({ discount }) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3 text-sm">
      <div className="font-medium">Schedule {discount?.name ?? "discount"}</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <ScheduleField label="Ends" value={discount?.ends ?? "Not set"} />
        <ScheduleField label="Status" value={discount?.status ?? "Draft"} />
        <ScheduleField label="Repeat" value="No repeat" />
        <ScheduleField label="Availability" value="Branch hours" />
      </div>
    </div>
  );
}

function ScheduleField({ label, value }) {
  return (
    <div className="rounded-md border bg-background p-2">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1">{value}</div>
    </div>
  );
}
