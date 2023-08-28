import React from "react";
import { Link } from "react-router-dom";

function FavoriteMovies({ favoriteMovies }) {
  return (
    <>
      <div>
        <h3>Your Favorite Movies:</h3>
        {favoriteMovies.map((movie) => {
          return (
            <div key={movie.id}>
              <img src={movie.image} />
              <Link to={`/movies/${movie.id}`}>
                <h4>{movie.title}</h4>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default FavoriteMovies;
