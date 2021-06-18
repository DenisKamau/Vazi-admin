import React from "react";
import axios from "../../axios";
import { Nav, Navbar, Container } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";
import swal from "sweetalert";
import { useStateValue } from "../../StateProvider";
import "./Header.css";

export default function Header() {
  const [{ authenticate }, dispatch] = useStateValue();

  const signOut = () => {
    axios.post("/account/admin/logout").then((resp) => {
      if (resp.status === 200) {
        swal({
          title: "Logged out",
          button: false,
          icon: "success",
          timer: 1700,
        });
        localStorage.clear();
        dispatch({
          type: "LOGOUT_REQUEST",
        });
      } else {
        swal({
          title: "Signout failed",
          button: false,
          icon: "error",
          timer: 1700,
        });
      }
    });
  };

  const renderLoggedInLinks = () => {
    return (
      <Nav>
        <li className="nav-item">
          <button onClick={signOut} className="signOut_button">
            Signout
          </button>
        </li>
      </Nav>
    );
  };

  const renderNotLoggedInLinks = () => {
    return (
      <Nav>
        <li className="nav-item">
          <NavLink to="/signin" className="nav-link">
            Login
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/signup" className="nav-link">
            Signup
          </NavLink>
        </li>
      </Nav>
    );
  };

  return (
    <div className="header">
      <Navbar bg="dark" variant="dark" expand="lg" style={{ zIndex: "1" }}>
        <Container fluid>
          {/* <Navbar.Brand href="#home">Admin Dashboard</Navbar.Brand> */}
          <Link to="/" className="navbar-brand">
            Admin Dashboard
          </Link>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {/* <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link> */}
              {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
            </Nav>
            {authenticate ? renderLoggedInLinks() : renderNotLoggedInLinks()}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
