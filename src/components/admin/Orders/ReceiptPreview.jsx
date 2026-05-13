function formatCurrency(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "$0.00";
  return `$${numeric.toFixed(2)}`;
}

function formatDate(date) {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString();
}

export default function ReceiptPreview({ order }) {
  if (!order) {
    return null;
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.unitPrice) || 0),
    0
  );
  const total = formatCurrency(subtotal);

  return (
    <div className="rounded-xl border bg-linear-to-b from-background to-muted/20 p-4 shadow-sm">
      <div className="mx-auto w-full max-w-md rounded-lg border bg-background p-5 text-sm">
        <div className="border-b border-dashed pb-4 text-center">
          <h3 className="text-lg font-bold tracking-wide">POS RECEIPT</h3>
          <p className="mt-1 text-xs text-muted-foreground">Thank you for your order</p>
        </div>

        <div className="mt-4 space-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between gap-3">
            <span>Receipt No.</span>
            <span className="font-medium text-foreground">{order.id || order._id || "-"}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span>Date</span>
            <span className="font-medium text-foreground">{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span>Branch</span>
            <span className="font-medium text-foreground">{order.branch || "-"}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span>Channel</span>
            <span className="font-medium text-foreground">{order.channel || "-"}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span>Status</span>
            <span className="font-medium text-foreground">{order.status || "-"}</span>
          </div>
          <div className="flex justify-between gap-3">
            <span>Payment</span>
            <span className="font-medium text-foreground">{order.payment?.status || "-"}</span>
          </div>
        </div>

        <div className="my-4 border-t border-dashed" />

        <div className="space-y-2">
          <div className="grid grid-cols-12 text-xs font-semibold text-muted-foreground">
            <span className="col-span-6">Item</span>
            <span className="col-span-2 text-center">Qty</span>
            <span className="col-span-2 text-right">Price</span>
            <span className="col-span-2 text-right">Total</span>
          </div>

          {items.length ? (
            items.map((item, index) => {
              const qty = Number(item.qty) || 0;
              const unitPrice = Number(item.unitPrice) || 0;
              const lineTotal = qty * unitPrice;

              return (
                <div key={`${item.productId || item.name || "item"}-${index}`} className="grid grid-cols-12 text-xs">
                  <span className="col-span-6 truncate pr-2 text-foreground">{item.name || "Unnamed Item"}</span>
                  <span className="col-span-2 text-center text-muted-foreground">{qty}</span>
                  <span className="col-span-2 text-right text-muted-foreground">{formatCurrency(unitPrice)}</span>
                  <span className="col-span-2 text-right font-medium text-foreground">{formatCurrency(lineTotal)}</span>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-muted-foreground">No order items found.</p>
          )}
        </div>

        <div className="my-4 border-t border-dashed" />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Items Count</span>
            <span className="font-medium">{order.itemsSummary ?? items.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 text-base font-bold">
            <span>Total</span>
            <span>{total}</span>
          </div>
        </div>

        <p className="mt-5 border-t border-dashed pt-3 text-center text-[11px] text-muted-foreground">
          This is a system-generated receipt.
        </p>
      </div>
    </div>
  );
}
