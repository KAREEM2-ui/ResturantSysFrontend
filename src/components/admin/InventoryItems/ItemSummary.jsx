import { Badge } from "@/components/ui/badge";

export default function ItemSummary({ item }) {
  if (!item) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Metric label="Current Stock" value={item.stock} tone={item.status === "OK" ? "success" : "warning"} />
        <Metric label="Status" value={item.status} tone={item.status === "OK" ? "success" : "warning"} />
        <Metric label="Base Unit" value={item.unit} />
        <Metric label="Category" value={item.category || "Meat & Poultry"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold border-b pb-2">Stock by Location</h4>
          <div className="rounded-lg border bg-card">
            <div className="grid grid-cols-[1fr_auto] gap-4 border-b p-3 text-xs font-semibold text-muted-foreground bg-muted/50 rounded-t-lg">
              <div>Branch</div>
              <div className="text-right">Available Qty</div>
            </div>
            <div className="divide-y">
              <div className="grid grid-cols-[1fr_auto] gap-4 p-3 text-sm hover:bg-muted/30 transition-colors">
                <span className="font-medium">Main Kitchen</span>
                <span className="text-muted-foreground">{item.stock}</span>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-4 p-3 text-sm hover:bg-muted/30 transition-colors">
                <span className="font-medium">Downtown Branch</span>
                <span className="text-muted-foreground">0 {item.unit}</span>
              </div>
              <div className="grid grid-cols-[1fr_auto] gap-4 p-3 text-sm hover:bg-muted/30 transition-colors">
                <span className="font-medium">Uptown Kiosk</span>
                <span className="text-muted-foreground">15 {item.unit}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold border-b pb-2">Item Details</h4>
          <div className="rounded-lg border bg-card p-4 space-y-4">
            <SummaryRow label="Item Name" value={item.item || item.name} />
            <SummaryRow label="SKU / Barcode" value={`SKU-${Math.floor(Math.random() * 10000)}`} />
            <SummaryRow label="Low Stock Threshold" value={`10 ${item.unit}`} />
            <SummaryRow label="Cost per Unit" value="$4.50" />
            <SummaryRow label="Total Value" value={`$${(parseFloat(item.stock) * 4.5).toFixed(2)}`} />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end border-b pb-2">
          <h4 className="text-sm font-semibold">Recent Transactions (Last 7 Days)</h4>
          <Badge variant="outline" className="text-xs">View All</Badge>
        </div>
        <div className="rounded-lg border bg-card">
           <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 border-b p-3 text-xs font-semibold text-muted-foreground bg-muted/50 rounded-t-lg">
            <div>Date</div>
            <div>Type</div>
            <div className="text-right">Qty</div>
            <div className="text-right">Branch</div>
          </div>
          <div className="divide-y">
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-3 text-sm items-center hover:bg-muted/30">
              <span className="text-muted-foreground text-xs">Today, 10:30 AM</span>
              <span className="font-medium text-emerald-600">Stock Received</span>
              <span className="text-right font-medium text-emerald-600">+20 {item.unit}</span>
              <span className="text-right text-muted-foreground">Main Kitchen</span>
            </div>
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-3 text-sm items-center hover:bg-muted/30">
              <span className="text-muted-foreground text-xs">Yesterday, 14:15 PM</span>
              <span className="font-medium text-blue-600">Transfer Out</span>
              <span className="text-right font-medium text-destructive">-5 {item.unit}</span>
              <span className="text-right text-muted-foreground">Downtown Branch</span>
            </div>
            <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 p-3 text-sm items-center hover:bg-muted/30">
              <span className="text-muted-foreground text-xs">2 Days Ago</span>
              <span className="font-medium text-amber-600">Manual Adjustment</span>
              <span className="text-right font-medium text-destructive">-2 {item.unit}</span>
              <span className="text-right text-muted-foreground">Main Kitchen</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, tone = "default" }) {
  const toneClass = tone === "success" 
    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800" 
    : tone === "warning" 
    ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800" 
    : "bg-card border-border";

  return (
    <div className={`rounded-xl border p-4 shadow-sm ${toneClass}`}>
      <div className="text-xs tracking-wider font-semibold uppercase text-muted-foreground/80 mb-1">{label}</div>
      <div className={`text-xl font-bold ${tone === 'default' ? 'text-foreground' : ''}`}>{value}</div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between items-center gap-4 text-sm">
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className="font-semibold text-foreground text-right">{value}</span>
    </div>
  );
}
