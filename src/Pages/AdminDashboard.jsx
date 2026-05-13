import React, { useState } from "react";
import { format } from "date-fns";
import {
  Activity,
  CalendarDays,
  MapPin,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const stats = [
  { label: "Orders Today", value: "184", change: "+12%", icon: ShoppingBag },
  { label: "Active Products", value: "68", change: "+5 new", icon: Package },
  { label: "VIP Clients", value: "27", change: "+3 this week", icon: Users },
  { label: "Live Operations", value: "9", change: "2 low stock", icon: Activity },
];

const tasks = [
  { title: "Products missing ingredient mapping", count: 4, tone: "bg-amber-100 text-amber-800" },
  { title: "Produce batches that need allocation", count: 6, tone: "bg-blue-100 text-blue-800" },
  { title: "Clients pending loyalty follow-up", count: 3, tone: "bg-emerald-100 text-emerald-800" },
];

const recentActivity = [
  { title: "Truffle Pasta updated", detail: "Recipe cost changed and two ingredients were re-mapped." },
  { title: "Tomatoes batch received", detail: "30 kg allocated to soups, salads, and sandwich prep." },
  { title: "Aisha Ali promoted to VIP", detail: "Client profile updated after threshold spend was reached." },
];

export default function AdminDashboard() {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Summary Filters</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <Label
                htmlFor="branch-filter"
                className="flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground"
              >
                <MapPin className="h-3.5 w-3.5" /> Branch
              </Label>
              <Select defaultValue="all">
                <SelectTrigger id="branch-filter" className="h-11 w-full">
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  <SelectItem value="muscat">Muscat Marina</SelectItem>
                  <SelectItem value="sohar">Sohar Avenue</SelectItem>
                  <SelectItem value="salalah">Salalah Garden</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="date-preset"
                className="flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground"
              >
                <CalendarDays className="h-3.5 w-3.5" /> Date Preset
              </Label>
              <Select defaultValue="today">
                <SelectTrigger id="date-preset" className="h-11 w-full">
                  <SelectValue placeholder="Today" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="month">This month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Start Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-11 justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                End Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-11 justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      

    </div>
  );
}
