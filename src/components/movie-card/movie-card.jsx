import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
export const MovieCard = ({ movies, onMovieClick }) => {
  return (
    <Card>
      <Card.Img variant="top" src={movies.image} />
      <Card.Body>
        <Card.Title>{movies.title}</Card.Title>
        <Card.Text>{movies.description}</Card.Text>
        <Card.Text>{movies.genre}</Card.Text>
        <Card.Text>{movies.director}</Card.Text>
        <Button variant="link" onClick={() => onMovieClick(movies)}>
          Open
        </Button>
      </Card.Body>
    </Card>
  );
};

MovieCard.propTypes = {
  movies: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    Genre: PropTypes.shape({
      Name: PropTypes.string.isRequired,
    }),
    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired,
    }),
  }).isRequired,
  onMovieClick: PropTypes.func.isRequired,
};
