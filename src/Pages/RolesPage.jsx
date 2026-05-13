import { KeyRound, Plus, ShieldCheck, UserCog, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Textarea } from "../components/ui/textarea";

const teamMembers = [
  { id: "user-1", name: "Ahmed Noor", branch: "Muscat Marina" },
  { id: "user-2", name: "Fatma Ali", branch: "Sohar Avenue" },
  { id: "user-3", name: "Omar Said", branch: "Salalah Garden" },
  { id: "user-4", name: "Mariam Salim", branch: "Muscat Marina" },
  { id: "user-5", name: "Yusuf Khalid", branch: "Sohar Avenue" },
  { id: "user-6", name: "Lina Hamed", branch: "Salalah Garden" },
  { id: "user-7", name: "Said Rashid", branch: "Muscat Marina" },
  { id: "user-8", name: "Noora Mahmood", branch: "Sohar Avenue" },
  { id: "user-9", name: "Khalid Hamdan", branch: "Salalah Garden" },
  { id: "user-10", name: "Aisha Nasser", branch: "Muscat Marina" },
  { id: "user-11", name: "Hassan Malik", branch: "Sohar Avenue" },
  { id: "user-12", name: "Sara Adel", branch: "Salalah Garden" },
  { id: "user-13", name: "Majid Said", branch: "Muscat Marina" },
  { id: "user-14", name: "Huda Karim", branch: "Sohar Avenue" },
];

const permissionGroups = [
  {
    title: "Summary & Reports",
    permissions: [
      { key: "view-dashboard", label: "View Dashboard" },
      { key: "view-reports", label: "View Reports" },
    ],
  },
  {
    title: "Orders",
    permissions: [
      { key: "view-orders", label: "View Orders" },
      { key: "manage-order-operations", label: "Manage Order Operations" },
    ],
  },
  {
    title: "Clients",
    permissions: [
      { key: "view-clients", label: "View All Clients" },
      { key: "manage-clients", label: "Manage Clients" },
    ],
  },
  {
    title: "Products",
    permissions: [
      { key: "view-products", label: "View Products" },
      { key: "manage-products", label: "Manage Products & Ingredients" },
    ],
  },
  {
    title: "Inventory & Produce",
    permissions: [
      { key: "view-inventory", label: "View Inventory" },
      { key: "manage-inventory-items", label: "Manage Inventory Items" },
      { key: "manage-stock-operations", label: "Manage Stock Operations" },
      { key: "create-purchase-orders", label: "Create Purchase Orders" },
    ],
  },
  {
    title: "Users & Authorities",
    permissions: [
      { key: "view-users", label: "View All Users" },
      { key: "manage-users", label: "Manage Users" },
      { key: "manage-user-authorities", label: "Manage User Authorities" },
    ],
  },
  {
    title: "Roles",
    permissions: [
      { key: "view-roles", label: "View Roles" },
      { key: "manage-roles", label: "Manage Roles & Permissions" },
    ],
  },
  {
    title: "Branches",
    permissions: [
      { key: "view-branches", label: "View Branches" },
      { key: "manage-branches", label: "Manage Branches" },
      
    ],
  },
  {
    title: "Discounts & Coupons",
    permissions: [
      { key: "view-promotions", label: "View Discounts & Coupons" },
      { key: "manage-promotions", label: "Manage Discounts & Coupons" },
      {key : "view-discounts", label: "View Discounts" },
      {key : "manage-discounts", label: "Manage Discounts" },
    ],
  },
];

const allPermissionKeys = permissionGroups.flatMap((group) =>
  group.permissions.map((permission) => permission.key)
);

const initialRoles = [
  {
    id: "admin",
    role: "Admin",
    description: "Full control over users, operations, branches, and configurations.",
    assignedUserIds: ["user-1", "user-4", "user-7"],
    permissionKeys: allPermissionKeys,
    highlightPermissionKeys: [
      "view-dashboard",
      "view-reports",
      "view-users",
      "manage-roles",
    ],
  },
  {
    id: "manager",
    role: "Manager",
    description: "Manages daily operations, team assignments, and approvals.",
    assignedUserIds: [
      "user-1",
      "user-2",
      "user-4",
      "user-5",
      "user-7",
      "user-8",
      "user-10",
      "user-11",
      "user-13",
    ],
    permissionKeys: [
      "view-dashboard",
      "view-reports",
      "view-orders",
      "manage-order-operations",
      "take-payments",
      "view-clients",
      "manage-clients",
      "view-products",
      "manage-products",
      "view-inventory",
      "manage-inventory-items",
      "manage-stock-operations",
      "create-purchase-orders",
      "manage-produce-deliveries",
      "view-users",
      "view-branches",
      "view-promotions",
      "manage-promotions",
    ],
    highlightPermissionKeys: [
      "view-orders",
      "view-reports",
      "manage-stock-operations",
        
    ],
  },
  {
    id: "cashier",
    role: "Cashier",
    description: "Handles sales transactions, customer checkout, and receipts.",
    assignedUserIds: teamMembers.map((member) => member.id),
    permissionKeys: [
      "view-orders",
      "manage-order-operations",
      "take-payments",
      "view-clients",
      "manage-clients",
      "view-products",
    ],
    highlightPermissionKeys: [
      "view-orders",
      "manage-order-operations",
      "take-payments",
      "view-clients",
    ],
  },
];

