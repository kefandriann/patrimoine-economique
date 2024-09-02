import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

function Header ({ setPage }) {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand onClick={() => setPage('patrimoine')}>Patrimoine Économique</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
        <Nav.Link onClick={() => setPage('possession')}>Possessions</Nav.Link>
          <Nav.Link onClick={() => setPage('patrimoine')}>Patrimoine</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;