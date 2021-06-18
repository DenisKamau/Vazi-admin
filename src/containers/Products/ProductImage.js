import React, { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";
import "./ProductImage.css";

const ProductImage = ({ image }) => {
  const [Images, setImages] = useState([]);

  useEffect(() => {
    if (image) {
      let images = [];

      image.map((image) => {
        images.push({
          original: `http://localhost:7000/${image}`,
          thumbnail: `http://localhost:7000/${image}`,
        });
      });
      setImages(images);
    }
  }, [image]);

  return (
    <div>
      <ImageGallery showNav={false} showFullscreenButton={false} showThumbnails={false} showPlayButton={false} items={Images} />
    </div>
  );
};

export default ProductImage;
