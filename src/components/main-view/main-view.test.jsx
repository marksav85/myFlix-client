import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { AppProvider } from "../../contexts/AppContext";
import MainView from "./main-view";

const movies = [
  {
    _id: "movie-1",
    Title: "The Matrix",
    Description: "A hacker discovers reality is simulated.",
    Genre: { Name: "Science Fiction" },
    Director: { Name: "The Wachowskis" },
    ImagePath: "https://example.com/matrix.jpg",
  },
  {
    _id: "movie-2",
    Title: "Amelie",
    Description: "A whimsical Paris story.",
    Genre: { Name: "Romance" },
    Director: { Name: "Jean-Pierre Jeunet" },
    ImagePath: "https://example.com/amelie.jpg",
  },
];

describe("MainView", () => {
  it("redirects an unauthenticated visitor to login", async () => {
    render(
      <AppProvider>
        <MainView />
      </AppProvider>
    );

    expect(await screen.findByRole("heading", { name: "Login" })).toBeInTheDocument();
  });

  it("loads, renders, filters movies, and logs out an authenticated user", async () => {
    const user = userEvent.setup();
    localStorage.setItem(
      "user",
      JSON.stringify({ Username: "Ada", Email: "ada@example.com", FavoriteMovies: [] })
    );
    localStorage.setItem("token", "test-token");
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => movies,
    });

    render(
      <AppProvider>
        <MainView />
      </AppProvider>
    );

    expect(await screen.findByText("The Matrix")).toBeInTheDocument();
    expect(screen.getByText("Amelie")).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.test/movies",
      expect.objectContaining({
        headers: { Authorization: "Bearer test-token" },
      })
    );

    await user.type(screen.getByRole("searchbox", { name: "Search movies" }), "amelie");
    expect(screen.queryByText("The Matrix")).not.toBeInTheDocument();
    expect(screen.getByText("Amelie")).toBeInTheDocument();

    await user.click(screen.getAllByText("Logout")[0]);
    expect(await screen.findByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });
  it("shows no search results without confusing them with an empty catalog", async () => {
    const user = userEvent.setup();
    localStorage.setItem("user", JSON.stringify({ Username: "Ada", FavoriteMovies: [] }));
    localStorage.setItem("token", "test-token");
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => movies });
    render(<AppProvider><MainView /></AppProvider>);
    expect(await screen.findByRole("heading", { name: "The Matrix" })).toBeInTheDocument();
    const search = screen.getByRole("searchbox", { name: "Search movies" });
    expect(screen.getAllByRole("searchbox")).toHaveLength(1);
    await user.type(search, "not-a-movie");
    expect(screen.getByRole("status")).toHaveTextContent("No movies match your search");
    expect(screen.queryByText("No movies are available.")).not.toBeInTheDocument();
    await user.clear(search);
    await user.type(search, "MATRIX");
    expect(screen.getByRole("heading", { name: "The Matrix" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Amelie" })).not.toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledOnce();
  });

  it("distinguishes loading from a successfully loaded empty catalog", async () => {
    localStorage.setItem("user", JSON.stringify({ Username: "Ada", FavoriteMovies: [] }));
    localStorage.setItem("token", "test-token");
    let finishRequest;
    globalThis.fetch = vi.fn(() => new Promise((resolve) => { finishRequest = resolve; }));
    render(<AppProvider><MainView /></AppProvider>);
    expect(screen.getByRole("status")).toHaveTextContent("Loading movies...");
    expect(screen.queryByText("No movies are available.")).not.toBeInTheDocument();
    await act(async () => finishRequest({ ok: true, json: async () => [] }));
    expect(screen.getByRole("status")).toHaveTextContent("No movies are available.");
    expect(screen.queryByText(/No movies match/)).not.toBeInTheDocument();
  });

});
