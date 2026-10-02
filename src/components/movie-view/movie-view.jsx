import React, { useId } from "react";
import PropTypes from "prop-types";
import { useParams, Link } from "react-router-dom";
import { useFavorite } from "../../hooks/useFavorite";

export const MovieView = ({ movies }) => {
  const { movieId } = useParams();
  const { isFavorite, isPending, error, toggleFavorite } = useFavorite(movieId);
  const errorId = useId();
  const movie = movies.find((item) => item.id === movieId);

  if (!movie) {
    return (
      <section className="surface p-6 sm:p-8" aria-labelledby="movie-not-found-title">
        <h1 id="movie-not-found-title" className="mb-6 text-heading-lg-mobile sm:text-heading-lg">Movie not found.</h1>
        <Link to="/" className="button button-secondary">Back to Movies</Link>
      </section>
    );
  }

  return (
    <article className="movie-detail" aria-labelledby="movie-detail-title">
      <img className="movie-detail-poster" src={movie.image} alt={`${movie.title} poster`} />
      <div className="min-w-0 p-6 md:p-8 lg:p-10">
        <h1 id="movie-detail-title" className="mb-6 break-words text-heading-lg-mobile sm:text-heading-lg">{movie.title}</h1>
        <p className="mb-8 whitespace-pre-line break-words text-body-lg text-text-secondary">{movie.description}</p>
        <dl className="mb-8 space-y-4 text-body-lg">
          <div>
            <dt className="text-label text-text-muted">Genre</dt>
            <dd className="mt-1 break-words">{movie.genre}</dd>
          </div>
          <div>
            <dt className="text-label text-text-muted">Director</dt>
            <dd className="mt-1 break-words">{movie.director}</dd>
          </div>
        </dl>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button type="button" className="button button-primary" onClick={toggleFavorite}
            disabled={isPending} aria-busy={isPending} aria-pressed={isFavorite}
            aria-describedby={error ? errorId : undefined}>
            {isPending ? "Updating..." : isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
          <Link to="/" className="button button-secondary">Back to Movies</Link>
        </div>
        {error && <p id={errorId} role="alert" className="mt-4 text-body text-text-secondary">{error}</p>}
      </div>
    </article>
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
