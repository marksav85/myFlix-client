import React, { useState } from "react";
import { Link } from "react-router-dom";

export const NavigationBar = ({ user, onLoggedOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav>
      <div className="max-w-7xl mx-auto px-2">
        <div className="relative flex items-center justify-between h-16">
          {/* Left-aligned logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="text-xl font-bold">
              <h1 className="text-4xl text-red-400">MyFlix</h1>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-gray-200 focus:outline-none focus:bg-gray-200 focus:text-gray-900"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen ? "true" : "false"}
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>

              {/* Hamburger icon */}
              <svg
                className={`h-6 w-6 ${isMenuOpen ? "hidden" : "block"}`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>

              {/* Close icon */}
              <svg
                className={`h-6 w-6 ${isMenuOpen ? "block" : "hidden"}`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          {/* Right-aligned navigation links */}
          <div className="hidden sm:flex sm:items-center sm:justify-end sm:space-x-4">
            {!user && (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium"
                  id="navlink"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-3 py-2 rounded-md text-sm font-medium"
                  id="navlink"
                >
                  Signup
                </Link>
              </>
            )}
            {user && (
              <>
                <Link
                  to="/"
                  className="px-3 py-2 rounded-md text-sm font-medium"
                  id="navlink"
                >
                  Home
                </Link>
                <Link
                  to="/profile"
                  className="px-3 py-2 rounded-md text-sm font-medium"
                  id="navlink"
                >
                  My Profile
                </Link>
                <a
                  onClick={onLoggedOut}
                  className="px-3 py-2 rounded-md text-sm font-medium"
                  id="navlink"
                >
                  Logout
                </a>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Mobile menu, toggle with Tailwind's responsive utilities */}
      <div
        className={`${isMenuOpen ? "block" : "hidden"} sm:hidden bg-gray-100`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {!user && (
            <>
              <Link
                to="/login"
                className="block px-3 py-2 rounded-md text-base font-medium"
                id="navlink"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-3 py-2 rounded-md text-base font-medium"
                id="navlink"
              >
                Signup
              </Link>
            </>
          )}
          {user && (
            <>
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium"
                id="navlink"
              >
                Home
              </Link>
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium"
                id="navlink"
              >
                My Profile
              </Link>
              <button
                onClick={onLoggedOut}
                className="block px-3 py-2 rounded-md text-base font-medium"
                id="navlink"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
