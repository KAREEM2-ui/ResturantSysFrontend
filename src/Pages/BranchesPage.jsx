import {
  ArrowRightLeft,
  Eye,
  FilePenLine,
  LayoutGrid,
  ReceiptText,
  Users,
} from "lucide-react";
import { useState } from "react";

import BranchFormPreview from "../components/admin/Branches/BranchFormPreview";
import EntityManagementCard from "../components/admin/EntityManagementCard";
import InventoryTransferPanel from "../components/admin/Branches/InventoryTransferPanel";
import SalesReportPanel from "../components/admin/Branches/SalesReportPanel";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useBranchesViewModel } from "../viewmodels/useBranchesViewModel";
import { PermissionGate } from "../components/auth/PermissionGate";
import { ShieldCheck } from "lucide-react";

const columns = [
  { key: "name", label: "Branch Name" },
  { key: "status", label: "Status" },
  { key: "address", label: "Address" },
];

export default function BranchesPage() {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [addBranch, setAddBranch] = useState(false);
  const [viewBranch, setViewBranch] = useState(false);
  const [editBranch, setEditBranch] = useState(false);
  const [manageTeam, setManageTeam] = useState(false);
  const [openSalesReport, setOpenSalesReport] = useState(false);
  const [manageLayout, setManageLayout] = useState(false);
  const [transferInventory, setTransferInventory] = useState(false);
  const [page, setPage] = useState(1);

  const { branches, totalCount, isLoading } = useBranchesViewModel(page);

  const openDialog = (row, setOpen) => {
    setSelectedBranch(row);
    setOpen(true);
  };

  return (
    <div className="space-y-4">
      <EntityManagementCard
        title="Branches"
        description="Manage locations with operational actions for branch teams, seating layout, reporting, and inventory transfers."
        data={branches}
        columns={columns}
        pagination={{
          page: page,
          pageSize: 10,
          total: totalCount,
          onPageChange: setPage
        }}
        rowActions={{
          label: (row) => row.name,
          items: () => [
            {
              label: "Edit Branch",
              icon: <FilePenLine className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setEditBranch),
            },
            {
              label: "Manage Team",
              icon: <Users className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setManageTeam),
            },
            {
              label: "Manage Tables Layout",
              icon: <LayoutGrid className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setManageLayout),
            },
            {
              label: "Open Sales Report",
              icon: <ReceiptText className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setOpenSalesReport),
            },
            {
              label: "Transfer Inventory",
              icon: <ArrowRightLeft className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setTransferInventory),
            },
          ]
        }}
        Actions={{
          label: "Add Branch",
          icon: <Users className="h-4 w-4" />,
          onClick: () => setAddBranch(true),
        }}
      />

      <Dialog open={addBranch} onOpenChange={setAddBranch}>
        <DialogContent>
          <PermissionGate
            permission="manage-branches"
            fallback={<div className="p-8 text-center text-muted-foreground grid place-items-center"><ShieldCheck className="h-8 w-8 mb-2" />You do not have permission to add branches.</div>}
          >
            <DialogHeader>
              <DialogTitle>Add Branch</DialogTitle>
              <DialogDescription>Create a new operating location.</DialogDescription>
            </DialogHeader>
            <BranchFormPreview />
            
          </PermissionGate>
        </DialogContent>
      </Dialog>

      <Dialog open={editBranch} onOpenChange={setEditBranch}>
        <DialogContent>
          <PermissionGate
            permission="manage-branches"
            fallback={<div className="p-8 text-center text-muted-foreground grid place-items-center"><ShieldCheck className="h-8 w-8 mb-2" />You do not have permission to edit this branch.</div>}
          >
            <DialogHeader>
              <DialogTitle>Edit Branch</DialogTitle>
              <DialogDescription>{selectedBranch?.branch || selectedBranch?.name}</DialogDescription>
            </DialogHeader>
            <BranchFormPreview branch={selectedBranch} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditBranch(false)}>Cancel</Button>
              <Button type="button" onClick={() => setEditBranch(false)}>Save Changes</Button>
            </DialogFooter>
          </PermissionGate>
        </DialogContent>
      </Dialog>

    

    
      
    </div>
  );
}
