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
  const sizeClasses = {
    xs: "w-4 h-4",
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
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
      className={`spinner-border ${colorClasses[color]} ${sizeClasses[size]}`}
      role="status"
      aria-hidden="true"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );

  const renderDots = () => (
    <div className={`loading-dots ${sizeClasses[size]}`}>
      <div className={`dot ${colorClasses[color]}`}></div>
      <div className={`dot ${colorClasses[color]}`}></div>
      <div className={`dot ${colorClasses[color]}`}></div>
    </div>
  );

  const renderSkeleton = () => (
    <div className={`skeleton ${sizeClasses[size]} ${colorClasses[color]}`}>
      <div className="skeleton-content"></div>
    </div>
  );

  const renderPulse = () => (
    <div className={`pulse ${sizeClasses[size]} ${colorClasses[color]}`}>
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
    <div className={containerClasses}>
      {renderLoading()}
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
