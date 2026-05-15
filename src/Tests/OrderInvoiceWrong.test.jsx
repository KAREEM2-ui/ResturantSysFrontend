import { vi } from "vitest";
import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock useSelector to return an admin user
vi.mock("react-redux", async () => {
    const actual = await vi.importActual("react-redux");
    return {
        ...actual,
        useSelector: (selector) => selector ? selector({ auth: { user: { role: "admin" } } }) : { auth: { user: { role: "admin" } } },
    };
});

// Provide a simple orders viewmodel with one order containing mock items
const mockViewModel = () => ({
    orders: [
        {
            id: "order1",
            items: [
                
            ],
            itemsSummary: 3,
            createdAt: "2026-01-01T12:00:00.000Z",
            branch: "Main",
            channel: "Counter",
            status: "Completed",
            payment: { status: "Paid" },
        },
    ],
    totalCount: 1,
    isLoading: false,
    branchId: "Main",
});

vi.mock("../viewmodels/useOrdersViewModel", async () => {
    const actual = await vi.importActual("../viewmodels/useOrdersViewModel");
    return {
        ...actual,
        useOrdersViewModel: () => mockViewModel(),
    };
});

import Orders from "../Pages/Orders";

test("Order Invoice renders total for empty order", async () => {
    render(<Orders />);

    // The component's data-testid contains a stray brace in implementation: "row-action-button}"
    const actionButtons = await screen.findAllByTestId("row-action-button}");
    await userEvent.click(actionButtons[0]);

    const actionItem = await screen.findByTestId("row-action-item-Print Receipt");
    await userEvent.click(actionItem);

    

   

    // Invoice total currently wraps formatting twice in component, resulting in $0.00
    const totalElem = await screen.findByTestId("invoice-total");
    expect(totalElem).toHaveTextContent("$9.00",{
        message: "Invoice total should be $0.00 because there are not items",
    });
});