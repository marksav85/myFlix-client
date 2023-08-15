import PropTypes from "prop-types";
export const MovieCard = ({ movies, onMovieClick }) => {
  return (
    <div
      onClick={() => {
        onMovieClick(movies);
      }}
    >
      {movies.title}
    </div>
  );
};