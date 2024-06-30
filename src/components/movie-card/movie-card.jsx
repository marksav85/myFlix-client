/* eslint-disable react/prop-types */
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./movie-card.scss";

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
          <p className="text-gray-700 mb-2">{movie.description}</p>
          <p className="text-gray-700 mb-2">Genre: {movie.genre}</p>
          <p className="text-gray-700 mb-2">Director: {movie.director}</p>
        </div>
        <div className="text-center mt-4">
          <Link to={`/movies/${encodeURIComponent(movie.id)}`}>
            <button
              id="button"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded"
            >
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
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    Genre: PropTypes.shape({
      Name: PropTypes.string.isRequired,
    }),
    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired,
    }),
  }).isRequired,
};
