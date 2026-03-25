"use client";
import React from "react";

export interface LoadingProps {
  variant?: "spinner" | "dots" | "skeleton" | "pulse";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "success" | "warning" | "error" | "gray";
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  variant = "spinner",
  size = "md",
  color = "primary",
  text,
  fullScreen = false,
  className = "",
}) => {
  const sizeValues = {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
  };

  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    success: "text-success",
    warning: "text-warning",
    error: "text-danger",
    gray: "text-muted",
  };

  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  const renderSpinner = () => (
    <div
      className={`spinner-border ${colorClasses[color]}`}
      role="status"
      aria-hidden="true"
      style={{
        width: sizeValues[size],
        height: sizeValues[size],
        borderWidth: size === "xs" || size === "sm" ? "1.5px" : "2.5px",
      }}
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );

  const renderDots = () => (
    <div
      className={`loading-dots`}
      style={{ width: sizeValues[size], height: sizeValues[size] }}
    >
      <div className={`dot ${colorClasses[color]}`}></div>
      <div className={`dot ${colorClasses[color]}`}></div>
      <div className={`dot ${colorClasses[color]}`}></div>
    </div>
  );

  const renderSkeleton = () => (
    <div
      className={`skeleton ${colorClasses[color]}`}
      style={{ width: sizeValues[size], height: sizeValues[size] }}
    >
      <div className="skeleton-content"></div>
    </div>
  );

  const renderPulse = () => (
    <div
      className={`pulse ${colorClasses[color]}`}
      style={{ width: sizeValues[size], height: sizeValues[size] }}
    >
      <div className="pulse-content"></div>
    </div>
  );

  const renderLoading = () => {
    switch (variant) {
      case "dots":
        return renderDots();
      case "skeleton":
        return renderSkeleton();
      case "pulse":
        return renderPulse();
      default:
        return renderSpinner();
    }
  };

  const containerClasses = [
    "loading-container",
    "d-flex",
    "flex-column",
    "align-items-center",
    "justify-content-center",
    fullScreen && "loading-fullscreen",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={containerClasses}
      style={{
        display: !text ? "inline-flex" : "flex",
        verticalAlign: "middle",
        height: text ? "auto" : "1em",
        lineHeight: 1,
      }}
    >
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100%", width: "100%" }}
      >
        {renderLoading()}
      </div>
      {text && (
        <div
          className={`loading-text ${textSizeClasses[size]} ${colorClasses[color]} mt-2`}
        >
          {text}
        </div>
      )}
    </div>
  );
};

// Preset loading components for common use cases
export const LoadingSpinner: React.FC<Omit<LoadingProps, "variant">> = (
  props,
) => <Loading variant="spinner" {...props} />;

export const LoadingDots: React.FC<Omit<LoadingProps, "variant">> = (props) => (
  <Loading variant="dots" {...props} />
);

export const LoadingSkeleton: React.FC<Omit<LoadingProps, "variant">> = (
  props,
) => <Loading variant="skeleton" {...props} />;

export const LoadingPulse: React.FC<Omit<LoadingProps, "variant">> = (
  props,
) => <Loading variant="pulse" {...props} />;

// Full screen loading overlay
export const LoadingOverlay: React.FC<Omit<LoadingProps, "fullScreen">> = (
  props,
) => <Loading fullScreen={true} {...props} />;

export default Loading;
