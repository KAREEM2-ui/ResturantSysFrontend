import { Eye, Package } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import BranchInventorySummary from "../components/admin/BranchInventory/BranchInventorySummary";
import EntityManagementCard from "../components/admin/EntityManagementCard";
import { PermissionGate } from "../components/auth/PermissionGate";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useBranchesViewModel } from "../viewmodels/useBranchesViewModel";
import { useBranchInventoryViewModel } from "../viewmodels/useBranchInventoryViewModel";
import { ShieldCheck } from "lucide-react";
import { selectBranchId, setSelectedBranchId } from "../features_State/appConfigSlice";

const columns = [
  { key: "item", label: "Item Name" },
  {
    key: "hasIngredients",
    label: "Ingredients",
    render: (value) =>
      value ? (
        <Badge className="bg-emerald-100 text-emerald-800">Yes</Badge>
      ) : (
        <Badge className="bg-muted/10 text-muted-foreground">No</Badge>
      ),
  },
  { key: "quantity", label: "Quantity" },
  { key: "unit", label: "Unit" },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <Badge
        variant="secondary"
        className={
          value === "OK"
            ? "bg-emerald-100 text-emerald-800"
            : value === "LOW"
              ? "bg-amber-100 text-amber-800"
              : "bg-red-100 text-red-800"
        }
      >
        {value || "OK"}
      </Badge>
    ),
  },
];

export default function BranchInventoryPage() {
  const authUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewItemDetails, setViewItemDetails] = useState(false);
  const [page, setPage] = useState(1);

  const { branches } = useBranchesViewModel();
  const selectedBranchId = useSelector(selectBranchId);
  const { branchInventory, totalCount } = useBranchInventoryViewModel(page);

  const openDialog = (row, setOpen) => {
    setSelectedItem(row);
    setOpen(true);
  };

  return (
    <>
      {!authUser?.branchId && (
        <div className="mb-6 flex items-end gap-4">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-muted-foreground">
              Select Branch
            </label>
            <Select value={selectedBranchId || ""} onValueChange={(value) => dispatch(setSelectedBranchId(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a branch to view inventory" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch._id} value={String(branch._id)}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {selectedBranchId ? (
        <EntityManagementCard
          title="Branch Inventory"
          description="Manage stock levels for items at the selected branch. Adjust quantities and transfer between branches."
          data={branchInventory}
          columns={columns}
          pagination={{
            page,
            pageSize: 10,
            total: totalCount,
            onPageChange: setPage,
          }}
          rowActions={{
            label: (row) => row.item,
            items: () => [
              {
                label: "View Details",
                icon: <Eye className="h-4 w-4" />,
                onClick: (row) => openDialog(row, setViewItemDetails),
              },
            ],
          }}
        />
      ) : (
        <div className="rounded-lg border border-dashed border-muted-foreground/25 p-12 text-center">
          <Package className="mb-4 mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="text-muted-foreground">Select a branch to view and manage its inventory</p>
        </div>
      )}

      <Dialog open={viewItemDetails} onOpenChange={setViewItemDetails}>
        <DialogContent className="lg:max-w-2/4 lg:h-3/4 overflow-y-auto">
          <PermissionGate
            permission="view-inventory"
            fallback={
              <div className="grid place-items-center p-8 text-center text-muted-foreground">
                <ShieldCheck className="mb-2 h-8 w-8" />
                You do not have permission to view inventory details.
              </div>
            }
          >
            <DialogHeader>
              <DialogTitle>Stock Details</DialogTitle>
              <DialogDescription>
                {selectedItem?.item} at {selectedItem?.branch}
              </DialogDescription>
            </DialogHeader>
            <BranchInventorySummary item={selectedItem} branches={branches} />
            <DialogFooter>
              <Button type="button" onClick={() => setViewItemDetails(false)}>
                Close
              </Button>
            </DialogFooter>
          </PermissionGate>
        </DialogContent>
      </Dialog>
    </>
  );
}
