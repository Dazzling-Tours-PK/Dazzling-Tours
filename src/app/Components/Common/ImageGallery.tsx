"use client";
import React, { useState } from "react";
import Image from "next/image";

export interface ImageGalleryProps {
  images: string[];
  alt?: string;
  className?: string;
  showThumbnails?: boolean;
  aspectRatio?: "square" | "4/3" | "16/9" | "auto";
  maxHeight?: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  alt = "Gallery image",
  className = "",
  showThumbnails = true,
  aspectRatio = "4/3",
  maxHeight = 400,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={`image-gallery-empty ${className}`}>
        <i className="bi bi-image"></i>
        <p>No images available</p>
      </div>
    );
  }

  const aspectRatioClass = {
    square: "aspect-square",
    "4/3": "aspect-4-3",
    "16/9": "aspect-16-9",
    auto: "aspect-auto",
  }[aspectRatio];

  return (
    <div className={`image-gallery ${className}`}>
      {/* Main Image */}
      <div className="gallery-main">
        <div className={`gallery-image-container ${aspectRatioClass}`}>
          <Image
            src={images[selectedIndex]}
            alt={`${alt} ${selectedIndex + 1}`}
            fill
            className="gallery-main-image"
            style={{ maxHeight: `${maxHeight}px` }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                className="gallery-nav gallery-nav-prev"
                onClick={() =>
                  setSelectedIndex(
                    selectedIndex === 0 ? images.length - 1 : selectedIndex - 1,
                  )
                }
                disabled={images.length <= 1}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button
                className="gallery-nav gallery-nav-next"
                onClick={() =>
                  setSelectedIndex(
                    selectedIndex === images.length - 1 ? 0 : selectedIndex + 1,
                  )
                }
                disabled={images.length <= 1}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="gallery-counter">
              {selectedIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="gallery-thumbnails">
          {images.map((image, index) => (
            <button
              key={index}
              className={`thumbnail-item ${
                index === selectedIndex ? "active" : ""
              }`}
              onClick={() => setSelectedIndex(index)}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="thumbnail-image"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
