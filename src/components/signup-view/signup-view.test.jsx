import { act, fireEvent, render, screen } from "@testing-library/react";
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
    await user.type(screen.getByLabelText("Birthday (optional):"), "1990-01-01");
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
    await user.type(screen.getByLabelText("Birthday (optional):"), "1990-01-01");
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
    await user.type(screen.getByLabelText("Birthday (optional):"), "1990-01-01");
    await user.click(screen.getByRole("button", { name: "Signup" }));
    const pending = screen.getByRole("button", { name: "Creating account..." });
    expect(pending).toBeDisabled();
    expect(pending.closest("form")).toHaveAttribute("aria-busy", "true");
    await user.click(pending);
    expect(globalThis.fetch).toHaveBeenCalledOnce();
    await act(async () => finishRequest({ ok: false, status: 500, text: async () => "{}" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Registration unsuccessful" );
    expect(screen.getByRole("button", { name: "Signup" })).toBeEnabled();
  });

});


describe("Registration validation and API feedback", () => {
  const fill = (overrides = {}) => {
    render(<MemoryRouter><SignupView /></MemoryRouter>);
    const values = { Username: "Ada12", Password: "abcdefgh", ConfirmPassword: "abcdefgh", Email: "ada@example.com", Birthday: "", ...overrides };
    for (const [field, value] of Object.entries(values)) {
      fireEvent.change(document.querySelector(`[data-field="${field}"]`), { target: { value } });
    }
    fireEvent.submit(screen.getByRole("button", { name: "Signup" }).closest("form"));
  };

  it.each(["Ada1", "Ada_12", "Ada 12", "Áda123", "Ada12!"])("rejects invalid username %s", (Username) => {
    globalThis.fetch = vi.fn();
    fill({ Username });
    expect(screen.getByLabelText("Username:")).toHaveAttribute("aria-invalid", "true");
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it.each(["abcdefg", "a".repeat(73), "é".repeat(37), "😀".repeat(19)])("rejects short or oversized passwords", (Password) => {
    globalThis.fetch = vi.fn();
    fill({ Password, ConfirmPassword: Password });
    expect(screen.getByLabelText("Password:")).toHaveAttribute("aria-invalid", "true");
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it.each(["abcdefgh", "a".repeat(72), "é".repeat(36), "😀".repeat(18)])("accepts valid passwords without complexity rules and omits blank Birthday", async (Password) => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true });
    fill({ Password, ConfirmPassword: Password });
    expect(await screen.findByRole("status")).toHaveTextContent("Account created");
    const body = JSON.parse(globalThis.fetch.mock.calls[0][1].body);
    expect(body).toEqual({ Username: "Ada12", Password, Email: "ada@example.com" });
    expect(screen.getByLabelText("Birthday (optional):")).not.toBeRequired();
  });

  it.each(["", "not-an-email"])("rejects missing or invalid email", (Email) => {
    globalThis.fetch = vi.fn();
    fill({ Email });
    expect(screen.getByLabelText("Email:")).toHaveAttribute("aria-invalid", "true");
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("rejects future birthdays", () => {
    globalThis.fetch = vi.fn();
    fill({ Birthday: "2999-01-01" });
    expect(screen.getByLabelText("Birthday (optional):")).toHaveAccessibleDescription("Birthday must not be in the future.");
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("accepts today's birthday without a minimum age", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true });
    const now = new Date();
    const Birthday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    fill({ Birthday });
    expect(await screen.findByRole("status")).toHaveTextContent("Account created");
    expect(JSON.parse(globalThis.fetch.mock.calls[0][1].body).Birthday).toBe(Birthday);
  });

  it("displays 422 field errors without retaining rejected values", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 422, text: async () => JSON.stringify({ errors: [
      { path: "Username", msg: "Username is invalid." },
      { path: "Password", msg: "Password exceeds the byte limit.", value: "sensitive" },
      { param: "Email", msg: "Email is invalid." },
      { path: "Birthday", msg: "Birthday is invalid." },
    ] }) });
    fill();
    await screen.findByText("Username is invalid.");
    for (const label of ["Username:", "Password:", "Email:", "Birthday (optional):"]) {
      expect(screen.getByLabelText(label)).toHaveAttribute("aria-invalid", "true");
    }
    expect(screen.queryByText("sensitive")).not.toBeInTheDocument();
  });

  it("shows a plain-text duplicate username error", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 400, text: async () => "Username already exists." });
    fill();
    await screen.findByText("Username already exists.");
    expect(screen.getByLabelText("Username:")).toHaveAccessibleDescription(expect.stringContaining("Username already exists."));
  });
});
