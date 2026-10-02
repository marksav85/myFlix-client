import React from "react";
import PropTypes from "prop-types";
import { MovieCard } from "../movie-card/movie-card";

function FavoriteMovies({ favoriteMovies, isLoading = false, error = "", hasFavoriteIds = false }) {
  return (
    <section aria-labelledby="favorite-movies-title">
      <h2 id="favorite-movies-title" className="mb-6 text-heading-md">Favorite Movies</h2>
      {isLoading ? <p className="library-notice" role="status">Loading favorite movies...</p>
        : error ? <p className="library-notice" role="alert">{error}</p>
        : favoriteMovies.length === 0 ? <p className="library-notice" role="status">{hasFavoriteIds
          ? "Your favorite movies are not available in the current catalog."
          : "You haven't added any favorite movies yet."}</p>
        : <div className="movie-grid">{favoriteMovies.map((movie) => <MovieCard key={movie.id} movie={movie} headingLevel={3} />)}</div>}
    </section>
  );
}

FavoriteMovies.propTypes = {
  favoriteMovies: PropTypes.array.isRequired, isLoading: PropTypes.bool,
  error: PropTypes.string, hasFavoriteIds: PropTypes.bool,
};
export default FavoriteMovies;
