import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./movie-view.scss";

export const MovieView = ({ movies, user, setUser, token }) => {
  const { movieId } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const isFavorited = user.FavoriteMovies.includes(movieId);
    setIsFavorite(isFavorited);
  }, []);

  const removeFavorite = () => {
    fetch(
      `https://my-flix-films-d4434240379d.herokuapp.com/users/${user.Username}/movies/${movieId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data) {
          setIsFavorite(false);
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
        }
      });
  };

  const addToFavorite = () => {
    fetch(
      `https://my-flix-films-d4434240379d.herokuapp.com/users/${user.Username}/movies/${movieId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data) {
          setIsFavorite(true);
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
        }
      });
  };

  const movie = movies.find((m) => m.id === movieId);

  return (
    <div className="flex items-center justify-center min-h-screen py-4">
      <div className="flex flex-col lg:flex-row w-11/12 lg:w-4/5 bg-white shadow-md rounded-lg overflow-hidden">
        {/* Left side image */}
        <img
          className="w-full lg:w-1/2 object-cover"
          src={movie.image}
          alt={movie.title}
        />
        {/* Right side content */}
        <div className="flex flex-col justify-between w-full lg:w-1/2 p-6">
          <div>
            <div className="font-bold text-xl lg:text-2xl mb-2">
              {movie.title}
            </div>
            <div className="mb-4">
              <p className="text-base lg:text-lg">{movie.description}</p>
            </div>
            <div className="mb-4">
              <p className="text-base lg:text-lg">Genre: {movie.genre}</p>
              <p className="text-base lg:text-lg">Director: {movie.director}</p>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            {isFavorite ? (
              <button
                className="px-4 py-2 font-bold rounded text-sm lg:text-base"
                onClick={removeFavorite}
              >
                Remove from favorites
              </button>
            ) : (
              <button
                className="px-4 py-2 font-bold rounded text-sm lg:text-base"
                onClick={addToFavorite}
              >
                Add to favorites
              </button>
            )}
            <Link to={`/`} className="inline-block">
              <button className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded text-sm lg:text-base">
                Back
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
