import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { Link } from "react-router-dom";
import { Col, Container, Modal, Row, Table } from "react-bootstrap";
import axios from "../../axios";
import "./Products.css";

const Products = () => {
  const [Products, setProducts] = useState([]);
  const [ProductDetails, setProductDetails] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    getInitialData();
    return () => {
      setProducts([]);
    };
  }, []);

  const handleShow = () => setShow(!show);

  const getInitialData = async () => {
    const resp = await axios.post("/getProducts");
    console.log(resp);

    if (resp.status === 200) {
      const { products } = resp.data;
      setProducts(products);
    }
  };

  const renderProducts = () => {
    return (
      <Table className="table" style={{ fontSize: 14 }} striped bordered hover variant="dark" responsive="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {Products.map((product) => {
            const { _id, title, price, quantity, category } = product;
            return (
              <tr onClick={() => showProductDetailModal(product)} key={_id}>
                <td>*</td>
                <td>{title}</td>
                <td>{price}</td>
                <td> {quantity} </td>
                <td>{category}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  };

  const showProductDetailModal = (product) => {
    setShow(true);
    setProductDetails(product);
  };

  const renderProductDetail = () => {
    if (!ProductDetails) {
      return null;
    }

    return (
      <Modal show={show} onHide={handleShow}>
        <Modal.Header closeButton={() => setShow(false)}>
          <Modal.Title>Product Details </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md="6">
              <label className="key">Name</label>
              <p className="value">{ProductDetails.title}</p>
            </Col>
            <Col md="6">
              <label className="key">Price</label>
              <p className="value">{ProductDetails.price}</p>
            </Col>
          </Row>
          <Row>
            <Col md="6">
              <label className="key">Quantity</label>
              <p className="value">{ProductDetails.quantity}</p>
            </Col>
            <Col md="6">
              <label className="key">Category</label>
              <p className="value">{ProductDetails.category}</p>
            </Col>
          </Row>
          <Row>
            <Col md="12">
              <label className="key">Description</label>
              <p className="value">{ProductDetails.description}</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <label className="key">Images</label>
              <div style={{ display: "flex" }}>
                {ProductDetails.images.map((image) => {
                  return (
                    <div className="images">
                      <img alt="product" src={`http://localhost:7000/${image}`} />
                    </div>
                  );
                })}
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    );
  };

  return (
    <div>
      <Layout sidebar>
        <Container>
          <Row style={{ marginTop: "10px" }}>
            <Col md={12}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Products</h3>
                <Link to="/upload">
                  <button>Add</button>
                </Link>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div>{renderProducts()}</div>
            </Col>
          </Row>
        </Container>
        {renderProductDetail()}
      </Layout>
    </div>
  );
};

export default Products;
