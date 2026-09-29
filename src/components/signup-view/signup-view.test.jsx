import { render, screen } from "@testing-library/react";
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
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://movie-api-mreb.onrender.com/users",
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
});
