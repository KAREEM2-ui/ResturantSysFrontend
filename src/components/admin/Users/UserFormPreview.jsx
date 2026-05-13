import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useUserFormViewModel } from "../../../viewmodels/useUserFormViewModel";
import { useBranchesViewModel } from "../../../viewmodels/useBranchesViewModel";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {Select,SelectTrigger,SelectContent,SelectItem,SelectValue} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function UserFormPreview({ user, onSaved, onCancel, submitLabel = user ? "Save Changes" : "Add User" }) {
  const { formData, handleChange, handleSubmit, permissions, handlePermissionChange, isSaving, error, setError } = useUserFormViewModel(user, onSaved);
  const { branches } = useBranchesViewModel();

  const permissionGroups = [
    {
      name: "Dashboard & Reports",
      permissions: ["view-dashboard", "view-reports"],
    },
    {
      name: "Orders",
      permissions: ["view-orders", "manage-order-operations"],
    },
    {
      name: "Clients",
      permissions: ["view-clients", "manage-clients"],
    },
    {
      name: "Products",
      permissions: ["view-products", "manage-products"],
    },
    {
      name: "Inventory",
      permissions: ["view-inventory", "manage-inventory-items", "manage-stock-operations"],
    },
    {
      name: "Purchasing",
      permissions: ["create-purchase-orders"],
    },
    {
      name: "Users & Roles",
      permissions: ["view-users", "manage-users", "manage-user-authorities", "view-roles", "manage-roles"],
    },
    {
      name: "Branches",
      permissions: ["view-branches", "manage-branches"],
    },
    {
      name: "Promotions & Discounts",
      permissions: ["view-promotions", "manage-promotions", "view-discounts", "manage-discounts"],
    },
  ];



  
  

  return (
    <form className="space-y-4 py-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input 
            id="fullName" 
            name="fullName"
            placeholder="e.g. Ahmed Noor" 
            value={formData.fullName}
            onChange={handleChange}
            disabled={isSaving}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username" 
            name="username"
            placeholder="Enter username" 
            value={formData.username}
            onChange={handleChange}
            disabled={isSaving}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password {user && <span className="text-xs text-muted-foreground">(leave empty to keep current)</span>}</Label>
          <Input 
            id="password" 
            name="password"
            type="password" 
            placeholder="Enter password" 
            value={formData.password}
            onChange={handleChange}
            disabled={isSaving}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="branchId">Assigned Branch</Label>
          <Select value={formData.branchId} onValueChange={(value) => handleChange({ target: { name: "branchId", value } })}>
            <SelectTrigger id="branchId" disabled={isSaving}>
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
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          name="role"
          placeholder="Type role here"
          value={formData.role}
          onChange={handleChange}
          disabled={isSaving}
        />
      </div>


      <div className="space-y-3 pt-2">
        <Label>Permissions / Authorities</Label>
        <div className="space-y-4 rounded-lg border p-4 max-h-64 overflow-y-auto">
          {permissionGroups.map((group) => (
            <div key={group.name}>
              <h4 className="font-medium text-sm mb-3 text-muted-foreground">{group.name}</h4>
              <div className="grid grid-cols-2 gap-3 ml-2">
                {group.permissions.map((perm) => (
                  <div key={perm} className="flex items-start space-x-2">
                    <Checkbox 
                      id={`perm-${perm}`}
                      checked={permissions[perm] || false}
                      onCheckedChange={() => handlePermissionChange(perm)}
                      disabled={isSaving}
                    />
                    <Label htmlFor={`perm-${perm}`} className="text-xs font-normal cursor-pointer">
                      {perm.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" disabled={isSaving}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
