import React, { useState } from "react";
import { usePOSViewModel } from "../viewmodels/usePOSViewModel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Receipt, CheckCircle2, Loader2, AlertCircle, Plus, X, AlertTriangle } from "lucide-react";
import { useSelector } from "react-redux";


export default function POS() {
  const {
    // Data
    productsResp,
    isLoadingProducts,
    isProductsError,
    productsError,

    // POS Window State
    windows,
    activeWindowId,
    activeWindow,
    
    // Window Actions
    createNewWindowHandler,
    setActiveWindowHandler,
    closeWindowHandler,
    setOrderTypeHandler,

    // Actions
    handleAddToBill,
    removeFromBill,
    handlePlaceOrder,
    branchId,
    getItemQuantityInBill
  } = usePOSViewModel();

  const branchIdFromStore = useSelector((state) => state.appConfig.selectedBranchId);



  
  const [selectedCategory, setSelectedCategory] = useState("All");


  // Calculate remaining/possible stock for a product
  const calculateRemainingStock = (product) => {
    if (!product.stock) return 0;

    // Item-based product (single ingredient reference)
    if (product.stock.type === "item" && product.stock.itemStock) {
      return product.stock.itemStock.currentStock || 0;
    }

    // Ingredient-based product (multiple ingredients)
    if (product.stock.type === "ingredients" && product.stock.ingredientStocks) {
      const ingredientStocks = product.stock.ingredientStocks;
      
      // If no ingredient stocks found, cannot make
      if (!ingredientStocks || ingredientStocks.length === 0) {
        return 0;
      }

      // For each ingredient in the recipe, calculate how many products can be made
      const possibleCounts = product.ingredients.map((ingredient) => {
        const stock = ingredientStocks.find(
          (s) => s.ItemId.toString() === ingredient.inventoryItemId.toString()
        );
        
        if (!stock) return 0; // Ingredient not found in branch inventory
        
        // Divide available stock by quantity needed per product
        return Math.floor(stock.currentStock / ingredient.quantity);
      });

      // The bottleneck ingredient determines how many products can be made
      return Math.min(...possibleCounts);
    }

    return 0;
  };

  const isOutOfStock = (product) => {
    return calculateRemainingStock(product) <= 0;
  };

  if (isLoadingProducts) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-muted-foreground space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Loading menu items...</p>
      </div>
    );
  }

  if (!branchIdFromStore) {
    return (
      <div className="h-screen grid place-items-center bg-muted/20 p-8 text-center text-muted-foreground">
        <div className="max-w-md space-y-3 rounded-xl border bg-background p-6 shadow-sm">
          <AlertCircle className="mx-auto h-8 w-8" />
          <p className="font-medium text-foreground">Select a branch to load the POS menu.</p>
          <p className="text-sm text-muted-foreground">Use the branch picker in the admin sidebar, then reopen POS.</p>
        </div>
      </div>
    );
  }

  






  const categories = ["All", ...new Set((productsResp?.data?.products || []).map((item) => item.category).filter(Boolean))];

  const filteredItems =
    selectedCategory === "All"
      ? (productsResp?.data?.products || [])
      : (productsResp?.data?.products || []).filter((item) => item.category === selectedCategory);

  const total = activeWindow?.items?.reduce((sum, i) => sum + i.price * (i.qty || 1), 0) || 0;
  const isPlacingOrder = activeWindow?.isLoading;
  const placeOrderError = activeWindow?.orderError;


  return (
    <div className="flex h-screen bg-muted/20">
      {/* LEFT PANE: MENU */}
      <div className="flex-1 flex flex-col border-r border-border bg-background overflow-hidden">
        
        {/* TABS UI */}
        <div className="flex items-center gap-2 p-2 border-b border-border bg-muted/30 overflow-x-auto">
          {windows.map((w, index) => (
            <Button
              key={w.id}
              variant={w.id === activeWindowId ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-2 rounded-t-md rounded-b-none border-b-0 h-9"
              onClick={() => setActiveWindowHandler(w.id)}
            >
              Window {index + 1}
              {windows.length > 1 && (
                <Button className="h-6 w-6 hover:bg-amber-800 rounded-md cursor-pointer" onClick={(e) => {e.stopPropagation(); closeWindowHandler(e, w.id)}} >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </Button>
          ))}
          <Button data-testid="create-window-button" variant="ghost" size="icon" onClick={createNewWindowHandler}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Categories */}
        <div className="p-2 border-b border-border bg-muted/10">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((cat, i) => (
              <Button
                key={i}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                className="rounded-full whitespace-nowrap"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <ScrollArea className="flex-1 p-6 overflow-auto">
          {isLoadingProducts ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 pt-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Loading menu items...</p>
            </div>
          ) : isProductsError ? (
            <div className="h-full flex flex-col items-center justify-center text-destructive space-y-4 pt-12">
              <AlertCircle className="h-8 w-8" />
              <p>Error: {productsError?.message || "Failed to load products"}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item, i) => {
                const isAdded = activeWindow?.items?.some(activeItem => activeItem._id === item._id);
                const itemQtyInBill = getItemQuantityInBill(item._id);
                const remainingStock = calculateRemainingStock(item);
                const outOfStock = isOutOfStock(item);
                const lowStock = remainingStock > 0 && remainingStock <= 5;

                return (
                <Card
                  key={item._id || item.id || i}
                  className={`cursor-pointer transition-all active:scale-95 ${
                    outOfStock 
                      ? 'opacity-50 cursor-not-allowed border-destructive/50' 
                      : 'hover:border-primary hover:shadow-md'
                  } ${isAdded ? 'border-primary shadow-sm' : ''}`}
                  onClick={() => !outOfStock && handleAddToBill(item)}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                    <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-2 relative">
                      <span className="text-2xl font-bold text-muted-foreground">
                        {item.name?.charAt(0) || "?"}
                      </span>
                      {outOfStock && (
                        <div className="absolute inset-0 rounded-full flex items-center justify-center bg-destructive/20">
                          <AlertTriangle className="h-6 w-6 text-destructive" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold leading-tight line-clamp-2 min-h-10">
                      {item.name}
                    </h3>
                    <Badge variant="secondary">{item.category}</Badge>
                    <p className="text-lg font-bold text-primary mt-2">
                      ${(item.price || 0).toFixed(2)}
                    </p>

                    {/* Stock Information */}
                    <div className="w-full text-xs mt-2">
                      {item.stock?.type === "item" ? (
                        <p className={`font-medium ${outOfStock ? 'text-destructive' : lowStock ? 'text-yellow-600' : 'text-green-600'}`}>
                          Stock: {remainingStock}
                        </p>
                      ) : item.stock?.type === "ingredients" ? (
                        <p className={`font-medium ${outOfStock ? 'text-destructive' : lowStock ? 'text-yellow-600' : 'text-green-600'}`}>
                          Can make: {remainingStock}
                        </p>
                      ) : null}
                    </div>

                    {lowStock && !outOfStock && (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600 mt-1">
                        Low Stock
                      </Badge>
                    )}

                    {outOfStock && (
                      <Badge variant="destructive" className="mt-1">
                        Out of Stock
                      </Badge>
                    )}

                    {isAdded && itemQtyInBill > 0 && (
                      <Badge variant="default" className="mt-1 bg-blue-600 hover:bg-blue-700">
                        {itemQtyInBill} in Bill
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              )})}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* RIGHT PANE: BILL */}
      <div className="lg:w-1/3 md:w-1/2 mx-0 flex flex-col bg-background shadow-xl border-l z-10 h-screen overflow-auto">
        <div className="p-6 border-b border-border bg-primary text-primary-foreground flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="h-6 w-6" />
              <h2 className="text-xl font-bold">Current Order</h2>
            </div>
             <div className="flex bg-primary-foreground/20 rounded-md p-1">
                <Button 
                  size="sm" 
                  variant={(!activeWindow?.orderType || activeWindow?.orderType === "dine_in") ? "secondary" : "ghost"}
                  className="h-7 text-xs font-semibold"
                  onClick={() => setOrderTypeHandler("dine_in")}
                >
                  Dine In
                </Button>
                <Button 
                  size="sm" 
                  variant={activeWindow?.orderType === "pickup" ? "secondary" : "ghost"}
                  className="h-7 text-xs font-semibold"
                  onClick={() => setOrderTypeHandler("pickup")}
                >
                  Pickup
                </Button>
            </div>
          </div>
          {windows.length > 0 && (
             <p className="text-sm opacity-80">Window {windows.findIndex(w => w.id === activeWindowId) + 1}</p>
          )}
        </div>

        <ScrollArea className="flex-1 p-6">
          {!activeWindow?.items?.length ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 py-12">
              <Receipt className="h-12 w-12 opacity-20" />
              <p>No items added yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeWindow.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center group">
                  <div className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-sm text-muted-foreground text-left">
                      ${item.price.toFixed(2)} x {item.qty}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                    <Button variant="ghost" size="xs" onClick={(e) => { e.stopPropagation(); removeFromBill(i); }}>
                      <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-6 border-t border-border bg-background space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">${total.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>

          <Button
            className="w-full h-12 text-lg mt-4"
            size="lg"
            onClick={() => handlePlaceOrder()}
            disabled={!activeWindow?.items?.length || isPlacingOrder}
          >
            {isPlacingOrder ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-2 h-5 w-5" />
            )}
            {isPlacingOrder ? "Placing Order..." : "Place Order"}
          </Button>
          
          {placeOrderError && (
             <p className="text-sm text-destructive text-center mt-2">
                 {placeOrderError}
             </p>
          )}
        </div>
      </div>
    </div>
  );
}
