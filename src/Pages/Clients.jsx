import {
  Eye,
  FilePenLine,
  Gift,
  ShoppingBag,
  UserRoundCog,
} from "lucide-react";
import { useState } from "react";


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

import { lazy,Suspense } from "react";


import EntityManagementCard from "../components/admin/EntityManagementCard";
import { useClientsViewModel } from "../viewmodels/useClientsViewModel";

const ClientFormPreview = lazy(() => import("../components/admin/Clients/ClientFormPreview"));
const ClientSummary = lazy(() => import("../components/admin/Clients/ClientSummary"));
const LoyaltyPanel = lazy(() => import("../components/admin/Clients/LoyaltyPanel"));
const OrderHistoryPanel = lazy(() => import("../components/admin/Clients/OrderHistoryPanel"));
const PreferencesPanel = lazy(() => import("../components/admin/Clients/PreferencesPanel"));

const columns = [
  { key: "name", label: "Client" },
  { key: "visits", label: "Visits" },
  {
    key: "tier",
    label: "Tier",
    render: (value) => (
      <Badge
        variant="secondary"
        className={
          value === "VIP"
            ? "bg-amber-100 text-amber-800"
            : "bg-slate-200 text-slate-700"
        }
      >
        {value}
      </Badge>
    ),
  },
  { key: "spend", label: "Total Spend" },
  {
    key: "favoritesSummary",
    label: "Preferences",
    render: (value) => <span className="text-muted-foreground">{value}</span>,
  },
];

export default function Clients() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [addClient, setAddClient] = useState(false);
  const [viewClientProfile, setViewClientProfile] = useState(false);
  const [editClient, setEditClient] = useState(false);
  const [manageLoyalty, setManageLoyalty] = useState(false);
  const [openOrderHistory, setOpenOrderHistory] = useState(false);
  const [updatePreferences, setUpdatePreferences] = useState(false);
  const [page, setPage] = useState(1);

  

  const {
    clients,
    totalCount,
  } = useClientsViewModel(page);

  const openDialog = (row, setOpen) => {
    setSelectedClient(row);
    setOpen(true);
  };

  return (
    <div className="space-y-4">
      <EntityManagementCard
        title="Clients"
        description="Manage the full client cycle: add clients, store preferences, and expose row-level actions for loyalty and account operations."
        data={clients}
        isSelectable={false}
        columns={columns}
        pagination={{
          pageSize: 10,
          total: totalCount,
          page,
          onPageChange: setPage,
        }}
        rowActions={{
          label: (row) => row.name,
          items: () => [
            {
              label: "View Client Profile",
              icon: <Eye className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setViewClientProfile),
            },
            {
              label: "Edit Client",
              icon: <FilePenLine className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setEditClient),
            },
            {
              label: "Manage Loyalty",
              icon: <Gift className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setManageLoyalty),
            },
            {
              label: "Open Order History",
              icon: <ShoppingBag className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setOpenOrderHistory),
            },
            {
              label: "Update Preferences",
              icon: <UserRoundCog className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setUpdatePreferences),
            },
          ],
        }}
        Actions={{
          label: "Add Client",
          icon: <UserRoundCog className="h-4 w-4" />,
          onClick: () => setAddClient(true),
        }}
      />

      <Dialog open={addClient} onOpenChange={setAddClient}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Client</DialogTitle>
            <DialogDescription>Create a client profile and preferences.</DialogDescription>
          </DialogHeader>
          <Suspense fallback="Loading...">
            <ClientFormPreview />
          </Suspense>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAddClient(false)}>Cancel</Button>
            <Button type="button" onClick={() => setAddClient(false)}>Add Client</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={viewClientProfile} onOpenChange={setViewClientProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Client Profile</DialogTitle>
            <DialogDescription>{selectedClient?.name}</DialogDescription>
          </DialogHeader>
          <ClientSummary client={selectedClient} />
          <DialogFooter>
            <Button type="button" onClick={() => setViewClientProfile(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editClient} onOpenChange={setEditClient}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
            <DialogDescription>{selectedClient?.name}</DialogDescription>
          </DialogHeader>
          <ClientSummary client={selectedClient} />
          <Suspense fallback="Loading...">
            <ClientFormPreview />
          </Suspense>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditClient(false)}>Cancel</Button>
            <Button type="button" onClick={() => setEditClient(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={manageLoyalty} onOpenChange={setManageLoyalty}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Loyalty</DialogTitle>
            <DialogDescription>{selectedClient?.name}</DialogDescription>
          </DialogHeader>
          <Suspense fallback="Loading...">
            <LoyaltyPanel client={selectedClient} />
          </Suspense>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setManageLoyalty(false)}>Cancel</Button>
            <Button type="button" onClick={() => setManageLoyalty(false)}>Save Loyalty</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openOrderHistory} onOpenChange={setOpenOrderHistory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order History</DialogTitle>
            <DialogDescription>{selectedClient?.name}</DialogDescription>
          </DialogHeader>
          <Suspense fallback="Loading...">
            <OrderHistoryPanel client={selectedClient} />
          </Suspense>
          <DialogFooter>
            <Button type="button" onClick={() => setOpenOrderHistory(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={updatePreferences} onOpenChange={setUpdatePreferences}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Preferences</DialogTitle>
            <DialogDescription>{selectedClient?.name}</DialogDescription>
          </DialogHeader>
          <Suspense fallback="Loading...">
            <PreferencesPanel client={selectedClient} />
          </Suspense> 
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setUpdatePreferences(false)}>Cancel</Button>
            <Button type="button" onClick={() => setUpdatePreferences(false)}>Save Preferences</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
