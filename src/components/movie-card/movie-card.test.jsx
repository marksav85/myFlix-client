import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { AppProvider, useAppContext } from "../../contexts/AppContext";
import { MovieCard } from "./movie-card";

const movie = {
  id: "movie-1", title: "The Matrix", description: "A hacker discovers reality is simulated.",
  genre: "Science Fiction", director: "The Wachowskis", image: "https://example.com/matrix.jpg",
};
const initialUser = { Username: "Ada", Email: "ada@example.com", FavoriteMovies: [] };
const response = (data, status = 200) => ({ ok: status < 400, status, json: async () => data });
const SessionState = () => {
  const { user, sessionNotice } = useAppContext();
  return <p>{user ? "Signed in" : sessionNotice}</p>;
};
const renderCard = (user = initialUser) => {
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", "test-token");
  return render(<MemoryRouter><AppProvider><MovieCard movie={movie} /><SessionState /></AppProvider></MemoryRouter>);
};

describe("MovieCard", () => {
  it("links to details and adds a favorite using returned and persisted user state", async () => {
    const user = userEvent.setup();
    const returnedUser = { ...initialUser, FavoriteMovies: [movie.id] };
    globalThis.fetch = vi.fn().mockResolvedValue(response(returnedUser));
    renderCard();
    expect(screen.getByRole("heading", { name: movie.title, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: `${movie.title} poster` })).toHaveAttribute("src", movie.image);
    expect(screen.getByRole("link", { name: `View Details for ${movie.title}` })).toHaveAttribute("href", "/movies/movie-1");
    await user.click(screen.getByRole("button", { name: `Add to Favorites: ${movie.title}` }));
    expect(globalThis.fetch).toHaveBeenCalledWith("https://api.test/users/Ada/movies/movie-1", expect.objectContaining({
      method: "POST", headers: { Authorization: "Bearer test-token" },
    }));
    expect(await screen.findByRole("button", { name: `Remove from Favorites: ${movie.title}` })).toHaveAttribute("aria-pressed", "true");
    expect(JSON.parse(localStorage.getItem("user"))).toEqual(returnedUser);
    expect(localStorage.getItem("token")).toBe("test-token");
  });

  it("removes an existing favorite with the existing DELETE contract", async () => {
    const user = userEvent.setup();
    globalThis.fetch = vi.fn().mockResolvedValue(response(initialUser));
    renderCard({ ...initialUser, FavoriteMovies: [movie.id] });
    await user.click(screen.getByRole("button", { name: `Remove from Favorites: ${movie.title}` }));
    expect(globalThis.fetch).toHaveBeenCalledWith("https://api.test/users/Ada/movies/movie-1", expect.objectContaining({ method: "DELETE" }));
    expect(await screen.findByRole("button", { name: `Add to Favorites: ${movie.title}` })).toHaveAttribute("aria-pressed", "false");
    expect(JSON.parse(localStorage.getItem("user"))).toEqual(initialUser);
  });

  it("blocks duplicate requests while pending and waits for returned state", async () => {
    const user = userEvent.setup();
    let finishRequest;
    globalThis.fetch = vi.fn(() => new Promise((resolve) => { finishRequest = resolve; }));
    renderCard();
    const button = screen.getByRole("button", { name: `Add to Favorites: ${movie.title}` });
    await user.click(button);
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveTextContent("Updating...");
    expect(screen.getByRole("button", { name: `Updating... for ${movie.title}` })).toBe(button);
    await user.click(button);
    expect(globalThis.fetch).toHaveBeenCalledOnce();
    await act(async () => finishRequest(response({ ...initialUser, FavoriteMovies: [movie.id] })));
    expect(button).toBeEnabled();
    expect(button).toHaveAttribute("aria-busy", "false");
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("shows safe associated failure feedback and preserves favorite state", async () => {
    const user = userEvent.setup();
    globalThis.fetch = vi.fn().mockResolvedValue(response({ message: "private database failure" }, 500));
    renderCard();
    const button = screen.getByRole("button", { name: `Add to Favorites: ${movie.title}` });
    await user.click(button);
    expect(await screen.findByRole("alert")).toHaveTextContent("Favorites could not be updated. Please try again.");
    expect(button).toHaveAccessibleDescription("Favorites could not be updated. Please try again.");
    expect(button).toBeEnabled();
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByText("private database failure")).not.toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("user"))).toEqual(initialUser);
  });

  it("uses existing session expiry handling for a protected favorite failure", async () => {
    const user = userEvent.setup();
    globalThis.fetch = vi.fn().mockResolvedValue(response({ message: "expired" }, 401));
    renderCard();
    await user.click(screen.getByRole("button", { name: `Add to Favorites: ${movie.title}` }));
    expect(await screen.findByText("Your session has expired. Please sign in again.")).toBeInTheDocument();
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });
});
