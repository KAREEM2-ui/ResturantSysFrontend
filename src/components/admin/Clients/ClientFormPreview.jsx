export default function ClientFormPreview() {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3 text-sm">
      <div className="grid gap-2 sm:grid-cols-2">
        <Field label="Client name" value="Full customer name" />
        <Field label="Branch" value="Preferred location" />
        <Field label="Tier" value="Regular or VIP" />
        <Field label="Preferences" value="Favorite products and notes" />
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
