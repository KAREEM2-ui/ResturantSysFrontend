import { CircleHelp, FilePenLine, Layers3, PackageCheck, PackageSearch, PanelRightOpen, Store, X } from "lucide-react";
import { Suspense, useState,lazy } from "react";

import EntityManagementCard from "../components/admin/EntityManagementCard";
const ProductFormPreview = lazy(() => import("../components/admin/Products/ProductFormPreview"));
const IngredientsPanel = lazy(() => import("../components/admin/Products/IngredientsPanel"));
const BranchAvailabilityPanel = lazy(() => import("../components/admin/Products/BranchAvailabilityPanel"));

import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { PermissionGate } from "../components/auth/PermissionGate";
import { ShieldCheck } from "lucide-react";
import { useProductsViewModel } from "../viewmodels/useProductsViewModel";

const columns = [
  { key: "name", label: "Product Name" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price", render: (value) => `OMR ${Number(value || 0).toFixed(2)}` },
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <Badge variant="secondary" className={value === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"}>
        {value || "Active"}
      </Badge>
    ),
  },
  {
    key: "ingredientsSummary",
    label: "Ingredients",
    render: (value) => <span className="text-muted-foreground">{value || "0 ingredients"}</span>,
  },
];

export default function ProductsList() {
  const [showBranchProducts, setShowBranchProducts] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [seeIngredients, setSeeIngredients] = useState(false);
  const [editProduct, setEditProduct] = useState(false);
  const [branchesAvailable, setBranchesAvailable] = useState(false);
  const [availabilityBranchIds, setAvailabilityBranchIds] = useState([]);
  const [page, setPage] = useState(1);

  const {
    products,
    branchProducts,
    totalCount,
    branches,
    selectedBranchId,
    setSelectedBranchId,
    inventoryItems,
    isLoading,
    isLoadingBranchProducts,
    createProduct,
    updateProduct,
    isCreating,
    isUpdating,
  } = useProductsViewModel(page);

  const openDialog = (row, setOpen) => {
    setSelectedProduct(row);
    setOpen(true);
  };

  const handleSaveProduct = async (payload) => {
    try {
      if (selectedProduct?.id) {
        await updateProduct({ id: selectedProduct.id, ...payload });
      } else {
        await createProduct(payload);
      }
      setEditProduct(false);
    } catch (error) {
      console.error("Failed to save product", error);
    }
  };

  const openBranchesAvailability = (product) => {
    setSelectedProduct(product);
    setAvailabilityBranchIds((product?.branches || []).map((id) => String(id)));
    setBranchesAvailable(true);
  };

  const toggleAvailabilityBranch = (branchId, checked) => {
    setAvailabilityBranchIds((current) => {
      if (checked) {
        if (current.includes(branchId)) return current;
        return [...current, branchId];
      }
      return current.filter((id) => id !== branchId);
    });
  };

  const saveBranchAvailability = async () => {
    if (!selectedProduct?.id) {
      return;
    }

    try {
      await updateProduct({ id: selectedProduct.id, branches: availabilityBranchIds });
      setBranchesAvailable(false);
    } catch (error) {
      console.error("Failed to update branch availability", error);
    }
  };

  if (isLoading && !products.length) {
    return <div className="p-8 text-center text-muted-foreground">Loading products...</div>;
  }

  return (
    <TooltipProvider>
      <div className="relative">
        <div className="absolute right-0 top-0 z-20">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="outline" size="icon" className="rounded-full" aria-label="Products page guide">
                <CircleHelp className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" align="start" className="max-w-md flex flex-col  space-y-2 p-4 text-sm leading-6 bg-white text-black border border-gray-300 shadow-lg rounded-lg">
              <p className="font-semibold">Products Page Guide</p>
              <p>
                This page manages two views: the full product catalog (left table) and the selected branch menu (right panel).
              </p>
              <p>
                Use <strong>Add Product</strong> to create either:
              </p>
              <ul className="list-inside list-disc space-y-1 ml-2">
                <li>Recipe product with ingredients and quantities</li>
                <li>Item-based product linked to a single inventory item</li>
              </ul>
              <p>
                Row actions let you inspect ingredients, edit product details, and control branch availability. Branch products update
                based on the selected branch in the side panel.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem] pt-12">
        <div className="min-w-0">
          <EntityManagementCard
            title="Products List"
            description="Add products, attach ingredient quantities, and manage availability per branch."
            data={products}
            columns={columns}
            pagination={{
              page,
              pageSize: 10,
              total: totalCount,
              onPageChange: setPage,
            }}
            rowActions={{
              label: (row) => row.name,
              items: () => [
                {
                  label: "See Ingredients",
                  icon: <Layers3 className="h-4 w-4" />,
                  onClick: (row) => openDialog(row, setSeeIngredients),
                },
                {
                  label: "Edit Product",
                  icon: <FilePenLine className="h-4 w-4" />,
                  onClick: (row) => openDialog(row, setEditProduct),
                },
                {
                  label: "Branches Available In",
                  icon: <PackageSearch className="h-4 w-4" />,
                  onClick: (row) => openBranchesAvailability(row),
                },
              ],
            }}
            Actions={{
              label: "Add Product",
              icon: <Layers3 className="h-4 w-4" />,
              onClick: () => {
                setSelectedProduct(null);
                setEditProduct(true);
              },
            }}
          />
        </div>

        {showBranchProducts ? (
          <aside className="space-y-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm xl:sticky xl:top-4 xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  <h2 className="text-base font-medium">Branch Products</h2>
                </div>
                <p className="text-sm text-muted-foreground">Select a branch to see the products in its menu.</p>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Close branch products panel"
                    onClick={() => setShowBranchProducts(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Close panel</TooltipContent>
              </Tooltip>
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch-products-select">Select Branch</Label>
              <Select value={selectedBranchId || ""} onValueChange={setSelectedBranchId}>
                <SelectTrigger id="branch-products-select" className="h-11 w-full">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch._id} value={String(branch._id)}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {isLoadingBranchProducts ? <p className="text-sm text-muted-foreground">Loading branch products...</p> : null}

              {!isLoadingBranchProducts && !branchProducts.length ? (
                <p className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">No products are assigned to this branch yet.</p>
              ) : null}

              {branchProducts.map((product) => (
                <article key={`${selectedBranchId}-${product.id}`} className="rounded-lg border bg-background p-4 text-foreground shadow-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1">
                      <h3 className="truncate font-medium">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                      <PackageCheck className="h-3 w-3" />
                      Available
                    </Badge>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium">OMR {Number(product.price || 0).toFixed(2)}</span>
                    <span className="text-muted-foreground">{product.ingredientsSummary}</span>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        ) : (
          <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed bg-muted/20 p-4">
            <div className="max-w-56 space-y-3 text-center">
              <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Store className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-medium">Branch Products</h2>
                <p className="text-sm text-muted-foreground">Open the panel to review products by branch.</p>
              </div>
              <Button type="button" variant="outline" onClick={() => setShowBranchProducts(true)}>
                <PanelRightOpen className="h-4 w-4" />
                Open Panel
              </Button>
            </div>
          </div>
        )}
      </div>
      </div>

      <Dialog open={seeIngredients} onOpenChange={setSeeIngredients}>
        <DialogContent>
          <PermissionGate
            permission="view-products"
            fallback={
              <div className="grid place-items-center p-8 text-center text-muted-foreground">
                <ShieldCheck className="mb-2 h-8 w-8" />
                You do not have permission to view ingredients.
              </div>
            }
          >
            <DialogHeader>
              <DialogTitle>See Ingredients</DialogTitle>
              <DialogDescription>{selectedProduct?.name}</DialogDescription>
            </DialogHeader>
            <Suspense>
              <IngredientsPanel product={selectedProduct} inventoryItems={inventoryItems} />
            </Suspense>
          </PermissionGate>
        </DialogContent>
      </Dialog>

      <Dialog open={editProduct} onOpenChange={setEditProduct}>
        <DialogContent className="max-w-3xl">
          <PermissionGate
            permission="manage-products"
            fallback={
              <div className="grid place-items-center p-8 text-center text-muted-foreground">
                <ShieldCheck className="mb-2 h-8 w-8" />
                You do not have permission to manage products.
              </div>
            }
          >
            <DialogHeader>
              <DialogTitle>{selectedProduct ? "Edit Product" : "Add Product"}</DialogTitle>
              <DialogDescription>{selectedProduct?.name || "Create a new product catalog item."}</DialogDescription>
            </DialogHeader>
            <Suspense>
              <ProductFormPreview
                product={selectedProduct}
                inventoryItems={inventoryItems}
                onSave={handleSaveProduct}
                onCancel={() => setEditProduct(false)}
                isSaving={isCreating || isUpdating}
              />
            </Suspense>
          </PermissionGate>
        </DialogContent>
      </Dialog>

      <Dialog open={branchesAvailable} onOpenChange={setBranchesAvailable}>
        <DialogContent>
          <PermissionGate
            permission="manage-products"
            fallback={
              <div className="grid place-items-center p-8 text-center text-muted-foreground">
                <ShieldCheck className="mb-2 h-8 w-8" />
                You do not have permission to manage branch availability.
              </div>
            }
          >
            <DialogHeader>
              <DialogTitle>Branch Availability</DialogTitle>
              <DialogDescription>{selectedProduct?.name}</DialogDescription>
            </DialogHeader>
            <Suspense>
              <BranchAvailabilityPanel
                product={selectedProduct}
                branches={branches}
                selectedBranchIds={availabilityBranchIds}
                onToggleBranch={toggleAvailabilityBranch}
              />
            </Suspense>
            <div className="flex justify-end">
              <Button type="button" onClick={saveBranchAvailability} disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </PermissionGate>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
