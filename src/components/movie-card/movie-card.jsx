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

MovieCard.propTypes = {
  movies: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    Genre: PropTypes.shape({
      Name: PropTypes.string.isRequired
    }),
    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired
    })
  }).isRequired,
  onMovieClick: PropTypes.func.isRequired
};
