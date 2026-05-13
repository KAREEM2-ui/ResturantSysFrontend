export default function IngredientsPanel({ product, inventoryItems = [] }) {
  if (!product) {
    return null;
  }

  const inventoryById = new Map(inventoryItems.map((item) => [String(item._id), item]));
  const ingredients = Array.isArray(product.ingredients) ? product.ingredients : [];

  if (!ingredients.length) {
    const itemName = product.item ? inventoryById.get(String(product.item))?.name || "Single inventory item" : "No recipe";

    return (
      <div className="space-y-3 rounded-lg border bg-muted/20 p-4 text-sm">
        <div className="font-medium">No ingredients recipe</div>
        <div className="text-muted-foreground">This product is item-based: {itemName}.</div>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-4 text-sm">
      <div className="font-medium">Recipe ingredients ({ingredients.length})</div>
      <div className="space-y-2">
        {ingredients.map((ingredient, index) => {
          const item = inventoryById.get(String(ingredient.inventoryItemId));
          return (
            <div key={`${ingredient.inventoryItemId}-${index}`} className="flex items-center justify-between rounded-md border bg-background px-3 py-2">
              <span>{item?.name || "Unknown Item"}</span>
              <span className="text-muted-foreground">
                {ingredient.quantity} {ingredient.unit}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
