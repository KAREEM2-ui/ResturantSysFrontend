import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../components/auth/Login";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../store/store.js";
import { expect } from "vitest";


const mockNavigate = vi.fn();

test("login wiht correct credentials", async () => {


    vi.mock("react-router-dom", async () => {
        const actual = await vi.importActual("react-router-dom");
        return {
            ...actual,
            useNavigate: () => mockNavigate,
        };
    });

    render(
        <MemoryRouter>
            <Provider store={store}>
                <Login />
            </Provider>
        </MemoryRouter>
    );

    const usernameInput = screen.getByTestId("username-input");
    const passwordInput = screen.getByTestId("password-input");

    await userEvent.type(usernameInput, "admin");
    await userEvent.type(passwordInput, "admin123");

    const submitButton = screen.getByTestId("submit-button");

    await userEvent.click(submitButton);

    expect(mockNavigate).toHaveBeenCalledWith("/admin");
    





})