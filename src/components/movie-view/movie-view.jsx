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
    <Card className="h-100">
      <Card.Img variant="top" src={movie.image} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>{movie.description}</Card.Text>
        <Card.Text>{movie.genre}</Card.Text>
        <Card.Text>{movie.director}</Card.Text>
      </Card.Body>

      {isFavorite ? (
        <Button onClick={removeFavorite}>Remove from favorites</Button>
      ) : (
        <Button onClick={addToFavorite}>Add to favorites</Button>
      )}

      <Link to={`/`}>
        <button className="back-button">Back</button>
      </Link>
    </Card>
  );
};
