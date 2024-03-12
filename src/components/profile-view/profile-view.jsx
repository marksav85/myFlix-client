/* eslint-disable react/prop-types */
import React from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import UserInfo from "./user-info";
import FavoriteMovies from "./favorite-movies";
import UpdateUser from "./update-user";
import Alert from "react-bootstrap/Alert";

import "./profile-view.scss";

export const ProfileView = ({ user, token, setUser, movies }) => {
  const [username, setUsername] = useState(user.Username);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(user.Email);
  const [birthday, setBirthday] = useState(user.BirthDate);
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [show, setShow] = useState(true);

  const favoriteMovies = movies.filter((movie) =>
    user.FavoriteMovies.includes(movie.id)
  );

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
      Email: email,
      BirthDate: birthday,
    };

    fetch(
      `https://my-flix-films-d4434240379d.herokuapp.com/users/${user.Username}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          setFail(true);
        }
      })
      .then((data) => {
        if (data) {
          localStorage.setItem("user", JSON.stringify(data));
          setUser(data);
          setSuccess(true);
        }
      });
  };

  const handleDeleteUser = () => {
    fetch(
      `https://my-flix-films-d4434240379d.herokuapp.com/users/${user.Username}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ).then((response) => {
      if (response.ok) {
        setUser(null);
        localStorage.clear();
      }
    });
  };

  return (
    <Container>
      <Row>
        <Col xs={12} sm={6} className="user-containers">
          <Card id="user-info">
            <Card.Body>
              <UserInfo name={user.Username} email={user.Email} />
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} className="user-containers">
          <Card id="update-user">
            <Card.Body>
              <UpdateUser
                handleSubmit={handleSubmit}
                setUsername={setUsername}
                setPassword={setPassword}
                setEmail={setEmail}
                setBirthday={setBirthday}
              />
            </Card.Body>
          </Card>
          <div>
            {success && (
              <div>
                <Alert
                  variant="success"
                  onClose={() => setShow(false)}
                  dismissible
                >
                  Update successful.
                </Alert>
              </div>
            )}
            {fail && (
              <div>
                <Alert
                  variant="warning"
                  onClose={() => setShow(false)}
                  dismissible
                >
                  Update unsuccessful.
                </Alert>
              </div>
            )}
          </div>
        </Col>
      </Row>
      <FavoriteMovies favoriteMovies={favoriteMovies} />

      <Button id="button" variant="primary" onClick={handleShowModal}>
        Delete account
      </Button>
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete account</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure?</Modal.Body>
        <Modal.Footer>
          <Button id="button" onClick={handleDeleteUser}>
            Yes
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};
