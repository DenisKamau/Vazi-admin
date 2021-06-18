import axios from "../../axios";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import Layout from "../../components/Layout/Layout";
import swal from "sweetalert";
import "./Category.css";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

const Category = () => {
  const [Categories, setCategories] = useState([]);
  const [CategoryName, setCategoryName] = useState("");
  const [ParentCategoryId, setParentCategoryId] = useState("");
  const [CategoryImage, setCategoryImage] = useState("");
  const [Loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [Update, setUpdate] = useState(false);
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);
  const [expandedArray, setExpandedArray] = useState([]);
  const [checkedArray, setCheckedArray] = useState([]);
  const [updateCategoryModal, setUpdateCategoryModal] = useState(false);

  useEffect(() => {
    axios.get("/category/getcategory").then((resp) => {
      if (resp.status === 200) {
        const { categoryList } = resp.data;
        setCategories(categoryList);
        setLoading(false);
      } else {
        swal("Failed to fetch Categories!", {
          buttons: false,
          timer: 1700,
        });
        setLoading(false);
      }
    });
    return () => {
      setCategories([]);
    };
  }, [Update]);

  const handleClose = () => {
    if (!CategoryName) {
      swal("FIll in all fields!", {
        buttons: false,
        icon: "error",
        timer: 1700,
      });
    } else {
      const variables = {
        name: CategoryName,
        parentId: ParentCategoryId,
      };

      const ac = new AbortController();

      axios
        .post("/category/create", variables, { signal: ac.signal })
        .then((resp) => {
          if (resp.data.success) {
            swal({
              title: "Category Successfully Created",
              button: false,
              icon: "success",
              timer: 1700,
            });

            setCategoryName("");
            setParentCategoryId("");
            setCategoryImage("");
            setUpdate(!Update);
            ac.abort();
          } else {
            swal("Failed to create", {
              buttons: false,
              timer: 2000,
            });
          }
          ac.abort();
        })
        .then(ac.abort())
        .catch((err) => console.error(err));

      setShow(false);
    }
  };

  const handleShow = () => setShow(!show);

  const handleUpdateModal = () => {
    setUpdateCategoryModal(!updateCategoryModal);
    const categories = renderCategories(Categories);

    checked.length > 0 &&
      checked.forEach((categoryId, index) => {
        const category = categories.find((category, _index) => categoryId === category.value);
        category && checkedArray.push(category);
      });
    expanded.length > 0 &&
      expanded.forEach((categoryId, index) => {
        const category = categories.find((category, _index) => categoryId === category.value);
        category && expandedArray.push(category);
      });

    setCheckedArray(checkedArray);
    setExpandedArray(expandedArray);
  };

  const renderCategories = (Categories) => {
    let myCategories = [];
    for (let category of Categories) {
      const { _id, name } = category;
      myCategories.push({
        label: name,
        value: _id,
        children: category.children.length > 0 && renderCategories(category.children),
      });
    }
    return myCategories;
  };

  const handleCategoryInput = (key, value, index, type) => {
    if (type === "checked") {
      const updatedCheckedArray = checkedArray.map((item, _index) => (index === _index ? { ...item, [key]: value } : item));
      setCheckedArray(updatedCheckedArray);
    } else if (type === "expanded") {
      const updatedExpandedArray = expandedArray.map((item, _index) => (index === _index ? { ...item, [key]: value } : item));
      setExpandedArray(updatedExpandedArray);
    }
  };

  return (
    <Layout sidebar>
      {Loading ? (
        <h3 style={{ textAlign: "center", letterSpacing: "2px" }}>Loading </h3>
      ) : (
        <>
          <Container>
            <Row>
              <Col md={12}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h3>Category</h3>
                  <button className="button" onClick={handleShow} style={{ marginTop: "10px" }}>
                    Add
                  </button>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <CheckboxTree
                  nodes={renderCategories(Categories)}
                  checked={checked}
                  expanded={expanded}
                  onCheck={(checked) => setChecked(checked)}
                  onExpand={(expanded) => setExpanded(expanded)}
                  icons={{
                    check: <CheckBoxIcon style={{ fontSize: 14 }} />,
                    uncheck: <CheckBoxOutlineBlankIcon style={{ fontSize: 14 }} />,
                    expandClose: <ArrowRightIcon style={{ fontSize: 14 }} />,
                    expandOpen: <ExpandLessIcon style={{ fontSize: 14 }} />,
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="update__buttons">
                  <button className="button" onClick={handleUpdateModal}>
                    Edit
                  </button>
                  <button className="button">Delete</button>
                </div>
              </Col>
            </Row>
          </Container>
          <Modal show={show} onHide={handleShow}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                type="text"
                placeholder="Category Name"
                className="input"
                value={CategoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                }}
                id="CategoryName"
              />

              <select
                className="form-control"
                value={ParentCategoryId}
                onChange={(e) => {
                  setParentCategoryId(e.target.value);
                }}
              >
                <option>Select Category</option>
                {Categories.map((category) => {
                  const { _id, name } = category;
                  return (
                    <>
                      <option key={_id} value={_id} name={name}>
                        {name}
                      </option>

                      {category.children.length > 0
                        ? category.children.map((cat) => {
                            const { _id, name } = cat;
                            return (
                              <option key={_id} value={_id} name={name}>
                                {name}
                              </option>
                            );
                          })
                        : null}
                    </>
                  );
                })}
              </select>

              <input
                type="file"
                style={{ marginTop: "5px" }}
                onChange={(e) => {
                  setCategoryImage(e.target.files[0]);
                }}
                id="CategoryImage"
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleClose}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Edit Categories */}
          <Modal size="lg" show={updateCategoryModal} onHide={handleUpdateModal}>
            <Modal.Header closeButton>
              <Modal.Title>Update Categories</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col>
                  <h6>Expanded</h6>
                </Col>
              </Row>

              {expandedArray.length > 0 &&
                expandedArray.map((item, index) => {
                  return (
                    <>
                      <Row key={index}>
                        <Col>
                          <input
                            type="text"
                            placeholder="Category Name"
                            className="input"
                            value={item.label}
                            onChange={(e) => handleCategoryInput("label", e.target.value, index, "expanded")}
                            id="ExpandedCategoryName"
                          />
                        </Col>
                        <Col>
                          <select
                            className="form-control"
                            value={item.parentId}
                            onChange={(e) => handleCategoryInput("parentId", e.target.value, index, "expanded")}
                          >
                            <option>Select Category</option>
                            {Categories.map((category) => {
                              const { _id, name } = category;
                              return (
                                <>
                                  <option key={_id} value={_id} name={name}>
                                    {name}
                                  </option>

                                  {category.children.length > 0
                                    ? category.children.map((cat) => {
                                        const { _id, name } = cat;
                                        return (
                                          <option key={_id} value={_id} name={name}>
                                            {name}
                                          </option>
                                        );
                                      })
                                    : null}
                                </>
                              );
                            })}
                          </select>
                        </Col>
                      </Row>
                    </>
                  );
                })}

              <Row>
                <Col>
                  <h6>Checked Categories</h6>
                </Col>
              </Row>

              {checkedArray.length > 0 &&
                checkedArray.map((item, index) => {
                  return (
                    <>
                      <Row key={index}>
                        <Col>
                          <input
                            type="text"
                            placeholder="Category Name"
                            className="input"
                            value={item.label}
                            onChange={(e) => handleCategoryInput("label", e.target.value, index, "checked")}
                            id="ExpandedCategoryName"
                          />
                        </Col>
                        <Col>
                          <select
                            className="form-control"
                            value={item.parentId}
                            onChange={(e) => handleCategoryInput("parentId", e.target.value, index, "checked")}
                          >
                            <option>Select Category</option>
                            {Categories.map((category) => {
                              const { _id, name } = category;
                              return (
                                <>
                                  <option key={_id} value={_id} name={name}>
                                    {name}
                                  </option>

                                  {category.children.length > 0
                                    ? category.children.map((cat) => {
                                        const { _id, name } = cat;
                                        return (
                                          <option key={_id} value={_id} name={name}>
                                            {name}
                                          </option>
                                        );
                                      })
                                    : null}
                                </>
                              );
                            })}
                          </select>
                        </Col>
                      </Row>
                    </>
                  );
                })}

              <input
                type="file"
                style={{ marginTop: "5px" }}
                onChange={(e) => {
                  setCategoryImage(e.target.files[0]);
                }}
                id="CategoryImage"
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleClose}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </Layout>
  );
};

export default Category;
