import React, { useState } from "react";
import Dropzone from "react-dropzone";
import AddIcon from "@material-ui/icons/Add";
import axios from "../axios";
import swal from "sweetalert";

const FileUpload = ({ updateImages }) => {
  const [Images, setImages] = useState([]);

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    // ========================
    //      Save to Server
    // ========================

    axios.post("/uploadImage", formData, config).then((resp) => {
      if (resp.data.success) {
        setImages([...Images, resp.data.image]);
        updateImages([...Images, resp.data.image]);
      } else {
        swal("Failed to upload image!", {
          buttons: false,
          icon: "error",
          timer: 2000,
        });
      }
    });
  };

  const deleteImage = (image) => {
    const currentIndex = Images.indexOf(image);

    let currentImages = [...Images];
    currentImages.splice(currentIndex, 1);

    setImages(currentImages);
    updateImages(currentImages);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "3rem",
        cursor: "pointer",
      }}
    >
      <Dropzone onDrop={onDrop} multiple={false} maxSize={80000000}>
        {({ getRootProps, getInputProps }) => (
          <div
            style={{
              width: "300px",
              height: "240px",
              border: "1px solid lightgray",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <AddIcon style={{ fontSize: "3rem" }} />
          </div>
        )}
      </Dropzone>

      <div
        style={{
          display: "flex",
          width: "350px",
          height: "240px",
          overflowX: "scroll",
        }}
      >
        {Images.map((image, index) => (
          <div key={index} onClick={() => deleteImage(image)}>
            <img
              style={{ minWidth: "250px", width: "250px", height: "240px" }}
              src={`http://localhost:7000/${image}`}
              alt={`http://localhost:7000/${index}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
