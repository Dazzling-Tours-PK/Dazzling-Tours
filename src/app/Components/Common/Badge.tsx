"use client";
import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "filled" | "light" | "outline" | "dot";
  color?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "gray"
    | "blue";
  size?: "xs" | "sm" | "md" | "lg";
  radius?: "xs" | "sm" | "md" | "lg" | "xl" | "round";
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = React.memo(
  ({
    variant = "filled",
    color = "primary",
    size = "md",
    radius = "xl",
    className = "",
    children,
    ...rest
  }) => {
    // Bootstrap base class
    const baseClasses = "badge";

    // Bootstrap color classes - using text-bg-* for filled variant
    const getColorClass = () => {
      if (variant === "filled") {
        const colorMap = {
          primary: "text-bg-primary",
          secondary: "text-bg-secondary",
          success: "text-bg-success",
          warning: "text-bg-warning",
          error: "text-bg-danger", // Bootstrap uses 'danger' instead of 'error'
          gray: "text-bg-secondary",
          blue: "text-bg-info", // Using info for blue
        };
        return colorMap[color];
      } else if (variant === "light") {
        const colorMap = {
          primary: "bg-primary-subtle text-primary",
          secondary: "bg-secondary-subtle text-secondary",
          success: "bg-success-subtle text-success",
          warning: "bg-warning-subtle text-warning",
          error: "bg-danger-subtle text-danger",
          gray: "bg-secondary-subtle text-secondary",
          blue: "bg-info-subtle text-info",
        };
        return colorMap[color];
      } else if (variant === "outline") {
        const colorMap = {
          primary: "border border-primary text-primary bg-transparent",
          secondary: "border border-secondary text-secondary bg-transparent",
          success: "border border-success text-success bg-transparent",
          warning: "border border-warning text-warning bg-transparent",
          error: "border border-danger text-danger bg-transparent",
          gray: "border border-secondary text-secondary bg-transparent",
          blue: "border border-info text-info bg-transparent",
        };
        return colorMap[color];
      }
      return "";
    };

    // Size classes - Bootstrap doesn't have badge sizes, so we'll use custom classes
    const sizeClasses = {
      xs: "badge-xs",
      sm: "badge-sm",
      md: "",
      lg: "badge-lg",
    };

    // Radius classes using Bootstrap utilities
    const radiusClasses = {
      xs: "rounded-0",
      sm: "rounded-1",
      md: "rounded-2",
      lg: "rounded-3",
      xl: "rounded-pill",
      round: "rounded-pill",
    };

    const classes = [
      baseClasses,
      getColorClass(),
      sizeClasses[size],
      radiusClasses[radius],
      className,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    return (
      <span className={classes} {...rest}>
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export default Badge;
