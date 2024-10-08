/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const MovieCard = ({ movie }) => {
  return (
    <div
      id="card"
      className="flex flex-col h-full bg-white shadow-md rounded-lg overflow-hidden"
    >
      <img
        className="w-full h-64 object-contain"
        src={movie.image}
        alt={movie.title}
      />
      <div className="flex flex-col justify-between flex-grow p-4">
        <div>
          <h2 className="text-lg font-bold mb-2">{movie.title}</h2>
          <p className="mb-2">{movie.description}</p>
          <p className="mb-2">Genre: {movie.genre}</p>
          <p className="mb-2">Director: {movie.director}</p>
        </div>
        <div className="text-center mt-4">
          <Link to={`/movies/${encodeURIComponent(movie.id)}`}>
            <button id="button" className="px-4 py-2 font-bold rounded">
              Open
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    genre: PropTypes.string.isRequired,
    director: PropTypes.string.isRequired,
  }).isRequired,
};
