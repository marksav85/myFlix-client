import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import { AppProvider } from "./contexts/AppContext";
import { LoginView } from "./components/login-view/login-view";
import { SignupView } from "./components/signup-view/signup-view";
import { ProfileView } from "./components/profile-view/profile-view";
import { MovieView } from "./components/movie-view/movie-view";
import MainView from "./components/main-view/main-view";

const response = (data, options = {}) => ({
  ok: options.ok ?? true,
  status: options.status ?? 200,
  headers: { get: () => null },
  json: async () => data,
});

const authenticatedUser = {
  Username: "Ada",
  Email: "ada@example.com",
  Birthday: "1990-01-01T00:00:00.000Z",
  FavoriteMovies: [],
};

const movie = {
  id: "movie-1",
  title: "The Matrix",
  description: "A hacker discovers reality is simulated.",
  genre: "Science Fiction",
  director: "The Wachowskis",
  image: "https://example.com/matrix.jpg",
};

const renderWithAuth = (ui) =>
  render(<AppProvider>{ui}</AppProvider>);

describe("Phase 2 regression behavior", () => {
  it("safely discards corrupted persisted authentication", () => {
    localStorage.setItem("user", "not-json");
    localStorage.setItem("token", "stale-token");

    renderWithAuth(<MemoryRouter><LoginView /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("shows and dismisses a failed login message without throwing", async () => {
    const user = userEvent.setup();
    globalThis.fetch = vi.fn().mockResolvedValue(
      response({ message: "invalid credentials" }, { ok: false, status: 401 })
    );
    renderWithAuth(<MemoryRouter><LoginView /></MemoryRouter>);

    await user.type(screen.getByLabelText("Username:"), "Ada");
    await user.type(screen.getByLabelText("Password:"), "wrong-password");
    await user.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Login unsuccessful"
    );
    await user.click(screen.getByRole("button", { name: "Dismiss message" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Username:")).toHaveFocus();
  });

  it.each([401, 403])(
    "invalidates a stored session after a protected %i response",
    async (status) => {
    localStorage.setItem("user", JSON.stringify(authenticatedUser));
    localStorage.setItem("token", "stale-token");
    globalThis.fetch = vi.fn().mockResolvedValue(
      response({ message: "expired" }, { ok: false, status })
    );

    renderWithAuth(<MainView />);

    expect(await screen.findByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
    }
  );

  it("shows an empty state for a successful empty movie response", async () => {
    localStorage.setItem("user", JSON.stringify(authenticatedUser));
    localStorage.setItem("token", "test-token");
    globalThis.fetch = vi.fn().mockResolvedValue(response([]));

    renderWithAuth(<MainView />);
    expect(await screen.findByText("No movies are available.")).toBeInTheDocument();
  });

  it("shows a safe error for a failed movie request", async () => {
    localStorage.setItem("user", JSON.stringify(authenticatedUser));
    localStorage.setItem("token", "test-token");
    globalThis.fetch = vi.fn().mockResolvedValue(
      response({ message: "unavailable" }, { ok: false, status: 500 })
    );
    renderWithAuth(<MainView />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Movies could not be loaded"
    );
  });

  it("renders a safe fallback for an invalid movie route", () => {
    render(
      <AppProvider>
        <MemoryRouter initialEntries={["/movies/missing"]}>
          <Routes>
            <Route path="/movies/:movieId" element={<MovieView movies={[movie]} />} />
          </Routes>
        </MemoryRouter>
      </AppProvider>
    );

    expect(screen.getByText("Movie not found.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to Movies" })).toHaveAttribute(
      "href",
      "/"
    );
  });

  it("sends Birthday and required Password when updating a profile", async () => {
    const user = userEvent.setup();
    localStorage.setItem("user", JSON.stringify(authenticatedUser));
    localStorage.setItem("token", "test-token");
    const updatedUser = { ...authenticatedUser, Email: "new@example.com" };
    globalThis.fetch = vi.fn().mockResolvedValue(response(updatedUser));

    renderWithAuth(<MemoryRouter><ProfileView movies={[]} /></MemoryRouter>);
    expect(screen.getByLabelText("Birthday:")).toHaveValue("1990-01-01");
    await user.clear(screen.getByLabelText("Email:"));
    await user.type(screen.getByLabelText("Email:"), "new@example.com");
    await user.type(screen.getByLabelText("Password (required to save changes)"), "valid-password");
    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.test/users/Ada",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({
          Username: "Ada",
          Email: "new@example.com",
          Birthday: "1990-01-01",
          Password: "valid-password",
        }),
      })
    );
    expect(await within(screen.getByRole("region", { name: "Update Account" })).findByRole("status")).toHaveTextContent("Update successful.");
    expect(JSON.parse(localStorage.getItem("user"))).toEqual(updatedUser);
  });

  it("logs out after a successful username change instead of retaining an invalid JWT", async () => {
    const user = userEvent.setup();
    localStorage.setItem("user", JSON.stringify(authenticatedUser));
    localStorage.setItem("token", "test-token");
    globalThis.fetch = vi.fn().mockResolvedValue(
      response({ ...authenticatedUser, Username: "Grace" })
    );
    renderWithAuth(<MemoryRouter><ProfileView movies={[]} /></MemoryRouter>);

    await user.clear(screen.getByLabelText("Username:"));
    await user.type(screen.getByLabelText("Username:"), "Grace");
    await user.type(screen.getByLabelText("Password (required to save changes)"), "valid-password");
    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("uses the returned user to update the current and persisted favourite state", async () => {
    const user = userEvent.setup();
    localStorage.setItem("user", JSON.stringify(authenticatedUser));
    localStorage.setItem("token", "test-token");
    globalThis.fetch = vi.fn().mockResolvedValue(
      response({ ...authenticatedUser, FavoriteMovies: ["movie-1"] })
    );
    render(
      <AppProvider>
        <MemoryRouter initialEntries={["/movies/movie-1"]}>
          <Routes>
            <Route path="/movies/:movieId" element={<MovieView movies={[movie]} />} />
          </Routes>
        </MemoryRouter>
      </AppProvider>
    );

    await user.click(screen.getByRole("button", { name: "Add to Favorites" }));
    expect(await screen.findByRole("button", { name: "Remove from Favorites" })).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("user")).FavoriteMovies).toEqual(["movie-1"]);
  });

  it("uses registration-specific feedback when signup fails", async () => {
    const user = userEvent.setup();
    globalThis.fetch = vi.fn().mockResolvedValue(
      response({ message: "duplicate" }, { ok: false, status: 409 })
    );
    render(
      <MemoryRouter>
        <AppProvider><SignupView /></AppProvider>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText("Username:"), "Ada12");
    await user.type(screen.getByLabelText("Password:"), "correct-horse");
    await user.type(screen.getByLabelText("Confirm Password:"), "correct-horse");
    await user.type(screen.getByLabelText("Email:"), "ada@example.com");
    await user.type(screen.getByLabelText("Birthday (optional):"), "1990-01-01");
    await user.click(screen.getByRole("button", { name: "Signup" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Registration unsuccessful"
    );
  });
});
