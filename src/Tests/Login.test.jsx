import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../store/store.js";
import { expect, vi } from "vitest";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

const mockDispatch = vi.fn(() => ({ unwrap: () => Promise.resolve({ user: { role: "admin" }, token: "token" }) }));

vi.mock("react-redux", async () => {
    const actual = await vi.importActual("react-redux");
    return {
        ...actual,
        useDispatch: () => mockDispatch,
    };
});

import Login from "../components/auth/Login";

test("login", async () => {

    render(
        <MemoryRouter>
            <Provider store={store}>
                <Login />
            </Provider>
        </MemoryRouter>
    );

    const usernameInput = screen.getByTestId("username-input");
    const passwordInput = screen.getByTestId("password-input");

    await userEvent.type(usernameInput, "%%%");
    await userEvent.type(passwordInput, "###");

    const submitButton = screen.getByTestId("submit-button");

    await userEvent.click(submitButton);

    expect(mockNavigate).toHaveBeenCalled();



});

