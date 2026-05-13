import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col, Button, Card, CardBody } from "reactstrap";
import { addItem } from "../features/billSlice";
import Bill from "./Bill";

const Menu = () => {
  const dispatch = useDispatch();

  const items = useSelector((state) => state.items);
  const billItems = useSelector((state) => state.bill.items);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...new Set(items.map((item) => item.category))];

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const handleAdd = (item) => {
    dispatch(addItem(item));
  };

  const total = billItems.reduce(
  (sum, item) => sum + item.price * item.qty,
  0
);

  return (
    <Container fluid style={{ height: "100vh", overflow: "hidden" }}>
      <Row style={{ height: "100vh" }}>

        {/* MENU */}
        <Col
          md="9"
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid #ddd",
          }}
        >
          <div style={{ padding: "15px", borderBottom: "1px solid #ddd" }}>
            <h4>🍽️ Menu</h4>

            {categories.map((cat, i) => (
              <Button
                key={i}
                size="sm"
                color={selectedCategory === cat ? "dark" : "light"}
                className="me-2 mb-2"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "15px" }}>
            <Row>
              {filteredItems.map((item, i) => (
                <Col md="3" sm="6" xs="12" key={i} className="mb-3">
                  <Card
                    onClick={() => handleAdd(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <CardBody>
                      <h6>{item.name}</h6>
                      <p className="text-muted mb-1">{item.category}</p>
                      <strong>${item.price}</strong>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </Col>

        {/* BILL (FROM REDUX) */}
        <Col md="3" style={{ height: "100vh", padding: 0 }}>
          <Bill bill={billItems} total={total} />
        </Col>

      </Row>
    </Container>
  );
};

export default Menu;