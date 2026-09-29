import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";
import { ApiError } from "../api/client";

// Create a context with a default value (null in this case)
const AppContext = createContext(null);

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
};

const storageKeys = ["user", "token"];

const clearStoredAuth = () => {
  storageKeys.forEach((key) => localStorage.removeItem(key));
};

const readStoredAuth = () => {
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token || !storedUser) {
    clearStoredAuth();
    return { user: null, token: null };
  }

  try {
    const user = JSON.parse(storedUser);
    if (!user || typeof user !== "object" || !user.Username) {
      throw new Error("Invalid stored user");
    }
    return { user, token };
  } catch {
    clearStoredAuth();
    return { user: null, token: null };
  }
};

// Create a provider component
export const AppProvider = ({ children }) => {
  const [{ user, token }, setAuth] = useState(readStoredAuth);
  const [sessionNotice, setSessionNotice] = useState("");

  const persistAuth = useCallback((nextUser, nextToken = token) => {
    localStorage.setItem("user", JSON.stringify(nextUser));
    localStorage.setItem("token", nextToken);
    setAuth({ user: nextUser, token: nextToken });
  }, [token]);

  const login = useCallback((nextUser, nextToken) => {
    persistAuth(nextUser, nextToken);
    setSessionNotice("");
  }, [persistAuth]);

  const updateUser = useCallback(
    (nextUser) => persistAuth(nextUser),
    [persistAuth]
  );

  const logout = useCallback((notice = "") => {
    clearStoredAuth();
    setAuth({ user: null, token: null });
    setSessionNotice(notice);
  }, []);

  const clearSessionNotice = useCallback(() => setSessionNotice(""), []);

  const handleApiError = useCallback((error) => {
    if (error instanceof ApiError && [401, 403].includes(error.status)) {
      logout("Your session has expired. Please sign in again.");
      return true;
    }
    return false;
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      sessionNotice,
      login,
      updateUser,
      logout,
      handleApiError,
      clearSessionNotice,
    }),
    [
      user,
      token,
      sessionNotice,
      login,
      updateUser,
      logout,
      handleApiError,
      clearSessionNotice,
    ]
  );

  return (
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
