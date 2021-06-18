import React from "react";
import Header from "../Header/Header";
import { Col, Container, Row } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./Layout.css";

const Layout = (props) => {
  return (
    <>
      <Header />

      {props.sidebar ? (
        <Container fluid>
          <Row>
            <Col md={2} className="sidebar">
              <ul className="sidebar_List">
                <li>
                  <NavLink activeClassName="active" exact to={"/"}>
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink activeClassName="active" to={"/category"}>
                    Category
                  </NavLink>
                </li>
                <li>
                  <NavLink activeClassName="active" to={"/products"}>
                    Products
                  </NavLink>
                </li>
                <li>
                  <NavLink activeClassName="active" to={"/orders"}>
                    Orders
                  </NavLink>
                </li>
              </ul>
            </Col>
            <Col md={10} style={{ marginLeft: "auto" }}>
              {props.children}
            </Col>
          </Row>
        </Container>
      ) : (
        props.children
      )}
    </>
  );
};

export default Layout;
