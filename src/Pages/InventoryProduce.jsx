import {
  Eye,
  FilePenLine,
  Hammer,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import EntityManagementCard from "../components/admin/EntityManagementCard";
import ProduceFormPreview from "../components/admin/InventoryProduce/ProduceFormPreview";
import ProduceSummary from "../components/admin/InventoryProduce/ProduceSummary";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { useProductionEventsViewModel } from "../viewmodels/useProductionEventsViewModel";
import { useBranchesViewModel } from "../viewmodels/useBranchesViewModel";
import { PermissionGate } from "../components/auth/PermissionGate";
import { ShieldCheck } from "lucide-react";



const columns = [
  { key: "producedItem", label: "Produced Item" },
  { key: "quantity", label: "Qty Produced" },
  { key: "unit", label: "Unit" },
  { key: "branch", label: "Branch" },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <Badge
        variant="secondary"
        className={
          value === "Completed"
            ? "bg-emerald-100 text-emerald-800"
            : "bg-blue-100 text-blue-800"
        }
      >
        {value}
      </Badge>
    ),
  },
  { key: "date", label: "Date" },
];

export default function InventoryProduce() {
  const user = useSelector((state) => state.auth.user);
  const [selectedProduce, setSelectedProduce] = useState(null);
  const [viewBatchDetails, setViewBatchDetails] = useState(false);
  const [addProduceBatch, setAddProduceBatch] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedBranchId, setSelectedBranchId] = useState(user?.branchId ? String(user.branchId) : null);

  useEffect(() => {
    if (user?.branchId) {
      setSelectedBranchId(String(user.branchId));
    }
  }, [user?.branchId]);

  const activeBranchId = user?.branchId ? String(user.branchId) : selectedBranchId;
  const { branches, isLoading: isLoadingBranches } = useBranchesViewModel(1);

  const {
    productionEvents,
    totalCount,
    isLoading,
    deleteEvent,
  } = useProductionEventsViewModel(page, branches);

  const openDialog = (row, setOpen) => {
    setSelectedProduce(row);
    setOpen(true);
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this production event?")) {
      try {
        await deleteEvent(id);
      } catch (error) {
        console.error("Failed to delete production event", error);
      }
    }
  };

  if (isLoading && !productionEvents.length) {
    return <div className="p-8 text-center text-muted-foreground">Loading production events...</div>;
  }

  if (!activeBranchId) {
    return (
      <div className="grid min-h-[60vh] place-items-center p-8 text-center">
        <div className="w-full max-w-md space-y-4 rounded-xl border bg-background p-6 shadow-sm">
          <div className="space-y-2">
            <ShieldCheck className="mx-auto h-8 w-8 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Select a branch first</h2>
            <p className="text-sm text-muted-foreground">
              Choose the branch context before logging a production event.
            </p>
          </div>

          {isLoadingBranches ? (
            <div className="text-sm text-muted-foreground">Loading branches...</div>
          ) : (
            <Select value="" onValueChange={setSelectedBranchId}>
              <SelectTrigger className="h-11 w-full">
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch._id} value={branch._id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <PermissionGate
        permission="view-inventory"
        fallback={
          <div className="grid place-items-center p-12 text-center text-muted-foreground">
            <ShieldCheck className="mb-4 h-8 w-8" />
            You do not have permission to view production events.
          </div>
        }
      >
        <EntityManagementCard
          title="Production Events (Sub-Recipes)"
          description="Record prep and sub-recipes. Track new inventory generated from base raw ingredients (e.g., creating Pizza Dough from Flour and Yeast)."
          data={productionEvents}
          columns={columns}
          pagination={{
            page,
            pageSize: 10,
            total: totalCount,
            onPageChange: setPage,
          }}
          rowActions={{
            label: (row) => row.producedItem,
            items: () => [
              {
                label: "View Production Details",
                icon: <Eye className="h-4 w-4" />,
                onClick: (row) => openDialog(row, setViewBatchDetails),
              },
              {
                label: "Edit Event",
                icon: <FilePenLine className="h-4 w-4" />,
                onClick: (row) => openDialog(row, setAddProduceBatch),
              },
              {
                label: "Delete Event",
                icon: <Trash2 className="h-4 w-4" />,
                onClick: (row) => handleDeleteEvent(row.id),
              },
            ],
          }}
          Actions={{
            label: "New Production",
            icon: <Hammer className="h-4 w-4" />,
            onClick: () => {
              setSelectedProduce(null);
              setAddProduceBatch(true);
            },
          }}
        />
      </PermissionGate>

      <Dialog open={viewBatchDetails} onOpenChange={setViewBatchDetails}>
        <DialogContent>
          <PermissionGate
            permission="view-inventory"
            fallback={
              <div className="grid place-items-center p-8 text-center text-muted-foreground">
                <ShieldCheck className="mb-2 h-8 w-8" />
                You do not have permission to view production details.
              </div>
            }
          >
            <DialogHeader>
              <DialogTitle>Production Event Summary</DialogTitle>
              <DialogDescription>{selectedProduce?.producedItem}</DialogDescription>
            </DialogHeader>
            <ProduceSummary event={selectedProduce} />
            <DialogFooter>
              <Button type="button" onClick={() => setViewBatchDetails(false)}>
                Close
              </Button>
            </DialogFooter>
          </PermissionGate>
        </DialogContent>
      </Dialog>

      <Dialog open={addProduceBatch} onOpenChange={setAddProduceBatch}>
        <DialogContent className="lg:max-w-2/4 lg:h-3/4 overflow-y-auto">
          <PermissionGate
            permission="manage-stock-operations"
            fallback={
              <div className="grid place-items-center p-8 text-center text-muted-foreground">
                <ShieldCheck className="mb-2 h-8 w-8" />
                You do not have permission to manage production events.
              </div>
            }
          >
            <DialogHeader>
              <DialogTitle>{selectedProduce ? "Edit Production Event" : "Log Production Event"}</DialogTitle>
              <DialogDescription>
                {selectedProduce ? "Update the production event details" : "Record the creation of prepped items from raw materials."}
              </DialogDescription>
            </DialogHeader>
            <ProduceFormPreview
              event={selectedProduce}
              branchId={activeBranchId}
              createdBy={user?._id || user?.id}
              onSaved={() => setAddProduceBatch(false)}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddProduceBatch(false)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </PermissionGate>
        </DialogContent>
      </Dialog>
    </>
  );
}
