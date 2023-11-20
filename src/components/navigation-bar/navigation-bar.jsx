import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./navigation-bar.scss";

export const NavigationBar = ({ user, onLoggedOut }) => {
  return (
    <Navbar id="navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <h1>MyFlix</h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {!user && (
              <>
                <Nav.Link as={Link} to="/login">
                  <h6>Login</h6>
                </Nav.Link>
                <Nav.Link as={Link} to="/signup">
                  <h6>Signup</h6>
                </Nav.Link>
              </>
            )}
            {user && (
              <>
                <Nav.Link as={Link} to="/">
                  <h6>Home</h6>
                </Nav.Link>
                <Nav.Link as={Link} to="/profile">
                  <h6>My Profile</h6>
                </Nav.Link>
                <Nav.Link onClick={onLoggedOut}>
                  <h6>Logout</h6>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
