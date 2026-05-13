import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { branchesService } from "@/services/branches.service";
import { useState } from "react";
import { QueryClient } from "@tanstack/react-query";
import { Button } from "reactstrap";

export default function BranchFormPreview({ branch }) {

  const [name, setName] = useState(branch?.branch || "");
  const [status, setStatus] = useState(branch?.occupancy ? "open" : "open");
  const [address, setAddress] = useState(branch?.address || "");
  const [msg, setMsg] = useState("");


  const handleAddNewBranch = async () => {
    let res = await branchesService.createBranch({
      name: name,
      address: address,
      status: status
    });

    try
    {
      setMsg("Branch added successfully.");
      QueryClient.invalidateQueries(["branches",1]);
    }
    catch(err)
    {
      setMsg("Error creating branch. Please try again.");
    }
    
  }

  return (
    <form className="space-y-4 py-4" >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="branchName">Branch Name</Label>
          <Input id="branchName" placeholder="e.g. Muscat Marina" defaultValue={branch?.branch || ""} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Operating Status</Label>
          <Select defaultValue={branch?.occupancy ? "open" : "open"} onValueChange={(value) => setStatus(value)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="closed">Closed / Under Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      

      <div className="space-y-2">
        <Label htmlFor="address">Address / Location Details</Label>
        <Textarea id="address" placeholder="Enter full address or description" defaultValue={branch?.address || ""} onChange={(e) => setAddress(e.target.value)} />
      </div>

      {msg && <div className="text-sm text-green-600">{msg}</div>}
     

      <Button  onClick={handleAddNewBranch}>Save</Button>
    </form>
  );
}
