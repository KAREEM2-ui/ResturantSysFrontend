import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight, Settings2 } from "lucide-react";
import { useCan } from "../../hooks/useCan";
import { useBranchesViewModel } from "../../viewmodels/useBranchesViewModel";
import { useDispatch, useSelector } from "react-redux";

import { sectionRoutes } from "./admin-config";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { selectBranchId, setSelectedBranchId } from "../../features_State/appConfigSlice";

function getRoutePath(route) {
  return `/admin/${String(route.path).replace(/^\/+/, "")}`;
}

function getFlatRoutes() {
  return sectionRoutes.flatMap((section) => {
    if (section.path) {
      return [section];
    }

    return Array.isArray(section.paths) ? section.paths : [];
  });
}

function AdminLayout() {
  const location = useLocation();
  const activeRoute = getFlatRoutes().find((route) => location.pathname === getRoutePath(route));

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur lg:px-6">
            <SidebarTrigger />
            {activeRoute?.icon ? (
              <span className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground sm:flex">
                {activeRoute.icon}
              </span>
            ) : null}
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Back office</p>
              <h2 className="truncate text-base font-semibold">{activeRoute?.label ?? "Summary"}</h2>
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState({});
  const { isMobile, setOpenMobile } = useSidebar();
  const can = useCan();
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  const branchId = useSelector(selectBranchId);
  const { branches, isLoading: isLoadingBranches } = useBranchesViewModel(1);

  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  useEffect(() => {

    // assign branchid if user has only one branch
    if(authUser?.branchId !== undefined && authUser?.branchId !== null)
    {
        dispatch(setSelectedBranchId(authUser.branchId));
    }

  },[])


  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="border-b border-sidebar-border p-3">
        <div className="flex items-center justify-between rounded-lg border border-sidebar-border bg-background px-3 py-2.5">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Restaurant Admin
            </p>
            <h1 className="mt-1 truncate text-lg font-semibold">Back office</h1>
          </div>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
            <Settings2 className="h-4 w-4" />
          </span>
        </div>

        {authUser?.role === "admin" && !authUser?.branchId ? (
          <div className="mt-3 rounded-lg border border-sidebar-border bg-background p-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Branch Context
            </p>
            <Select value={branchId || ""} onValueChange={(value) => dispatch(setSelectedBranchId(value))}>
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder={isLoadingBranches ? "Loading branches..." : "Select branch"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Branches</SelectLabel>
                  {branches.map((branch) => (
                    <SelectItem key={branch._id} value={String(branch._id)}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sectionRoutes.map((section) => {
                if (section.path) {
                  const to = getRoutePath(section);
                  const isActive = location.pathname === to;

                  return (
                      <SidebarMenuItem key={section.label} className="mt-3">
                        <SidebarMenuButton asChild isActive={isActive} tooltip={section.label}>
                          <NavLink to={to} onClick={closeMobileSidebar}>
                            {section.icon}
                            <span>{section.label}</span>
                            {isActive ? <ChevronRight className="ml-auto h-4 w-4" /> : null}
                          </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }

                const children = Array.isArray(section.paths) 
                  ? section.paths.filter(child => !child.permission || can(child.permission)) 
                  : [];
                
                if (children.length === 0) return null;

                const activeGroup = children.some((child) => location.pathname === getRoutePath(child));
                const isOpen = openGroups[section.label] ?? activeGroup;

                return (
                  <SidebarMenuItem key={section.label}>
                    <SidebarMenuButton
                      type="button"
                      isActive={activeGroup}
                      tooltip={section.label}
                      onClick={() =>
                        setOpenGroups((prev) => ({
                          ...prev,
                          [section.label]: !(prev[section.label] ?? activeGroup),
                        }))
                      }
                    >
                      {section.icon}
                      <span>{section.label}</span>
                      {isOpen ? (
                        <ChevronDown className="ml-auto h-4 w-4" />
                      ) : (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </SidebarMenuButton>

                    {isOpen ? (
                      <SidebarMenuSub>
                        {children.map((child) => {
                          const to = getRoutePath(child);
                          const isChildActive = location.pathname === to;

                          return (
                            <SidebarMenuSubItem key={`${section.label}-${child.label}`}>
                              <SidebarMenuSubButton asChild isActive={isChildActive}>
                                <NavLink to={to} onClick={closeMobileSidebar}>
                                  {child.icon}
                                  <span>{child.label}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    ) : null}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

export default AdminLayout;
