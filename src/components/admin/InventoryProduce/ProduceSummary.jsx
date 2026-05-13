import { Badge } from "../../ui/badge";

export default function ProduceSummary({ event }) {
  if (!event || typeof event !== "object") {
    return null;
  }

  const ingredients = Array.isArray(event.ingredients) ? event.ingredients.filter(Boolean) : [];
  const quantityValue = event.quantity ?? event.quantityProduced ?? 0;
  const producedItemLabel = event.producedItem || event.producedItemId?.name || "Unknown";
  const statusLabel = event.status === "Completed"
    ? "Completed"
    : event.status === "Cancelled"
    ? "Cancelled"
    : event.status === "In Progress" || event.status === "in_progress"
    ? "In Progress"
    : String(event.status || "In Progress");

  const statusColor = statusLabel === "Completed" 
    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" 
    : statusLabel === "Cancelled"
    ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
    : "bg-blue-100 text-blue-800 hover:bg-blue-100";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Metric 
          label="Produced Item" 
          value={producedItemLabel} 
        />
        <Metric 
          label="Quantity" 
          value={`${quantityValue} ${event.unit || "unit"}`} 
        />
        <Metric 
          label="Unit" 
          value={event.unit || "unit"} 
        />
        <Metric 
          label="Status" 
          value={<Badge variant="secondary" className={statusColor}>{statusLabel}</Badge>} 
          tone={statusLabel === "Completed" ? "success" : statusLabel === "Cancelled" ? "warning" : "default"} 
        />
        <Metric 
          label="Production Date" 
          value={event.date} 
        />
        {event.branch && (
          <Metric 
            label="Branch" 
            value={event.branch} 
          />
        )}
      </div>
      
      {event.notes && (
        <div className="rounded-lg border bg-muted/20 p-4">
          <h4 className="text-sm font-medium mb-2 border-b pb-2">Notes</h4>
          <p className="text-sm text-muted-foreground">{event.notes}</p>
        </div>
      )}

      {ingredients.length > 0 && (
        <div className="rounded-lg border bg-muted/20">
          <div className="grid grid-cols-[1fr_auto] gap-4 border-b p-3 text-xs font-semibold text-muted-foreground bg-muted/50">
            <div>Ingredient</div>
            <div className="text-right">Quantity</div>
          </div>
          <div className="divide-y">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_auto] gap-4 p-3 text-sm">
                <span className="font-medium">{ing?.name || ing?.itemName || ing?.ingredientName || ing?.ingredientId?.name || "Ingredient"}</span>
                <span className="text-muted-foreground">
                  {typeof ing === "string" ? "N/A" : `${ing?.quantity || 0} ${ing?.unit || "unit"}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, tone = "default" }) {
  const toneClass = tone === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : tone === "warning" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-card border-border";

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <div className="text-xs tracking-wider font-semibold uppercase text-muted-foreground mb-1">{label}</div>
      <div className="text-base font-medium">{value}</div>
    </div>
  );
}
