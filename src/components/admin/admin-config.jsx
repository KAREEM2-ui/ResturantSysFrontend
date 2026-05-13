import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Package, 
  Boxes, 
  Factory, 
  Shield, 
  Store, 
  Percent, 
  Ticket,
  MonitorSmartphone 
} from "lucide-react";

import { lazy } from "react";

const Orders  = lazy(()=> import("../../Pages/Orders"));
const Clients  = lazy(()=> import("../../Pages/Clients"));
const ProductsList  = lazy(()=> import("../../Pages/ProductsList"));
const InventoryItems  = lazy(()=> import("../../Pages/InventoryItems"));
const InventoryProduce  = lazy(()=> import("../../Pages/InventoryProduce"));
const BranchInventoryPage  = lazy(()=> import("../../Pages/BranchInventoryPage"));
const UsersPage  = lazy(()=> import("../../Pages/UsersPage"));
const BranchesPage  = lazy(()=> import("../../Pages/BranchesPage"));
const POS = lazy(() => import("../../Pages/POS"));


import { ProtectedRoute } from "../auth/ProtectedRoute";
import { RequirePermission } from "../auth/RequirePermission";

const withAuth = (Component, permission = null) => {
  return function AuthenticatedComponent(props) {
    let element = (
      <ProtectedRoute>
        <Component {...props} />
      </ProtectedRoute>
    );

    if (permission) {
      element = (
        <RequirePermission permission={permission}>
          {element}
        </RequirePermission>
      );
    }

    return element;
  };
};

export const sectionRoutes = [
  {label: "Point of Sale", path: "pos", component: withAuth(POS), icon: <MonitorSmartphone className="h-4 w-4" />, requireAuthOnly: true},
  { label: "Orders", path: "orders", component: withAuth(Orders, "view-orders"), icon: <ShoppingCart className="h-4 w-4" />, permission: "view-orders" },
  { label: "Clients", path: "clients", component: withAuth(Clients, "view-clients"), icon: <Users className="h-4 w-4" />, permission: "view-clients" },
  { label: "Products List", path: "products-list", component: withAuth(ProductsList, "view-products"), icon: <Package className="h-4 w-4" />, permission: "view-products" },
  {
    label: "Inventory",
    path: null,
    paths: [
      { label: "Items", path: "inventory/items", component: withAuth(InventoryItems, "view-inventory"), icon: <Boxes className="h-4 w-4" />, permission: "view-inventory" },
      { label: "Produce", path: "inventory/produce", component: withAuth(InventoryProduce, "view-inventory"), icon: <Factory className="h-4 w-4" />, permission: "view-inventory" },
      { label: "Branch Inventory", path: "inventory/branch", component: withAuth(BranchInventoryPage, "view-inventory"), icon: <Store className="h-4 w-4" />, permission: "view-inventory" },
    ],
  },

  {
    label: "Management",
    path: null,
    paths: [
      { label: "Users", path: "users", component: withAuth(UsersPage, "view-users"), icon: <Users className="h-4 w-4" />, permission: "view-users" },
      { label: "Branches", path: "branches", component: withAuth(BranchesPage, "view-branches"), icon: <Store className="h-4 w-4" />, permission: "view-branches" },
    ],
  },
];


export const loginRoute = { label: "Login", path: "login", component: lazy(() => import("../../Pages/Home")), icon: <Shield className="h-4 w-4" /> };