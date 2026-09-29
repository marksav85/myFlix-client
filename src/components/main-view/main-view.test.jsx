import { render, screen } from "@testing-library/react";
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
      "https://movie-api-mreb.onrender.com/movies",
      { headers: { Authorization: "Bearer test-token" } }
    );

    await user.type(screen.getByPlaceholderText("Search..."), "amelie");
    expect(screen.queryByText("The Matrix")).not.toBeInTheDocument();
    expect(screen.getByText("Amelie")).toBeInTheDocument();

    await user.click(screen.getAllByText("Logout")[0]);
    expect(await screen.findByRole("heading", { name: "Login" })).toBeInTheDocument();
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });
});
