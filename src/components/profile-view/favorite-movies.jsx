import React from "react";
import { Link } from "react-router-dom";

function FavoriteMovies({ favoriteMovies }) {
  return (
    <>
      <h4 className="text-lg font-bold mb-4">Your Favorite Movies:</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favoriteMovies.map((movie) => (
          <div key={movie.id} className="fav-movie">
            <Link to={`/movies/${movie.id}`}>
              <img
                src={movie.image}
                alt={movie.title}
                className="w-full rounded-lg shadow-md hover:shadow-lg transition duration-300"
              />
              <p className="text-center mt-2">{movie.title}</p>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

export default FavoriteMovies;
