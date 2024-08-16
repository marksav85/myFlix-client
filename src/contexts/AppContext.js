import React, { createContext, useContext } from "react";

// Create a context with default value
const AppContext = createContext(null);

// Custom hook to use the BaseUrlContext
export const useAppContext = () => {
  return useContext(AppContext);
};

// Create a provider component
export const AppProvider = ({ children }) => {
  // Define the baseUrl
  const baseUrl = "https://movie-api-mreb.onrender.com";

  return <AppContext.Provider value={baseUrl}>{children}</AppContext.Provider>;
};
