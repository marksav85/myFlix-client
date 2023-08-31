/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Figure } from "react-bootstrap";

function FavoriteMovies({ favoriteMovies }) {
  return (
    <>
      <Row>
        <Col xs={12}>
          <h4>Your Favorite Movies:</h4>
        </Col>
      </Row>

      <Row>
        {favoriteMovies.map((movie) => {
          return (
            <Col xs={12} md={6} lg={3} key={movie.id} className="fav-movie">
              <Figure>
                <Link to={`/movies/${movie.id}`}>
                  <Figure.Image src={movie.image} alt={movie.title} />
                  <Figure.Caption>{movie.title}</Figure.Caption>
                </Link>
              </Figure>
            </Col>
          );
        })}
      </Row>
    </>
  );
}

export default FavoriteMovies;
