import React, { useState } from "react";
import PropTypes from "prop-types";
import { useParams, Link } from "react-router-dom";
import { api } from "../../api/client";
import { useAppContext } from "../../contexts/AppContext";

export const MovieView = ({ movies }) => {
  const { movieId } = useParams();
  const [error, setError] = useState("");
  const [isUpdatingFavorite, setIsUpdatingFavorite] = useState(false);
  const { user, token, updateUser, handleApiError } = useAppContext();
  const movie = movies.find((item) => item.id === movieId);
  const isFavorite = user?.FavoriteMovies?.includes(movieId) || false;

  if (!movie) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="mb-4">Movie not found.</p>
          <Link to="/">Back to movies</Link>
        </div>
      </div>
    );
  }

  const updateFavorite = async () => {
    setError("");
    setIsUpdatingFavorite(true);
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
      setIsUpdatingFavorite(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-4">
      <div className="flex flex-col lg:flex-row w-11/12 lg:w-4/5 bg-white shadow-md rounded-lg overflow-hidden">
        <img className="w-full lg:w-1/2 object-cover" src={movie.image} alt={movie.title} />
        <div className="flex flex-col justify-between w-full lg:w-1/2 p-6">
          <div>
            <div className="font-bold text-xl lg:text-2xl mb-2">{movie.title}</div>
            <div className="mb-4"><p className="text-base lg:text-lg">{movie.description}</p></div>
            <div className="mb-4">
              <p className="text-base lg:text-lg">Genre: {movie.genre}</p>
              <p className="text-base lg:text-lg">Director: {movie.director}</p>
            </div>
            {error && <p className="text-yellow-700" role="alert">{error}</p>}
          </div>
          <div className="flex justify-between mt-4">
            <button className="px-4 py-2 font-bold rounded text-sm lg:text-base" onClick={updateFavorite} disabled={isUpdatingFavorite}>
              {isUpdatingFavorite ? "Updating..." : isFavorite ? "Remove from favorites" : "Add to favorites"}
            </button>
            <Link to="/" className="inline-block">
              <span className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded text-sm lg:text-base">Back</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

MovieView.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      genre: PropTypes.string.isRequired,
      director: PropTypes.string.isRequired,
      image: PropTypes.string,
    })
  ).isRequired,
};
