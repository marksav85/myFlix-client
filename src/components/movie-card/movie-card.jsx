import React, { useId } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useFavorite } from "../../hooks/useFavorite";

export const MovieCard = ({ movie, headingLevel = 2 }) => {
  const { isFavorite, isPending, error, toggleFavorite } = useFavorite(movie.id);
  const Heading = `h${headingLevel}`;
  const titleId = useId();
  const errorId = useId();

  return (
    <article className="movie-card" aria-labelledby={titleId}>
      <img className="aspect-[2/3] w-full object-cover" src={movie.image}
        alt={`${movie.title} poster`} loading="lazy" />
      <div className="flex flex-1 flex-col p-4">
        <Heading id={titleId} className="mb-3 line-clamp-2 min-h-[52px] break-words text-heading-sm">{movie.title}</Heading>
        <p className="mb-2 break-words text-body-sm text-text-secondary">Genre: {movie.genre}</p>
        <p className="mb-3 break-words text-body-sm text-text-secondary">Director: {movie.director}</p>
        <p className="mb-6 line-clamp-3 break-words text-body text-text-muted">{movie.description}</p>
        <div className="mt-auto flex flex-col gap-2">
          <Link to={`/movies/${encodeURIComponent(movie.id)}`} className="button button-secondary"
            aria-label={`View Details for ${movie.title}`}>View Details</Link>
          <button type="button" className="button button-primary" onClick={toggleFavorite}
            disabled={isPending} aria-busy={isPending} aria-pressed={isFavorite}
            aria-describedby={error ? errorId : undefined}
            aria-label={isPending ? `Updating... for ${movie.title}` : `${isFavorite ? "Remove from Favorites" : "Add to Favorites"}: ${movie.title}`}>
            {isPending ? "Updating..." : isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
          {error && <p id={errorId} role="alert" className="text-body-sm text-text-secondary">{error}</p>}
        </div>
      </div>
    </article>
  );
};

MovieCard.propTypes = {
  headingLevel: PropTypes.oneOf([2, 3]),
  movie: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    genre: PropTypes.string.isRequired,
    director: PropTypes.string.isRequired,
    image: PropTypes.string,
  }).isRequired,
};
