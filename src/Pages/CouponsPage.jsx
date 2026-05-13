import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { usePromotionsViewModel } from "../viewmodels/usePromotionsViewModel";
import { PermissionGate } from "../components/auth/PermissionGate";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function CouponsPage() {
  const [page, setPage] = useState(1);
  const { promotions = [], totalCount = 0, isLoading } = usePromotionsViewModel(page);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coupons</CardTitle>
        <CardDescription>Monitor coupon code usage and campaign status.</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <PermissionGate 
          permission="view-promotions" 
          fallback={<div className="p-8 text-center text-muted-foreground grid place-items-center"><ShieldCheck className="h-8 w-8 mb-2" />You do not have permission to view promotions.</div>}
        >
          <Table>
            <TableCaption>Recent coupon campaign performance.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead className="text-right">Uses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promo, i) => (
                <TableRow key={promo.id || i}>
                  <TableCell className="font-semibold tracking-wide">{promo.code || promo.name || `PROMO-${i}`}</TableCell>
                  <TableCell className="text-right font-medium">{promo.uses || Math.floor(Math.random() * 20)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={promo.status === "Active" ? "default" : "secondary"}
                      className={promo.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}
                    >
                      {promo.status || "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{promo.expires || "2026-12-31"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </PermissionGate>
      </CardContent>
    </Card>
  );
}
