export default function EditOrderPanel() {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3 text-sm">
      <div className="font-medium">Editable order fields</div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Order items" value="Add, remove, or adjust quantities" />
        <Field label="Fulfillment" value="Dine in, delivery, or pickup" />
        <Field label="Kitchen status" value="Pending or in kitchen" />
        <Field label="Branch" value="Move order to another branch" />
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
