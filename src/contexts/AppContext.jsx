import React, { createContext, useContext } from "react";

// Create a context with a default value (null in this case)
const AppContext = createContext(null);

// Custom hook to use the AppContext
export const useAppContext = () => {
  return useContext(AppContext);
};

// Create a provider component
export const AppProvider = ({ children }) => {
  // Define the baseUrl
  const baseUrl = "https://movie-api-mreb.onrender.com";

  return (
    <AppContext.Provider value={{ baseUrl }}>{children}</AppContext.Provider>
  );
};
