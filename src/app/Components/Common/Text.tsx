"use client";
import React from "react";

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** Size variant */
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  /** Font weight */
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  /** Text color */
  color?:
    | "default"
    | "dimmed"
    | "muted"
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
  /** Strike through text */
  strikethrough?: boolean;
  /** Italic text */
  italic?: boolean;
  /** Truncate text with ellipsis */
  truncate?: boolean;
  /** Component to render as */
  component?: "p" | "span" | "div" | "label" | "strong" | "em" | "small";
  children: React.ReactNode;
}

const Text: React.FC<TextProps> = ({
  size = "md",
  weight = 400,
  color = "default",
  align,
  transform,
  lineHeight,
  underline = false,
  strikethrough = false,
  italic = false,
  truncate = false,
  component = "p",
  className = "",
  style,
  children,
  ...rest
}) => {
  const Component = component;

  // Size mapping
  const sizeMap = {
    xs: { fontSize: "0.75rem", lineHeight: "1.4" },
    sm: { fontSize: "0.875rem", lineHeight: "1.5" },
    md: { fontSize: "1rem", lineHeight: "1.6" },
    lg: { fontSize: "1.125rem", lineHeight: "1.6" },
    xl: { fontSize: "1.25rem", lineHeight: "1.5" },
  };

  const sizeStyles = sizeMap[size];

  // Color mapping
  const colorMap = {
    default: "#2c3e50",
    dimmed: "#6c757d",
    muted: "#9ca3af",
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
    textDecoration: underline
      ? "underline"
      : strikethrough
      ? "line-through"
      : "none",
    fontStyle: italic ? "italic" : "normal",
    overflow: truncate ? "hidden" : undefined,
    textOverflow: truncate ? "ellipsis" : undefined,
    whiteSpace: truncate ? "nowrap" : undefined,
    ...style,
  };

  const classes = [
    `ui-text`,
    `ui-text-${size}`,
    truncate && "ui-text-truncate",
    className,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    <Component className={classes} style={mergedStyle} {...rest}>
      {children}
    </Component>
  );
};

export default Text;
