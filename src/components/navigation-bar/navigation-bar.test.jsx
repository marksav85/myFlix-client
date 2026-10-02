import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { NavigationBar } from "./navigation-bar";

const renderNavigation = (props = {}, route = "/login") => render(
  <MemoryRouter initialEntries={[route]}>
    <NavigationBar onLoggedOut={vi.fn()} {...props} />
  </MemoryRouter>
);

describe("NavigationBar", () => {
  it("shows logged-out destinations and current-route semantics", () => {
    renderNavigation();
    expect(screen.getByRole("link", { name: "myFlix" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Login" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Signup" })).not.toHaveAttribute("aria-current");
    expect(screen.queryByRole("button", { name: "Logout" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute("href", "#main-content");
  });

  it("shows authenticated destinations and invokes logout", async () => {
    const user = userEvent.setup();
    const onLoggedOut = vi.fn();
    renderNavigation({ user: { Username: "Ada" }, onLoggedOut }, "/profile");
    expect(screen.getByRole("link", { name: "My Profile" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
    expect(screen.queryByRole("link", { name: "Login" })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Logout" }));
    expect(onLoggedOut).toHaveBeenCalledOnce();
  });

  it("opens by keyboard, closes on Escape, and restores toggle focus", async () => {
    const user = userEvent.setup();
    renderNavigation();
    const toggle = screen.getByRole("button", { name: "Open main menu" });
    const menu = document.getElementById(toggle.getAttribute("aria-controls"));
    expect(menu).toHaveAttribute("hidden");
    toggle.focus();
    await user.keyboard("{Enter}");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(menu).not.toHaveAttribute("hidden");
    within(menu).getByRole("link", { name: "Login" }).focus();
    await user.keyboard("{Escape}");
    expect(menu).toHaveAttribute("hidden");
    expect(toggle).toHaveFocus();
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the mobile disclosure when a destination is selected", async () => {
    const user = userEvent.setup();
    renderNavigation();
    const toggle = screen.getByRole("button", { name: "Open main menu" });
    const menu = document.getElementById(toggle.getAttribute("aria-controls"));
    await user.click(toggle);
    await user.click(within(menu).getByRole("link", { name: "Signup" }));
    expect(menu).toHaveAttribute("hidden");
    expect(screen.getByRole("link", { name: "Signup" })).toHaveAttribute("aria-current", "page");
  });
});
