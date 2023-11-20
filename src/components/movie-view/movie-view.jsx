/* eslint-disable react/prop-types */
import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import "./movie-view.scss";
import { Card } from "react-bootstrap";

export const MovieView = ({ movies, user, setUser, token }) => {
  const { movieId } = useParams();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const isFavorited = user.FavoriteMovies.includes(movieId);
    setIsFavorite(isFavorited);
  }, []);

  const removeFavorite = () => {
    fetch(
      `https://my-flix-films-d4434240379d.herokuapp.com/users/${user.Username}/movies/${movieId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data) {
          setIsFavorite(false);
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
        }
      });
  };

  const addToFavorite = () => {
    fetch(
      `https://my-flix-films-d4434240379d.herokuapp.com/users/${user.Username}/movies/${movieId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        if (data) {
          setIsFavorite(true);
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
        }
      });
  };

  const movie = movies.find((m) => m.id === movieId);

  return (
    <Card id="movie-view" className="h-100">
      <Card.Img variant="top" className="mov-img" src={movie.image} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>{movie.description}</Card.Text>
        <Card.Text>Genre: {movie.genre}</Card.Text>
        <Card.Text>Director: {movie.director}</Card.Text>
        <div className="movie-view-buttons">
          {isFavorite ? (
            <Button
              id="button"
              variant="primary"
              size="sm"
              onClick={removeFavorite}
            >
              Remove from favorites
            </Button>
          ) : (
            <Button
              id="button"
              variant="primary"
              size="sm"
              onClick={addToFavorite}
            >
              Add to favorites
            </Button>
          )}

          <Link to={`/`}>
            <Button variant="secondary" size="sm">
              Back
            </Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};
