import {
  Clock3,
  Eye,
  FilePenLine,
  Percent,
  Store,
  Users,
} from "lucide-react";
import { useState } from "react";

import AssignmentPanel from "../components/admin/Discounts/AssignmentPanel";
import DiscountFormPreview from "../components/admin/Discounts/DiscountFormPreview";
import DiscountSummary from "../components/admin/Discounts/DiscountSummary";
import EntityManagementCard from "../components/admin/EntityManagementCard";
import RatePreviewPanel from "../components/admin/Discounts/RatePreviewPanel";
import TimedEventPanel from "../components/admin/Discounts/TimedEventPanel";
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

const discountRows = [
  {
    id: "disc-1",
    name: "Dinner Combo",
    rate: "15%",
    status: "Active",
    ends: "2026-04-25",
    scopeSummary: "3 targets",
  },
  {
    id: "disc-2",
    name: "Student Deal",
    rate: "10%",
    status: "Scheduled",
    ends: "2026-05-01",
    scopeSummary: "2 targets",
  },
  {
    id: "disc-3",
    name: "Weekend Family",
    rate: "20%",
    status: "Active",
    ends: "2026-04-30",
    scopeSummary: "4 targets",
  },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "rate", label: "Rate" },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <Badge
        variant="secondary"
        className={
          value === "Active"
            ? "bg-emerald-100 text-emerald-800"
            : "bg-blue-100 text-blue-800"
        }
      >
        {value}
      </Badge>
    ),
  },
  { key: "ends", label: "Ends" },
  { key: "scopeSummary", label: "Scope" },
];

export default function DiscountsPage() {
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [viewCampaign, setViewCampaign] = useState(false);
  const [editDiscount, setEditDiscount] = useState(false);
  const [assignBranches, setAssignBranches] = useState(false);
  const [assignSegment, setAssignSegment] = useState(false);
  const [setTimedEvent, setSetTimedEvent] = useState(false);
  const [previewRate, setPreviewRate] = useState(false);

  const openDialog = (row, setOpen) => {
    setSelectedDiscount(row);
    setOpen(true);
  };

  return (
    <>
      <EntityManagementCard
        title="Discounts"
        description="Create branch, product, and customer-category discounts with timed-event style targeting inspired by Foodics."
        data={discountRows}
        columns={columns}
        rowActions={{
          label: (row) => row.name,
          items: () => [
            {
              label: "View Campaign",
              icon: <Eye className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setViewCampaign),
            },
            {
              label: "Edit Discount",
              icon: <FilePenLine className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setEditDiscount),
            },
            {
              label: "Assign to Branches",
              icon: <Store className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setAssignBranches),
            },
            {
              label: "Assign to Customer Segment",
              icon: <Users className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setAssignSegment),
            },
            {
              label: "Set Timed Event",
              icon: <Clock3 className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setSetTimedEvent),
            },
            {
              label: "Preview Applied Rate",
              icon: <Percent className="h-4 w-4" />,
              onClick: (row) => openDialog(row, setPreviewRate),
            },
          ],
        }}
        isSelectable={false}
      />

      <Dialog open={viewCampaign} onOpenChange={setViewCampaign}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Campaign</DialogTitle>
            <DialogDescription>{selectedDiscount?.name}</DialogDescription>
          </DialogHeader>
          <DiscountSummary discount={selectedDiscount} />
          <DialogFooter>
            <Button type="button" onClick={() => setViewCampaign(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDiscount} onOpenChange={setEditDiscount}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Discount</DialogTitle>
            <DialogDescription>{selectedDiscount?.name}</DialogDescription>
          </DialogHeader>
          <DiscountSummary discount={selectedDiscount} />
          <DiscountFormPreview />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditDiscount(false)}>Cancel</Button>
            <Button type="button" onClick={() => setEditDiscount(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={assignBranches} onOpenChange={setAssignBranches}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign to Branches</DialogTitle>
            <DialogDescription>{selectedDiscount?.name}</DialogDescription>
          </DialogHeader>
          <AssignmentPanel discount={selectedDiscount} target="branches" />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAssignBranches(false)}>Cancel</Button>
            <Button type="button" onClick={() => setAssignBranches(false)}>Save Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={assignSegment} onOpenChange={setAssignSegment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign to Customer Segment</DialogTitle>
            <DialogDescription>{selectedDiscount?.name}</DialogDescription>
          </DialogHeader>
          <AssignmentPanel discount={selectedDiscount} target="customer segments" />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAssignSegment(false)}>Cancel</Button>
            <Button type="button" onClick={() => setAssignSegment(false)}>Save Assignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={setTimedEvent} onOpenChange={setSetTimedEvent}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Timed Event</DialogTitle>
            <DialogDescription>{selectedDiscount?.name}</DialogDescription>
          </DialogHeader>
          <TimedEventPanel discount={selectedDiscount} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setSetTimedEvent(false)}>Cancel</Button>
            <Button type="button" onClick={() => setSetTimedEvent(false)}>Save Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={previewRate} onOpenChange={setPreviewRate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preview Applied Rate</DialogTitle>
            <DialogDescription>{selectedDiscount?.name}</DialogDescription>
          </DialogHeader>
          <RatePreviewPanel discount={selectedDiscount} />
          <DialogFooter>
            <Button type="button" onClick={() => setPreviewRate(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
