import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { AppProvider } from "../../contexts/AppContext";
import { LoginView } from "./login-view";

describe("LoginView", () => {
  it("persists the login response and notifies the application", async () => {
    const user = userEvent.setup();
    const authenticatedUser = { Username: "Ada", Email: "ada@example.com" };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: authenticatedUser, token: "test-token" }),
    });

    render(
      <MemoryRouter><AppProvider>
        <LoginView />
      </AppProvider></MemoryRouter>
    );

    await user.type(screen.getByLabelText("Username:"), "Ada");
    await user.type(screen.getByLabelText("Password:"), "correct-horse");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.test/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ Username: "Ada", Password: "correct-horse" }),
      })
    );
    expect(JSON.parse(localStorage.getItem("user"))).toEqual(authenticatedUser);
    expect(localStorage.getItem("token")).toBe("test-token");
  });
  it("announces pending submission and disables repeat clicks", async () => {
    const user = userEvent.setup();
    let finishRequest;
    globalThis.fetch = vi.fn(() => new Promise((resolve) => { finishRequest = resolve; }));
    render(<MemoryRouter><AppProvider><LoginView /></AppProvider></MemoryRouter>);
    expect(screen.getByRole("link", { name: "Signup" })).toHaveAttribute("href", "/signup");
    await user.type(screen.getByLabelText("Username:"), "Ada12");
    await user.type(screen.getByLabelText("Password:"), "correct-horse");
    await user.click(screen.getByRole("button", { name: "Login" }));
    const pending = screen.getByRole("button", { name: "Signing in..." });
    expect(pending).toBeDisabled();
    expect(pending.closest("form")).toHaveAttribute("aria-busy", "true");
    await user.click(pending);
    expect(globalThis.fetch).toHaveBeenCalledOnce();
    await act(async () => finishRequest({ ok: false, status: 500, json: async () => ({}) }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Login unsuccessful" );
    expect(screen.getByRole("button", { name: "Login" })).toBeEnabled();
  });

});
