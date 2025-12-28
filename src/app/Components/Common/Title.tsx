"use client";
import React from "react";

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Heading order (1-6), determines which HTML element to render */
  order?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Size variant (overrides order for styling) */
  size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /** Font weight */
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  /** Text color */
  color?:
    | "default"
    | "dimmed"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error";
  /** Text alignment */
  align?: "left" | "center" | "right" | "justify";
  /** Transform text */
  transform?: "none" | "uppercase" | "lowercase" | "capitalize";
  /** Line height */
  lineHeight?: number | string;
  /** Underline text */
  underline?: boolean;
  /** Component to render as */
  component?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span";
  children: React.ReactNode;
}

const Title: React.FC<TitleProps> = ({
  order = 1,
  size,
  weight = 700,
  color = "default",
  align,
  transform,
  lineHeight,
  underline = false,
  component,
  className = "",
  style,
  children,
  ...rest
}) => {
  // Determine which HTML element to render
  const tagName =
    component ||
    (`h${order}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span");

  // Size mapping (if size prop is provided, use it; otherwise derive from order)
  const sizeMap = {
    h1: { fontSize: "2rem", lineHeight: "1.2" },
    h2: { fontSize: "1.75rem", lineHeight: "1.3" },
    h3: { fontSize: "1.5rem", lineHeight: "1.4" },
    h4: { fontSize: "1.25rem", lineHeight: "1.4" },
    h5: { fontSize: "1.125rem", lineHeight: "1.5" },
    h6: { fontSize: "1rem", lineHeight: "1.5" },
  };

  const effectiveSize = size || (`h${order}` as keyof typeof sizeMap);
  const sizeStyles = sizeMap[effectiveSize];

  // Color mapping
  const colorMap = {
    default: "#2c3e50",
    dimmed: "#6c757d",
    primary: "#fd7d02", // Orange theme color
    secondary: "#6c757d",
    success: "#28a745",
    warning: "#ffc107",
    error: "#dc3545",
  };

  const mergedStyle: React.CSSProperties = {
    margin: 0,
    fontFamily: '"Manrope", Arial, sans-serif',
    fontWeight: weight,
    fontSize: sizeStyles.fontSize,
    lineHeight: lineHeight || sizeStyles.lineHeight,
    color: colorMap[color],
    textAlign: align,
    textTransform: transform,
    textDecoration: underline ? "underline" : "none",
    ...style,
  };

  const classes = [`ui-title`, `ui-title-${effectiveSize}`, className]
    .filter(Boolean)
    .join(" ")
    .trim();

  // Use React.createElement to properly handle dynamic component types
  return React.createElement(
    tagName,
    {
      className: classes,
      style: mergedStyle,
      ...rest,
    },
    children
  );
};

export default Title;
