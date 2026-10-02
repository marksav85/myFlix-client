import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Link, NavLink, useLocation } from "react-router-dom";

export const NavigationBar = ({ user, onLoggedOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButton = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, user]);

  const closeMenu = () => setIsMenuOpen(false);
  const navigationItems = user
    ? [{ to: "/", label: "Home" }, { to: "/profile", label: "My Profile" }]
    : [{ to: "/login", label: "Login" }, { to: "/signup", label: "Signup" }];

  const renderLinks = () => (
    <>
      {navigationItems.map(({ to, label }) => (
        <NavLink key={to} to={to} end className="nav-link" onClick={closeMenu}>
          {label}
        </NavLink>
      ))}
      {user && (
        <button type="button" className="button button-secondary" onClick={() => {
          closeMenu();
          onLoggedOut();
        }}>
          Logout
        </button>
      )}
    </>
  );

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <header className="border-b border-border-subtle bg-surface-1">
        <nav aria-label="Main navigation" className="page-container" onKeyDown={(event) => {
          if (event.key === "Escape" && isMenuOpen) {
            event.preventDefault();
            closeMenu();
            menuButton.current?.focus();
          }
        }}>
          <div className="flex min-h-[72px] items-center justify-between gap-4 py-3">
            <Link to="/" onClick={closeMenu} className="inline-flex min-h-[44px] items-center rounded-control text-2xl font-extrabold tracking-tight text-primary">
              myFlix
            </Link>
            <div className="hidden items-center gap-2 sm:flex">{renderLinks()}</div>
            <button ref={menuButton} type="button" className="button button-secondary sm:hidden"
              aria-controls="mobile-menu" aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}
              onClick={() => setIsMenuOpen((open) => !open)}>
              <svg aria-hidden="true" focusable="false" className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
          <div id="mobile-menu" hidden={!isMenuOpen} className="border-t border-border-subtle pb-4 pt-3 sm:hidden">
            <div className="flex flex-col items-stretch gap-2">{renderLinks()}</div>
          </div>
        </nav>
      </header>
    </>
  );
};

NavigationBar.propTypes = {
  user: PropTypes.object,
  onLoggedOut: PropTypes.func.isRequired,
};
