export default function DiscountFormPreview() {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3 text-sm">
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Campaign" value="Name and active status" />
        <Field label="Rate" value="Percent or fixed discount" />
        <Field label="Schedule" value="Start and end dates" />
        <Field label="Scope" value="Branches and customer segments" />
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="rounded-md border bg-background p-2">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1">{value}</div>
    </div>
  );
}
