import {
  Boxes,
  Eye,
  FilePenLine,
} from "lucide-react";
import { useState } from "react";

import EntityManagementCard from "../components/admin/EntityManagementCard";
import ItemFormPreview from "../components/admin/InventoryItems/ItemFormPreview";
import ItemSummary from "../components/admin/InventoryItems/ItemSummary";
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
import { useInventoryViewModel } from "../viewmodels/useInventoryViewModel";
import { PermissionGate } from "../components/auth/PermissionGate";
import { ShieldCheck } from "lucide-react";

const columns = [
  { key: "name", label: "Item Name" },
  { key: "unit", label: "Unit" },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <Badge
        variant="secondary"
        className={value === "OK" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}
      >
        {value || "OK"}
      </Badge>
    ),
  },
];

export default function InventoryItems() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewItemDetails, setViewItemDetails] = useState(false);
  const [editItem, setEditItem] = useState(false);
  const [page, setPage] = useState(1);

  const { inventoryItems, totalCount, isLoading, saveInventoryItem, isSaving } = useInventoryViewModel(page);

  const openDialog = (row, setOpen) => {
    setSelectedItem(row);
    setOpen(true);
  };

  return (
    <>
      <EntityManagementCard
        title="Inventory Items"
        description="Track raw items with Foodics-inspired actions for stock adjustments, counts, purchase orders, and transfers."
        data={inventoryItems}
        columns={columns}
        pagination={{
          page: page,
          pageSize: 10,
          total: totalCount,
          onPageChange: setPage
        }}
        rowActions={{
          label: (row) => row.name || row.item,
          items: () => [
            {
              label: "View Item Details",
              icon: <Eye className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setViewItemDetails),
            },
            {
              label: "Edit Item",
              icon: <FilePenLine className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setEditItem),
            }
          ],
        }}
        Actions={{
          label: "Add Item",
          icon: <Boxes className="h-4 w-4" />,
          onClick: () => {
            setSelectedItem(null);
            setEditItem(true);
          }
        }}
      />

      <Dialog open={viewItemDetails} onOpenChange={setViewItemDetails}>
        <DialogContent className="lg:max-w-2/4 lg:h-3/4 overflow-y-auto">
          <PermissionGate
            permission="view-inventory"
            fallback={<div className="p-8 text-center text-muted-foreground grid place-items-center"><ShieldCheck className="h-8 w-8 mb-2" />You do not have permission to view inventory details.</div>}
          >
            <DialogHeader>
              <DialogTitle>Item Details</DialogTitle>
              <DialogDescription>{selectedItem?.name || selectedItem?.item}</DialogDescription>
            </DialogHeader>
            <ItemSummary item={selectedItem} />
            <DialogFooter>
              <Button type="button" onClick={() => setViewItemDetails(false)}>Close</Button>
            </DialogFooter>
          </PermissionGate>
        </DialogContent>
      </Dialog>

      <Dialog open={editItem} onOpenChange={setEditItem}>
        <DialogContent className="lg:max-w-2/4 lg:h-3/4 overflow-y-auto">
          <PermissionGate
            permission="manage-inventory"
            fallback={<div className="p-8 text-center text-muted-foreground grid place-items-center"><ShieldCheck className="h-8 w-8 mb-2" />You do not have permission to manage inventory items.</div>}
          >
            <DialogHeader>
              <DialogTitle>{selectedItem ? "Edit Item" : "Add New Item"}</DialogTitle>
              <DialogDescription>{selectedItem ? (selectedItem.name || selectedItem.item) : "Create a new inventory item to track."}</DialogDescription>
            </DialogHeader>
            <ItemFormPreview
              item={selectedItem}
              inventoryItems={inventoryItems}
              isSaving={isSaving}
              onCancel={() => setEditItem(false)}
              onSave={async (payload) => {
                const itemId = selectedItem?._id || selectedItem?.id || null;
                await saveInventoryItem(itemId, payload);
                setEditItem(false);
              }}
            />
          </PermissionGate>
        </DialogContent>
      </Dialog>

      


     

      
    </>
  );
}
