"use client";
import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "default" | "bordered" | "shadow" | "flat";
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  padding = "md",
  variant = "default",
  className = "",
  children,
  style,
  ...rest
}) => {
  const paddingStyles: Record<string, React.CSSProperties> = {
    xs: { padding: "0.5rem" },
    sm: { padding: "0.75rem" },
    md: { padding: "1rem" },
    lg: { padding: "1.5rem" },
    xl: { padding: "2rem" },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      backgroundColor: "#ffffff",
      border: "1px solid #e9ecef",
      borderRadius: "8px",
    },
    bordered: {
      backgroundColor: "#ffffff",
      border: "1px solid #e9ecef",
      borderRadius: "8px",
    },
    shadow: {
      backgroundColor: "#ffffff",
      border: "1px solid #e9ecef",
      borderRadius: "8px",
      boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
    },
    flat: {
      backgroundColor: "#f8f9fa",
      borderRadius: "8px",
    },
  };

  return (
    <div
      className={className}
      style={{
        ...paddingStyles[padding],
        ...variantStyles[variant],
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Card;
