import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addMenuItem, removeMenuItem } from "../features/itemsSlice";

const MenuAdmin = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.items);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Food");

  const categories = ["Food", "Drinks", "Desserts", "Snacks"];

  const handleAdd = () => {
    if (!name || !price) return;

    dispatch(
      addMenuItem({
        name,
        price: Number(price),
        category,
      })
    );

    setName("");
    setPrice("");
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "auto",
        fontFamily: "Arial",
      }}
    >
      <h2>Menu Admin Panel</h2>

      {/* FORM CARD */}
      <div
        style={{
          border: "1px solid #ddd",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          background: "#fafafa",
        }}
      >
        <h4>Add New Item</h4>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <input
            placeholder="Item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: "8px" }}
          />

          <input
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={{ padding: "8px" }}
          />

          {/* CATEGORY DROPDOWN */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ padding: "8px", gridColumn: "span 2" }}
          >
            {categories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            onClick={handleAdd}
            style={{
              gridColumn: "span 2",
              padding: "10px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Add Item
          </button>
        </div>
      </div>

      {/* LIST */}
      <div>
        <h4>Menu Items</h4>

        {items.length === 0 ? (
          <p>No items available</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                border: "1px solid #eee",
                borderRadius: "8px",
                marginBottom: "10px",
                background: "#fff",
              }}
            >
              <div>
                <strong>{item.name}</strong>
                <p style={{ margin: 0, color: "#666" }}>
                  {item.category} - ${item.price}
                </p>
              </div>

              <button
                onClick={() => dispatch(removeMenuItem(item.id))}
                style={{
                  background: "red",
                  color: "#fff",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MenuAdmin;