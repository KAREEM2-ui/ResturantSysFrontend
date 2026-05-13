export default function SupplierDeliveryPanel({ produce }) {
  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-3 text-sm">
      <div className="font-medium">{produce?.supplier ?? "Supplier"} delivery</div>
      <DeliveryRow label="Produce" value={produce?.produce ?? "-"} />
      <DeliveryRow label="Quantity" value={produce?.quantity ?? "-"} />
      <DeliveryRow label="Status" value="Received and ready for allocation" />
    </div>
  );
}

function DeliveryRow({ label, value }) {
  return (
    <div className="flex justify-between gap-3 rounded-md border bg-background px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
