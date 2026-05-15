import {
  BadgeDollarSign,
  Eye,
  FilePenLine,
  ReceiptText,
  AlertCircle
} from "lucide-react";
import { useState } from "react";

import EntityManagementCard from "../components/admin/EntityManagementCard";
import EditOrderPanel from "../components/admin/Orders/EditOrderPanel";
import OrderSummary from "../components/admin/Orders/OrderSummary";
import PaymentPanel from "../components/admin/Orders/PaymentPanel";
import ReceiptPreview from "../components/admin/Orders/ReceiptPreview";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

import { useOrdersViewModel } from "../viewmodels/useOrdersViewModel";
import { PermissionGate } from "../components/auth/PermissionGate";
import { ShieldCheck } from "lucide-react";
import { useSelector } from "react-redux";


const columns = [
  { key: "branch", label: "Branch" },
  { key: "channel", label: "Channel" },
  {
    key: "status",
    label: "Status",
    render: (value) => {
      const status = String(value || "").toLowerCase();
      const classes =
        status === "completed"
          ? "bg-emerald-100 text-emerald-800"
          : status === "ready"
            ? "bg-emerald-100 text-emerald-800"
            : status === "in_kitchen"
              ? "bg-amber-100 text-amber-800"
              : status === "pending"
                ? "bg-sky-100 text-sky-800"
                : status === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800";

      return (
        <Badge variant="secondary" className={classes}>
          {value}
        </Badge>
      );
    },
  },
  { key: "itemsSummary", label: "Total Items" },
  { key: "total", label: "Total" },
  {key: "time", label: "Time"},
];

export default function Orders() {
  const user = useSelector((state) => state.auth.user);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewOrderDetails, setViewOrderDetails] = useState(false);
  const [editOrder, setEditOrder] = useState(false);
  const [takePayment, setTakePayment] = useState(false);
  const [printReceipt, setPrintReceipt] = useState(false);
  const [page, setPage] = useState(1);

  const {
    orders = [],
    totalCount = 0,
    isLoading,
    branchId,
    updateOrderStatus,
    isUpdatingOrderStatus,
  } = useOrdersViewModel(page);

  const openDialog = (row, setOpen) => {
    setSelectedOrder(row);
    setOpen(true);
  };

  console.log(user);
  
  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading orders...</div>;
  }

  
  return (
    <>


      {user.role === "admin" && !branchId ? (
        <div className="rounded-lg border p-10 text-center text-muted-foreground space-y-3">
          <AlertCircle className="mx-auto h-8 w-8" />
          <p>Select a branch to start fetching orders.</p>
        </div>
      ) : (
      <EntityManagementCard
        title="Orders"
        description="Build orders with menu items."
        data={orders}
        columns={columns}
        pagination={{
          page: page,
          pageSize: 10,
          total: totalCount,
          onPageChange: setPage
        }}
        rowActions={{
          label: (row) => row.id,
          items: (row) => [
            {
              label: "View Order Details",
              icon: <Eye className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setViewOrderDetails),
            },
            {
              label: "Edit Order",
              icon: <FilePenLine className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setEditOrder),
            },
            {
              label: "Take Payment",
              icon: <BadgeDollarSign className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setTakePayment),
            },
            ...(String(row.status).toLowerCase() === "pending"
              ? [
                  {
                    label: "Mark as Ready",
                    icon: <ReceiptText className="h-4 w-4" />,
                    onClick: async (selectedRow) => {
                      await updateOrderStatus({
                        id: selectedRow.id,
                        status: "ready",
                      });
                    },
                  },
                  {
                    label: "Cancel Order",
                    icon: <AlertCircle className="h-4 w-4" />,
                    onClick: async (selectedRow) => {
                      await updateOrderStatus({
                        id: selectedRow.id,
                        status: "cancelled",
                      });
                    },
                  },
                ]
              : []),
            {
              label: "Print Receipt",
              icon: <ReceiptText className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setPrintReceipt),
            },
          ],
        }}
      />
      )}

      {isUpdatingOrderStatus ? <div className="sr-only">Updating order status...</div> : null}

      <Dialog open={viewOrderDetails} onOpenChange={setViewOrderDetails}>
        <DialogContent className="max-w-2xl max-h-[97vh] overflow-y-auto">
          <PermissionGate
            permission="view-orders"
            fallback={<div className="p-8 text-center text-muted-foreground grid place-items-center"><ShieldCheck className="h-8 w-8 mb-2" />You do not have permission to view order details.</div>}
          >
            <DialogHeader>
              <DialogTitle>Order Receipt</DialogTitle>
              <DialogDescription>Professional receipt view for order {selectedOrder?.id}</DialogDescription>
            </DialogHeader>
            <ReceiptPreview order={selectedOrder} />
            <DialogFooter>
              <Button type="button" onClick={() => setViewOrderDetails(false)}>Close</Button>
            </DialogFooter>
          </PermissionGate>
        </DialogContent>
      </Dialog>

      <Dialog open={editOrder} onOpenChange={setEditOrder}>
        <DialogContent>
          <PermissionGate
            permission="manage-orders"
            fallback={<div className="p-8 text-center text-muted-foreground grid place-items-center"><ShieldCheck className="h-8 w-8 mb-2" />You do not have permission to edit orders.</div>}
          >
            <DialogHeader>
              <DialogTitle>Edit Order</DialogTitle>
              <DialogDescription>{selectedOrder?.id}</DialogDescription>
            </DialogHeader>
            <OrderSummary order={selectedOrder} />
            <EditOrderPanel />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditOrder(false)}>Cancel</Button>
              <Button type="button" onClick={() => setEditOrder(false)}>Save Changes</Button>
            </DialogFooter>
          </PermissionGate>
        </DialogContent>
      </Dialog>

      <Dialog open={takePayment} onOpenChange={setTakePayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Take Payment</DialogTitle>
            <DialogDescription>{selectedOrder?.id}</DialogDescription>
          </DialogHeader>
          <OrderSummary order={selectedOrder} />
          <PaymentPanel order={selectedOrder} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setTakePayment(false)}>Cancel</Button>
            <Button type="button" onClick={() => setTakePayment(false)}>Confirm Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={printReceipt} onOpenChange={setPrintReceipt}>
        <DialogContent >
          <DialogHeader>
            <DialogTitle>Print Receipt</DialogTitle>
            <DialogDescription>{selectedOrder?.id}</DialogDescription>
          </DialogHeader>
          <ReceiptPreview order={selectedOrder} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPrintReceipt(false)}>Cancel</Button>
            <Button type="button" onClick={() => setPrintReceipt(false)}>Print</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
