import { useRef, useState } from "react";
import { api } from "../api/client";
import { useAppContext } from "../contexts/AppContext";

// Favorite membership remains owned by the returned user in AppContext.
export const useFavorite = (movieId) => {
  const { user, token, updateUser, handleApiError } = useAppContext();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const requestPending = useRef(false);
  const isFavorite = user?.FavoriteMovies?.includes(movieId) || false;

  const toggleFavorite = async () => {
    if (requestPending.current || !user || !token) return;
    requestPending.current = true;
    setIsPending(true);
    setError("");
    try {
      const updatedUser = isFavorite
        ? await api.removeFavorite(user.Username, movieId, token)
        : await api.addFavorite(user.Username, movieId, token);
      updateUser(updatedUser);
    } catch (requestError) {
      if (!handleApiError(requestError)) {
        setError("Favorites could not be updated. Please try again.");
      }
    } finally {
      requestPending.current = false;
      setIsPending(false);
    }
  };

  return { isFavorite, isPending, error, toggleFavorite };
};