const emptyRoleForm = {
  role: "",
  description: "",
  permissionKeys: [],
};

export default function RolesPage() {
  const [roles, setRoles] = useState(initialRoles);
  const [addRoleOpen, setAddRoleOpen] = useState(false);
  const [roleForm, setRoleForm] = useState(emptyRoleForm);
  const [manageUsersRoleId, setManageUsersRoleId] = useState(null);
  const [editPermissionsRoleId, setEditPermissionsRoleId] = useState(null);
  const [userDraft, setUserDraft] = useState([]);
  const [permissionDraft, setPermissionDraft] = useState([]);

  const permissionByKey = useMemo(() => {
    return permissionGroups
      .flatMap((group) => group.permissions)
      .reduce((permissions, permission) => {
        permissions[permission.key] = permission;
        return permissions;
      }, {});
  }, []);

  const manageUsersRole = roles.find((role) => role.id === manageUsersRoleId);
  const editPermissionsRole = roles.find((role) => role.id === editPermissionsRoleId);

  const toggleListValue = (values, value, checked) => {
    if (checked) {
      return values.includes(value) ? values : [...values, value];
    }

    return values.filter((item) => item !== value);
  };

  const getRoleHighlights = (role) => {
    const preferredHighlights = role.highlightPermissionKeys?.filter((permissionKey) =>
      role.permissionKeys.includes(permissionKey)
    );
    const highlightKeys = preferredHighlights?.length
      ? preferredHighlights.slice(0, 4)
      : role.permissionKeys.slice(0, 4);

    return highlightKeys
      .map((permissionKey) => permissionByKey[permissionKey])
      .filter(Boolean);
  };

  const handleAddRoleOpenChange = (open) => {
    setAddRoleOpen(open);

    if (!open) {
      setRoleForm(emptyRoleForm);
    }
  };

  const handleCreateRole = (event) => {
    event.preventDefault();

    const roleName = roleForm.role.trim();
    const description = roleForm.description.trim();

    if (!roleName) {
      return;
    }

    setRoles((currentRoles) => [
      ...currentRoles,
      {
        id: `role-${Date.now()}`,
        role: roleName,
        description: description || "Custom role configured for selected access controls.",
        assignedUserIds: [],
        permissionKeys: roleForm.permissionKeys,
        highlightPermissionKeys: roleForm.permissionKeys.slice(0, 4),
      },
    ]);
    setAddRoleOpen(false);
    setRoleForm(emptyRoleForm);
  };

  const openManageUsersDialog = (role) => {
    setManageUsersRoleId(role.id);
    setUserDraft(role.assignedUserIds);
  };

  const openEditPermissionsDialog = (role) => {
    setEditPermissionsRoleId(role.id);
    setPermissionDraft(role.permissionKeys);
  };

  const handleSaveUsers = () => {
    setRoles((currentRoles) =>
      currentRoles.map((role) =>
        role.id === manageUsersRoleId ? { ...role, assignedUserIds: userDraft } : role
      )
    );
    setManageUsersRoleId(null);
  };

  const handleSavePermissions = () => {
    setRoles((currentRoles) =>
      currentRoles.map((role) =>
        role.id === editPermissionsRoleId
          ? {
              ...role,
              permissionKeys: permissionDraft,
              highlightPermissionKeys: permissionDraft.slice(0, 4),
            }
          : role
      )
    );
    setEditPermissionsRoleId(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Roles & Permissions
              </CardTitle>
              <CardDescription>
                Configure access by role and manage who can perform critical operations.
              </CardDescription>
            </div>

            <Dialog open={addRoleOpen} onOpenChange={handleAddRoleOpenChange}>
              <DialogTrigger asChild>
                <Button type="button" className="w-full sm:w-auto">
                  <Plus className="h-4 w-4" />
                  Add New Role
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl">
                <form onSubmit={handleCreateRole} className="space-y-5">
                  <DialogHeader>
                    <DialogTitle>Add New Role</DialogTitle>
                    <DialogDescription>
                      Create a role and choose the permissions it can access.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="role-name">Role Name</Label>
                      <Input
                        id="role-name"
                        value={roleForm.role}
                        onChange={(event) =>
                          setRoleForm((currentForm) => ({
                            ...currentForm,
                            role: event.target.value,
                          }))
                        }
                        placeholder="Kitchen Supervisor"
                        required
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="role-description">Description</Label>
                      <Textarea
                        id="role-description"
                        value={roleForm.description}
                        onChange={(event) =>
                          setRoleForm((currentForm) => ({
                            ...currentForm,
                            description: event.target.value,
                          }))
                        }
                        placeholder="Describe what this role can manage."
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-medium">Permissions</h3>
                      <p className="text-sm text-muted-foreground">
                        Pick from the permissions used by this system.
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {permissionGroups.map((group) => (
                        <div key={group.title} className="rounded-lg border p-3">
                          <h4 className="mb-3 text-sm font-medium">{group.title}</h4>
                          <div className="space-y-3">
                            {group.permissions.map((permission) => (
                              <Label
                                key={permission.key}
                                htmlFor={`add-role-${permission.key}`}
                                className="gap-3"
                              >
                                <Checkbox
                                  id={`add-role-${permission.key}`}
                                  checked={roleForm.permissionKeys.includes(permission.key)}
                                  onCheckedChange={(checked) =>
                                    setRoleForm((currentForm) => ({
                                      ...currentForm,
                                      permissionKeys: toggleListValue(
                                        currentForm.permissionKeys,
                                        permission.key,
                                        checked === true
                                      ),
                                    }))
                                  }
                                />
                                {permission.label}
                              </Label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddRoleOpenChange(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create Role</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => (
          <Card key={role.id} className="border-border/80">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">{role.role}</CardTitle>
                  <CardDescription className="mt-1 text-sm">{role.description}</CardDescription>
                </div>
                <Badge variant="secondary">{role.permissionKeys.length} permissions</Badge>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{role.assignedUserIds.length} assigned users</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {getRoleHighlights(role).map((permission) => (
                  <Badge key={permission.key} variant="outline" className="font-normal">
                    <KeyRound className="mr-1 h-3.5 w-3.5" />
                    {permission.label}
                  </Badge>
                ))}
              </div>

              <Separator />

              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" onClick={() => openManageUsersDialog(role)}>
                  <UserCog className="h-4 w-4" />
                  Manage Users
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => openEditPermissionsDialog(role)}
                >
                  Edit Permissions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={Boolean(manageUsersRole)}
        onOpenChange={(open) => {
          if (!open) {
            setManageUsersRoleId(null);
          }
        }}
      >
        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Manage Users</DialogTitle>
            <DialogDescription>
              {manageUsersRole
                ? `Choose users assigned to the ${manageUsersRole.role} role.`
                : "Choose users assigned to this role."}
            </DialogDescription>
          </DialogHeader>

          {manageUsersRole ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{manageUsersRole.role}</Badge>
                <span className="text-sm text-muted-foreground">
                  {userDraft.length} selected users
                </span>
              </div>

              <div className="grid gap-2">
                {teamMembers.map((member) => (
                  <Label
                    key={member.id}
                    htmlFor={`manage-${manageUsersRole.id}-${member.id}`}
                    className="items-start gap-3 rounded-lg border p-3 transition hover:bg-muted/60"
                  >
                    <Checkbox
                      id={`manage-${manageUsersRole.id}-${member.id}`}
                      checked={userDraft.includes(member.id)}
                      onCheckedChange={(checked) =>
                        setUserDraft((currentDraft) =>
                          toggleListValue(currentDraft, member.id, checked === true)
                        )
                      }
                    />
                    <span className="grid gap-1">
                      <span>{member.name}</span>
                      <span className="text-xs font-normal text-muted-foreground">
                        {member.branch}
                      </span>
                    </span>
                  </Label>
                ))}
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setManageUsersRoleId(null)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveUsers}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(editPermissionsRole)}
        onOpenChange={(open) => {
          if (!open) {
            setEditPermissionsRoleId(null);
          }
        }}
      >
        <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Permissions</DialogTitle>
            <DialogDescription>
              {editPermissionsRole
                ? `Update permissions for the ${editPermissionsRole.role} role.`
                : "Update permissions for this role."}
            </DialogDescription>
          </DialogHeader>

          {editPermissionsRole ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{editPermissionsRole.role}</Badge>
                <span className="text-sm text-muted-foreground">
                  {permissionDraft.length} selected permissions
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {permissionGroups.map((group) => (
                  <div key={group.title} className="rounded-lg border p-3">
                    <h3 className="mb-3 text-sm font-medium">{group.title}</h3>
                    <div className="space-y-3">
                      {group.permissions.map((permission) => (
                        <Label
                          key={permission.key}
                          htmlFor={`permission-${editPermissionsRole.id}-${permission.key}`}
                          className="gap-3"
                        >
                          <Checkbox
                            id={`permission-${editPermissionsRole.id}-${permission.key}`}
                            checked={permissionDraft.includes(permission.key)}
                            onCheckedChange={(checked) =>
                              setPermissionDraft((currentDraft) =>
                                toggleListValue(currentDraft, permission.key, checked === true)
                              )
                            }
                          />
                          {permission.label}
                        </Label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditPermissionsRoleId(null)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSavePermissions}>
              Save Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
