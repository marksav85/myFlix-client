import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import { AppProvider } from "../../contexts/AppContext";
import { MovieView } from "./movie-view";

const movie = {
  id: "movie-1", title: "The Matrix", description: "The complete movie description.\nA second paragraph.",
  genre: "Science Fiction", director: "The Wachowskis", image: "https://example.com/matrix.jpg",
};
const account = { Username: "Ada", FavoriteMovies: [movie.id] };
const renderDetail = (path = "/movies/movie-1") => {
  localStorage.setItem("user", JSON.stringify(account));
  localStorage.setItem("token", "test-token");
  return render(<AppProvider><MemoryRouter initialEntries={[path]}><Routes>
    <Route path="/movies/:movieId" element={<MovieView movies={[movie]} />} />
  </Routes></MemoryRouter></AppProvider>);
};

describe("MovieView", () => {
  it("renders the full supported information and a semantic library link", () => {
    renderDetail();
    expect(screen.getByRole("heading", { level: 1, name: movie.title })).toBeInTheDocument();
    expect(screen.getByText(/The complete movie description/)).toHaveTextContent("A second paragraph.");
    expect(screen.getByText(movie.genre)).toBeInTheDocument();
    expect(screen.getByText(movie.director)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: `${movie.title} poster` })).toHaveAttribute("src", movie.image);
    expect(screen.getByRole("link", { name: "Back to Movies" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("button", { name: "Remove from Favorites" })).toHaveAttribute("aria-pressed", "true");
  });

  it("removes a favorite and reflects the returned user state", async () => {
    const user = userEvent.setup();
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ...account, FavoriteMovies: [] }) });
    renderDetail();
    await user.click(screen.getByRole("button", { name: "Remove from Favorites" }));
    expect(await screen.findByRole("button", { name: "Add to Favorites" })).toHaveAttribute("aria-pressed", "false");
    expect(JSON.parse(localStorage.getItem("user")).FavoriteMovies).toEqual([]);
  });

  it("communicates pending state and associates safe favorite failure feedback", async () => {
    const user = userEvent.setup();
    let finishRequest;
    globalThis.fetch = vi.fn(() => new Promise((resolve) => { finishRequest = resolve; }));
    renderDetail();
    await user.click(screen.getByRole("button", { name: "Remove from Favorites" }));
    const pending = screen.getByRole("button", { name: "Updating..." });
    expect(pending).toBeDisabled();
    expect(pending).toHaveAttribute("aria-busy", "true");
    await user.click(pending);
    expect(globalThis.fetch).toHaveBeenCalledOnce();
    await act(async () => finishRequest({ ok: false, status: 500, json: async () => ({ message: "private failure" }) }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Favorites could not be updated. Please try again.");
    const button = screen.getByRole("button", { name: "Remove from Favorites" });
    expect(button).toBeEnabled();
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveAccessibleDescription("Favorites could not be updated. Please try again.");
    expect(screen.queryByText("private failure")).not.toBeInTheDocument();
  });
});
