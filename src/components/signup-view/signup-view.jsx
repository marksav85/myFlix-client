import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";

export const SignupView = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);

  const refresh = () => window.location.reload(true);

  const handleSubmit = (event) => {
    event.preventDefault();

    function checkPasswordConfirmation(password, confirmPassword) {
      if (password !== confirmPassword) {
        return false;
      } else {
        return true;
      }
    }

    if (checkPasswordConfirmation(password, confirmPassword)) {
      // The passwords match, so submit the form
    } else {
      // The passwords do not match, so show an error message
      alert("The passwords do not match. Please try again.");
      window.location.reload();
    }

    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday,
    };

    fetch("https://my-flix-films-d4434240379d.herokuapp.com/users", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.ok) {
        setSuccess(true);
      } else {
        setFail(true);
      }
    });
  };

  return (
    <Row className="justify-content-md-center">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="signUpFormUsername">
          <Form.Label>Username:</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength="5"
          />
        </Form.Group>

        <Form.Group controlId="signUpFormPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="signUpFormConfirmPassword">
          <Form.Label>Confirm Password:</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="signUpFormEmail">
          <Form.Label>Email:</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="signUpFormBirthday">
          <Form.Label>Birthday:</Form.Label>
          <Form.Control
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
          />
        </Form.Group>
        <div>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
      <div>
        {success && (
          <div>
            <Alert variant="success">
              Sign up successful. Account created.
            </Alert>
            <Link to={"/login"}>
              <Button variant="success">Login</Button>
            </Link>
          </div>
        )}
        {fail && (
          <div>
            <Alert variant="warning">
              Unsuccessful. Unable to create account. Please try again.
            </Alert>
            <Button variant="secondary" onClick={refresh}>
              Close
            </Button>
          </div>
        )}
      </div>
    </Row>
  );
};
