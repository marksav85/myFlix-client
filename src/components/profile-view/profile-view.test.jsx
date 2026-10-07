import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { AppProvider, useAppContext } from "../../contexts/AppContext";
import { ProfileView } from "./profile-view";

const movie = { id: "movie-1", title: "The Matrix", description: "A complete synopsis.", genre: "Science Fiction", director: "The Wachowskis", image: "https://example.com/matrix.jpg" };
const account = { Username: "Ada", Email: "ada@example.com", BirthDate: "1990-01-01T00:00:00.000Z", FavoriteMovies: [movie.id] };
const response = (data, status = 200) => ({ ok: status < 400, status, json: async () => data });
const Session = () => {
  const { user } = useAppContext();
  return <p>{user ? "Signed in" : "Signed out"}</p>;
};
const renderProfile = (props = {}, storedUser = account) => {
  localStorage.setItem("user", JSON.stringify(storedUser));
  localStorage.setItem("token", "test-token");
  return render(<div id="root"><MemoryRouter><AppProvider>
    <ProfileView movies={[movie]} {...props} /><Session />
  </AppProvider></MemoryRouter></div>);
};

describe("ProfileView", () => {
  it("shows stored account fields and supports the legacy BirthDate field", () => {
    renderProfile();
    const info = screen.getByRole("region", { name: "Account Information" });
    expect(within(info).getByText(account.Username)).toBeInTheDocument();
    expect(within(info).getByText(account.Email)).toBeInTheDocument();
    expect(within(info).getByText("1990-01-01")).toHaveAttribute("datetime", "1990-01-01");
    expect(screen.getByLabelText("Birthday:")).toHaveValue("1990-01-01");
    expect(screen.getByLabelText("Password (required to save changes)")).toHaveAccessibleDescription("Enter your current password to keep it, or a different password to change it.");
  });

  it("requires a password and blocks blank saves with accessible feedback", async () => {
    const user = userEvent.setup();
    globalThis.fetch = vi.fn();
    renderProfile();
    const password = screen.getByLabelText("Password (required to save changes)");
    expect(password).toBeRequired();
    expect(password).toHaveAttribute("minlength", "5");
    await user.click(screen.getByRole("button", { name: "Save Changes" }));
    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a password to save profile changes.");
    expect(password).toHaveAttribute("aria-invalid", "true");
    expect(password).toHaveAccessibleDescription(expect.stringContaining("Enter a password to save profile changes."));
    await user.type(password, "abcd");
    await user.click(screen.getByRole("button", { name: "Save Changes" }));
    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a password with at least 5 characters.");
  });

  it("maps the API password-required fallback to field feedback", async () => {
    const user = userEvent.setup();
    globalThis.fetch = vi.fn().mockResolvedValue(response({ errors: [{ path: "Password", msg: "Password is required" }] }, 422));
    renderProfile();
    await user.type(screen.getByLabelText("Password (required to save changes)"), "valid-password");
    await user.click(screen.getByRole("button", { name: "Save Changes" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Enter a password to save profile changes.");
    expect(screen.queryByText("Update unsuccessful. Please try again.")).not.toBeInTheDocument();
  });

  it.each([
    [{ isLoadingMovies: true, movies: [] }, "Loading favorite movies..."],
    [{ movieError: "Movies could not be loaded. Please try again later.", movies: [] }, "Movies could not be loaded. Please try again later."],
    [{ movies: [] }, "Your favorite movies are not available in the current catalog."],
  ])("distinguishes unresolved favorite states", (props, message) => {
    renderProfile(props);
    const favorites = screen.getByRole("region", { name: "Favorite Movies" });
    expect(within(favorites).getByText(message)).toBeInTheDocument();
    expect(within(favorites).queryByText("You haven't added any favorite movies yet.")).not.toBeInTheDocument();
  });

  it("shows no favorites when the user has none", () => {
    renderProfile({}, { ...account, FavoriteMovies: [] });
    expect(screen.getByText("You haven't added any favorite movies yet.")).toBeInTheDocument();
  });

  it("removes a favorite from the section using returned persisted state", async () => {
    const user = userEvent.setup();
    globalThis.fetch = vi.fn().mockResolvedValue(response({ ...account, FavoriteMovies: [] }));
    renderProfile();
    expect(screen.getByRole("heading", { name: movie.title, level: 3 })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: `Remove from Favorites: ${movie.title}` }));
    expect(await screen.findByText("You haven't added any favorite movies yet.")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: movie.title })).not.toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem("user")).FavoriteMovies).toEqual([]);
  });

  it("guards pending updates and associates safe update failures", async () => {
    const user = userEvent.setup();
    let finish;
    globalThis.fetch = vi.fn(() => new Promise((resolve) => { finish = resolve; }));
    renderProfile();
    await user.type(screen.getByLabelText("Password (required to save changes)"), "valid-password");
    await user.click(screen.getByRole("button", { name: "Save Changes" }));
    const pending = screen.getByRole("button", { name: "Saving..." });
    expect(pending).toBeDisabled();
    expect(pending.closest("form")).toHaveAttribute("aria-busy", "true");
    await user.click(pending);
    expect(globalThis.fetch).toHaveBeenCalledOnce();
    await act(async () => finish(response({ message: "private error" }, 500)));
    expect(await screen.findByRole("alert")).toHaveTextContent("Update unsuccessful. Please try again.");
    expect(screen.getByRole("button", { name: "Save Changes" }).closest("form")).toHaveAccessibleDescription("Update unsuccessful. Please try again.");
  });

  it("focuses Cancel, traps keyboard focus, closes on Escape and restores focus", async () => {
    const user = userEvent.setup();
    renderProfile();
    const trigger = screen.getByRole("button", { name: "Delete Account" });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Delete Account" });
    const cancel = within(dialog).getByRole("button", { name: "Cancel" });
    const confirm = within(dialog).getByRole("button", { name: "Delete Account" });
    expect(dialog).toHaveAccessibleDescription("Delete your account permanently? This action cannot be undone.");
    expect(cancel).toHaveFocus();
    expect(document.getElementById("root")).toHaveAttribute("inert");
    await user.keyboard("{Shift>}{Tab}{/Shift}");
    expect(confirm).toHaveFocus();
    await user.tab();
    expect(cancel).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.getElementById("root")).not.toHaveAttribute("inert");
    await user.click(trigger);
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(trigger).toHaveFocus();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("guards pending deletion and presents failures inside the dialog", async () => {
    const user = userEvent.setup();
    let finish;
    globalThis.fetch = vi.fn(() => new Promise((resolve) => { finish = resolve; }));
    renderProfile();
    await user.click(screen.getByRole("button", { name: "Delete Account" }));
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: "Delete Account" }));
    const pending = within(dialog).getByRole("button", { name: "Deleting..." });
    expect(pending).toBeDisabled();
    expect(dialog).toHaveAttribute("aria-busy", "true");
    expect(dialog).toHaveFocus();
    await user.click(pending);
    await user.keyboard("{Escape}{Tab}");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveFocus();
    expect(globalThis.fetch).toHaveBeenCalledOnce();
    await act(async () => finish(response({ message: "private failure" }, 500)));
    expect(await within(dialog).findByRole("alert")).toHaveTextContent("Account deletion unsuccessful. Please try again.");
    expect(within(dialog).getByRole("button", { name: "Delete Account" })).toBeEnabled();
    expect(screen.queryByText("private failure")).not.toBeInTheDocument();
    expect(localStorage.getItem("token")).toBe("test-token");
  });

  it("deletes through the existing endpoint and clears the session", async () => {
    const user = userEvent.setup();
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, status: 204 });
    renderProfile();
    await user.click(screen.getByRole("button", { name: "Delete Account" }));
    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Delete Account" }));
    expect(await screen.findByText("Signed out")).toBeInTheDocument();
    expect(globalThis.fetch).toHaveBeenCalledWith("https://api.test/users/Ada", expect.objectContaining({ method: "DELETE", headers: { Authorization: "Bearer test-token" } }));
    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.getElementById("root")).not.toHaveAttribute("inert");
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});
