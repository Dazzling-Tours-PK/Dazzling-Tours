"use client";
import React from "react";

export interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  className?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRatingChange,
  maxStars = 5,
  size = "md",
  readonly = false,
  className = "",
}) => {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const handleStarClick = (starIndex: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starIndex + 1);
    }
  };

  return (
    <div className={`star-rating ${sizeClasses[size]} ${className}`}>
      {Array.from({ length: maxStars }, (_, index) => {
        const isFilled = index < Math.floor(rating);
        const isHalfFilled = index < rating && index >= Math.floor(rating);

        return (
          <button
            key={index}
            type="button"
            className={`star-btn ${isFilled ? "filled" : "empty"} ${
              readonly ? "readonly" : "clickable"
            }`}
            onClick={() => handleStarClick(index)}
            disabled={readonly}
            aria-label={`Rate ${index + 1} out of ${maxStars} stars`}
            aria-pressed={isFilled}
          >
            {isHalfFilled ? (
              <i className="bi bi-star-half" aria-hidden="true"></i>
            ) : (
              <i
                className={`bi bi-star${isFilled ? "-fill" : ""}`}
                aria-hidden="true"
              ></i>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
