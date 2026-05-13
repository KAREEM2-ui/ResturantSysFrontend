export default function PreferencesPanel({ client }) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3 text-sm">
      <Preference label="Favorite products" value={client?.favoritesSummary ?? "No preferences recorded"} />
      <Preference label="Preferred branch" value={client?.branch ?? "Not selected"} />
      <Preference label="Follow-up" value="Loyalty and preference notes" />
    </div>
  );
}

function Preference({ label, value }) {
  return (
    <div className="rounded-md border bg-background p-3">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}
