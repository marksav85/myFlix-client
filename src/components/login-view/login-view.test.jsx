import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
      <AppProvider>
        <LoginView />
      </AppProvider>
    );

    await user.type(screen.getByLabelText("Username:"), "Ada");
    await user.type(screen.getByLabelText("Password:"), "correct-horse");
    await user.click(screen.getByRole("button", { name: "Submit" }));

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
});
