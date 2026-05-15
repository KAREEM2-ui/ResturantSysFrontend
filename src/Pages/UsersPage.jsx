import {
  Eye,
  FileKey2,
  FilePenLine,
  KeyRound,
  Plus,
  ShieldCheck,
  UserX,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import AuthoritiesSummary from "../components/admin/Users/AuthoritiesSummary";
import EntityManagementCard from "../components/admin/EntityManagementCard";
import UserFormPreview from "../components/admin/Users/UserFormPreview";
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
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useUsersViewModel } from "../viewmodels/useUsersViewModel";
import { useBranchesViewModel } from "../viewmodels/useBranchesViewModel";
import { useCan } from "../hooks/useCan";
import { PermissionGate } from "../components/auth/PermissionGate";
import { selectBranchId } from "../features_State/appConfigSlice";

const columns = [
  { key: "fullName", label: "Name" },
  { key: "username", label: "Username" },
  { key: "role", label: "Role" },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <Badge
        variant="secondary"
        className={value === "active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}
      >
        {value === "active" ? "Active" : "Inactive"}
      </Badge>
    ),
  },
];

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [addUser, setAddUser] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [manageAuthorities, setManageAuthorities] = useState(false);
  const [deactivateUser, setDeactivateUser] = useState(false);
  const [page, setPage] = useState(1);

  const selectedBranch = useSelector(selectBranchId) || "all";
  const { users, totalCount, isLoading } = useUsersViewModel(page);
  const { branches } = useBranchesViewModel();

  const filteredRows = useMemo(() => {
    if (selectedBranch === "all") {
      return users;
    }
    return users.filter((row) => String(row.branchId?._id || row.branchId || "") === String(selectedBranch));
  }, [selectedBranch, users]);

  const openDialog = (row, setOpen) => {
    setSelectedUser(row);
    setOpen(true);
  };

  return (
    <div className="space-y-4">
        

      <EntityManagementCard
        title="Users"
        description="Manage staff, branch assignment, and authority controls similar to Foodics role and approval workflows."
        data={filteredRows}
        columns={columns}
        pagination={{
          page: page,
          pageSize: 10,
          total: totalCount,
          onPageChange: setPage
        }}
        rowActions={{
          label: (row) => row.fullName || row.username,
          items: () => [
            {
              label: "Edit User",
              icon: <FilePenLine className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setEditUser),
            },
            {
              label: "Deactivate User",
              icon: <UserX className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setDeactivateUser),
            },
            {
              label: "Manage Authorities",
              icon: <ShieldCheck className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setManageAuthorities),
            }
          ]
        }}
        Actions={{
          label: "Add User",
          icon: <Plus className="h-4 w-4" />,
          onClick: () => setAddUser(true),
        }}
      />

      <Dialog open={addUser} onOpenChange={setAddUser}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <PermissionGate
            permission="manage-users"
            fallback={<div className="p-8 text-center text-muted-foreground grid place-items-center"><ShieldCheck className="h-8 w-8 mb-2" />You do not have permission to add users.</div>}
          >
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription>Create a new staff member.</DialogDescription>
            </DialogHeader>
            <UserFormPreview onSaved={() => setAddUser(false)} onCancel={() => setAddUser(false)} submitLabel="Add User" />
          </PermissionGate>
        </DialogContent>
      </Dialog>

      <Dialog open={editUser} onOpenChange={setEditUser}>
        <DialogContent>
          <PermissionGate
            permission="manage-users"
            fallback={<div className="p-8 text-center text-muted-foreground grid place-items-center"><ShieldCheck className="h-8 w-8 mb-2" />You do not have permission to edit users.</div>}
          >
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>{selectedUser?.fullName || selectedUser?.username}</DialogDescription>
            </DialogHeader>
            <UserFormPreview user={selectedUser} onSaved={() => setEditUser(false)} onCancel={() => setEditUser(false)} submitLabel="Save Changes" />
          </PermissionGate>
        </DialogContent>
      </Dialog>

      <Dialog open={manageAuthorities} onOpenChange={setManageAuthorities}>
        <DialogContent maxW="max-w-2xl">
          <PermissionGate
            permission="manage-user-authorities"
            fallback={<div className="p-8 text-center text-muted-foreground grid place-items-center"><ShieldCheck className="h-8 w-8 mb-2" />You do not have permission to manage user authorities.</div>}
          >
            <DialogHeader>
              <DialogTitle>Manage Authorities</DialogTitle>
              <DialogDescription>{selectedUser?.fullName || selectedUser?.username}</DialogDescription>
            </DialogHeader>
            <AuthoritiesSummary user={selectedUser} />
            <DialogFooter>
              <Button type="button" onClick={() => setManageAuthorities(false)}>Close</Button>
            </DialogFooter>
          </PermissionGate>
        </DialogContent>
      </Dialog>
    </div>
  );
}
