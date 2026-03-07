"use client";
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "light" | "outline" | "subtle" | "transparent";
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "gray";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  radius?: "xs" | "sm" | "md" | "lg" | "xl" | "round";
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = React.memo(
  ({
    variant = "filled",
    color = "primary",
    size = "md",
    radius = "md",
    loading = false,
    disabled = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = "",
    children,
    ...rest
  }) => {
    const baseClasses = "btn";

    const variantClasses = {
      filled: "", // Bootstrap's default filled style
      light: "btn-light",
      outline: "btn-outline",
      subtle: "btn-link", // Bootstrap's link style for subtle
      transparent: "btn-link", // Use link style for transparent
    };

    const colorClasses = {
      primary: "btn-primary",
      secondary: "btn-secondary",
      success: "btn-success",
      warning: "btn-warning",
      error: "btn-danger", // Bootstrap uses 'danger' instead of 'error'
      gray: "btn-secondary", // Use secondary for gray
    };

    const sizeClasses = {
      xs: "admin-btn-xs",
      sm: "admin-btn-sm",
      md: "admin-btn-md",
      lg: "admin-btn-lg",
      xl: "admin-btn-xl",
    };

    const radiusClasses = {
      xs: "rounded-0",
      sm: "rounded-1",
      md: "rounded-2",
      lg: "rounded-3",
      xl: "rounded-4",
      round: "rounded-pill",
    };

    const classes = [
      baseClasses,
      variantClasses[variant],
      colorClasses[color],
      sizeClasses[size],
      radiusClasses[radius],
      loading && "disabled",
      disabled && "disabled",
      fullWidth && "w-100",
      className,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    return (
      <button className={classes} disabled={disabled || loading} {...rest}>
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            ></span>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="me-2">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="ms-2">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
