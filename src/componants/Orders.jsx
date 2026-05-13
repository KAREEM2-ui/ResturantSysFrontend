import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleOrderStatus } from "../features/ordersSlice";

const Orders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);

  const [filter, setFilter] = useState("all");

  // filter logic
  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.status === filter;
  });

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Orders History</h2>

      {/* FILTER BUTTONS */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setFilter("all")}
          style={{
            marginRight: "10px",
            padding: "8px 12px",
            background: filter === "all" ? "#333" : "#eee",
            color: filter === "all" ? "#fff" : "#000",
            border: "none",
            borderRadius: "5px",
          }}
        >
          All
        </button>

        <button
          onClick={() => setFilter("pending")}
          style={{
            marginRight: "10px",
            padding: "8px 12px",
            background: filter === "pending" ? "#ff9800" : "#eee",
            color: filter === "pending" ? "#fff" : "#000",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Pending
        </button>

        <button
          onClick={() => setFilter("done")}
          style={{
            padding: "8px 12px",
            background: filter === "done" ? "#28a745" : "#eee",
            color: filter === "done" ? "#fff" : "#000",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Done
        </button>
      </div>

      {/* ORDERS LIST */}
      {filteredOrders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        filteredOrders.map((order, index) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <strong>Order #{index + 1}</strong>
              <span>{new Date(order.date).toLocaleString()}</span>
            </div>

            {/* ITEMS */}
            <div style={{ margin: "10px 0" }}>
              {order.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #eee",
                    padding: "5px 0",
                  }}
                >
                  <span>
                    {item.name} x {item.qty}
                  </span>
                  <span>${item.price * item.qty}</span>
                </div>
              ))}
            </div>

            {/* STATUS */}
            <div style={{ marginBottom: "10px" }}>
              <strong>Status: </strong>
              <span
                style={{
                  color: order.status === "done" ? "green" : "orange",
                  fontWeight: "bold",
                }}
              >
                {order.status.toUpperCase()}
              </span>
            </div>

            {/* TOGGLE BUTTON */}
            <button
              onClick={() => dispatch(toggleOrderStatus(order.id))}
              style={{
                padding: "6px 10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                background:
                  order.status === "done" ? "#ffc107" : "#28a745",
                color: "#fff",
              }}
            >
              Mark as {order.status === "done" ? "Pending" : "Done"}
            </button>

            {/* TOTAL */}
            <div style={{ marginTop: "10px", fontWeight: "bold" }}>
              Total: ${order.total.toFixed(2)}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;