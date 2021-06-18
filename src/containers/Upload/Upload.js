import React, { useState, useEffect } from "react";
import "./Upload.css";
import { Button, Form, Input } from "antd";
import FileUpload from "../../utils/FileUpload";
import { useHistory } from "react-router-dom";
import axios from "../../axios";
import Layout from "../../components/Layout/Layout";
import swal from "sweetalert";

const { TextArea } = Input;

const Upload = () => {
  const [Categories, setCategories] = useState([]);
  const [Title, setTitle] = useState("");
  const [Quantity, setQuantity] = useState("");
  const [Description, setDescription] = useState("");
  const [Price, setPrice] = useState("");
  const [Category, setCategory] = useState("");
  const [Images, setImages] = useState([]);
  const history = useHistory();

  useEffect(() => {
    axios.get("/category/getcategory").then((resp) => {
      if (resp.status === 200) {
        const { categoryList } = resp.data;
        setCategories(categoryList);
      } else {
        swal("Failed to fetch Categories!", {
          buttons: false,
          timer: 1700,
        });
      }
    });
    return () => {
      setCategories([]);
    };
  }, []);

  const onTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const onDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const onPriceChange = (e) => {
    setPrice(e.target.value);
  };

  const onQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const updateImages = (newImages) => {
    setImages(newImages);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!Title || !Description || !Price || !Images || !Quantity || !Category) {
      return swal("All fields Required!", {
        buttons: false,
        icon: "error",
        timer: 1700,
      });
    }
    const variables = {
      title: Title,
      price: Price,
      description: Description,
      quantity: Quantity,
      images: Images,
      category: Category,
    };

    const ac = new AbortController();

    console.log(variables);

    axios
      .post("/product/createProduct", variables, { signal: ac.signal })
      .then((resp) => {
        if (resp.data.success) {
          swal({
            title: "Product Added!",
            button: false,
            icon: "success",
            timer: 1700,
          });
          history.push("/products");
          setTitle("");
          setPrice("");
          setDescription("");
          setImages([]);
          setCategory("");
          setQuantity("");
          ac.abort();
        } else {
          swal("Failed to upload product!", {
            buttons: false,
            icon: "error",
            timer: 2000,
          });
          ac.abort();
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <Layout sidebar>
      <div className="upload">
        <h1>Upload Product</h1>
        <FileUpload updateImages={updateImages} />
        <Form className="uploadForm" onSubmit={onSubmit}>
          <label>Title</label>
          <Input
            style={{
              marginBottom: "25px",
              padding: "10px",
              width: window.innerWidth <= 675 ? "100%" : "800px",
            }}
            value={Title}
            type="text"
            onChange={onTitleChange}
          />

          <label>Description</label>
          <TextArea style={{ marginBottom: "25px", padding: "10px" }} value={Description} type="text" onChange={onDescriptionChange} />
          <label>Price(Kshs)</label>
          <Input style={{ marginBottom: "25px", padding: "10px" }} value={Price} type="text" onChange={onPriceChange} />
          <label>Quantity</label>
          <Input style={{ marginBottom: "25px", padding: "10px" }} value={Quantity} type="text" onChange={onQuantityChange} />
          <select
            className="form-control"
            value={Category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <option>Select Category</option>
            {Categories.length > 0
              ? Categories.map((category) => {
                  const { _id, name } = category;
                  return (
                    <>
                      <option key={_id}>{name}</option>
                      {category.children.length > 0
                        ? category.children.map((categ) => {
                            const { _id, name } = categ;
                            return <option key={_id}> {name} </option>;
                          })
                        : null}
                    </>
                  );
                })
              : null}
          </select>
        </Form>
        <Button
          onClick={onSubmit}
          style={{
            backgroundColor: "lightblue",
            height: "40px",
            fontWeight: "600",
            letterSpacing: "1px",
            borderRadius: "7px",
            width: window.innerWidth <= 675 ? "100%" : "300px",
            margin: " 0 auto",
            cursor: "pointer",
          }}
        >
          Submit
        </Button>
      </div>
    </Layout>
  );
};

export default Upload;
