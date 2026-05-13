import React from "react";
import { useDispatch } from "react-redux";
import { placeOrder } from "../features/ordersSlice";
import { clearBill } from "../features/billSlice";

const Bill = ({ bill, total }) => {
  const dispatch = useDispatch();

  const handlePlaceOrder = () => {
    if (bill.length === 0) return;

    dispatch(
      placeOrder({
        items: bill,
        total: total,
      })
    );

    dispatch(clearBill());
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* HEADER */}
      <div style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>
        <h5 style={{ margin: 0 }}>🧾 Bill</h5>
      </div>

      {/* ITEMS */}
      <div style={{ flex: 1, overflowY: "auto", padding: "15px" }}>
        {bill.length === 0 ? (
          <p>No items added</p>
        ) : (
          bill.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid #eee",
                padding: "6px 0",
              }}
            >
              <span>
                {item.name} x {item.qty}
              </span>
              <span>${item.price * item.qty}</span>
            </div>
          ))
        )}
      </div>

      {/* TOTAL + BUTTON */}
      <div
        style={{
          padding: "15px", paddingBottom:"50px",
          borderTop: "2px solid #ddd",
        }}
      >
        <h5>Total: ${total.toFixed(2)}</h5>

        <button
          onClick={handlePlaceOrder}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            background: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Bill;