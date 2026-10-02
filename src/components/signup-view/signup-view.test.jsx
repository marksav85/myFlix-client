import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { AppProvider } from "../../contexts/AppContext";
import { SignupView } from "./signup-view";

describe("SignupView", () => {
  it("submits the backend registration field names", async () => {
    const user = userEvent.setup();
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true });

    render(
      <MemoryRouter>
        <AppProvider>
          <SignupView />
        </AppProvider>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText("Username:"), "Ada12");
    await user.type(screen.getByLabelText("Password:"), "correct-horse");
    await user.type(screen.getByLabelText("Confirm Password:"), "correct-horse");
    await user.type(screen.getByLabelText("Email:"), "ada@example.com");
    await user.type(screen.getByLabelText("Birthday:"), "1990-01-01");
    await user.click(screen.getByRole("button", { name: "Signup" }));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.test/users",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          Username: "Ada12",
          Password: "correct-horse",
          Email: "ada@example.com",
          Birthday: "1990-01-01",
        }),
      })
    );
    expect(await screen.findByText("Sign up successful. Account created.")).toBeInTheDocument();
  });
  it("associates password mismatch feedback and sends no request", async () => {
    const user = userEvent.setup();
    globalThis.fetch = vi.fn();
    render(<MemoryRouter><SignupView /></MemoryRouter>);
    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute("href", "/login");
    await user.type(screen.getByLabelText("Username:"), "Ada12");
    await user.type(screen.getByLabelText("Password:"), "password-one");
    await user.type(screen.getByLabelText("Confirm Password:"), "password-two");
    await user.type(screen.getByLabelText("Email:"), "ada@example.com");
    await user.type(screen.getByLabelText("Birthday:"), "1990-01-01");
    await user.click(screen.getByRole("button", { name: "Signup" }));
    expect(screen.getByRole("alert")).toHaveTextContent("The passwords do not match");
    expect(screen.getByLabelText("Confirm Password:")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText("Confirm Password:")).toHaveAccessibleDescription("The passwords do not match. Please try again.");
    expect(globalThis.fetch).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Dismiss message" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password:")).toHaveFocus();
    expect(screen.getByLabelText("Confirm Password:")).not.toHaveAttribute("aria-invalid");
  });

  it("announces pending submission and disables repeat clicks", async () => {
    const user = userEvent.setup();
    let finishRequest;
    globalThis.fetch = vi.fn(() => new Promise((resolve) => { finishRequest = resolve; }));
    render(<MemoryRouter><AppProvider><SignupView /></AppProvider></MemoryRouter>);
    await user.type(screen.getByLabelText("Username:"), "Ada12");
    await user.type(screen.getByLabelText("Password:"), "correct-horse");
    await user.type(screen.getByLabelText("Confirm Password:"), "correct-horse");
    await user.type(screen.getByLabelText("Email:"), "ada@example.com");
    await user.type(screen.getByLabelText("Birthday:"), "1990-01-01");
    await user.click(screen.getByRole("button", { name: "Signup" }));
    const pending = screen.getByRole("button", { name: "Creating account..." });
    expect(pending).toBeDisabled();
    expect(pending.closest("form")).toHaveAttribute("aria-busy", "true");
    await user.click(pending);
    expect(globalThis.fetch).toHaveBeenCalledOnce();
    await act(async () => finishRequest({ ok: false, status: 500, json: async () => ({}) }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Registration unsuccessful" );
    expect(screen.getByRole("button", { name: "Signup" })).toBeEnabled();
  });

});
