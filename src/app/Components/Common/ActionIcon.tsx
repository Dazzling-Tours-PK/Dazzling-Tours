"use client";
import React from "react";

export interface ActionIconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "light" | "outline" | "subtle" | "transparent";
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "gray";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  radius?: "xs" | "sm" | "md" | "lg" | "xl" | "round";
  loading?: boolean;
  children: React.ReactNode;
}

const ActionIcon: React.FC<ActionIconProps> = React.memo(
  ({
    variant = "filled",
    color = "primary",
    size = "md",
    radius = "md",
    loading = false,
    disabled = false,
    className = "",
    children,
    ...rest
  }) => {
    const baseClasses = "action-icon";

    const variantClasses = {
      filled: "action-icon-filled",
      light: "action-icon-light",
      outline: "action-icon-outline",
      subtle: "action-icon-subtle",
      transparent: "action-icon-transparent",
    };

    const colorClasses = {
      primary: "action-icon-primary",
      secondary: "action-icon-secondary",
      success: "action-icon-success",
      warning: "action-icon-warning",
      error: "action-icon-error",
      gray: "action-icon-gray",
    };

    const sizeClasses = {
      xs: "action-icon-xs",
      sm: "action-icon-sm",
      md: "action-icon-md",
      lg: "action-icon-lg",
      xl: "action-icon-xl",
    };

    const radiusClasses = {
      xs: "action-icon-radius-xs",
      sm: "action-icon-radius-sm",
      md: "action-icon-radius-md",
      lg: "action-icon-radius-lg",
      xl: "action-icon-radius-xl",
      round: "action-icon-radius-round",
    };

    const classes = [
      baseClasses,
      variantClasses[variant],
      colorClasses[color],
      sizeClasses[size],
      radiusClasses[radius],
      loading && "action-icon-loading",
      disabled && "action-icon-disabled",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Debug log
    console.log("ActionIcon props:", { variant, color, size, radius });
    console.log("ActionIcon classes:", classes);

    return (
      <button className={classes} disabled={disabled || loading} {...rest}>
        {loading ? (
          <i className="bi bi-arrow-clockwise action-icon-spinner"></i>
        ) : (
          children
        )}
      </button>
    );
  },
);

ActionIcon.displayName = "ActionIcon";

export default ActionIcon;
