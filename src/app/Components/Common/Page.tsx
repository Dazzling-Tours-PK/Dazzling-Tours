"use client";
import React from "react";
import Loading from "./Loading";

export interface PageProps {
  title: string;
  description?: string;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  loadingVariant?: "spinner" | "dots" | "skeleton" | "pulse";
  loadingSize?: "xs" | "sm" | "md" | "lg" | "xl";
  loadingColor?:
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "error"
    | "gray";
}

const Page: React.FC<PageProps> = ({
  title,
  description,
  headerActions,
  children,
  className = "",
  loading = false,
  loadingVariant = "spinner",
  loadingSize = "xs",
  loadingColor = "primary",
}) => {
  return (
    <div className={`admin-page ${className}`}>
      <div className="page-header">
        <div className="header-content">
          <div className="header-text" style={{ minHeight: "36px" }}>
            <h1
              className="page-title d-flex align-items-center m-0"
              style={{ position: "relative", display: "inline-flex" }}
            >
              {title}
              {loading && (
                <div
                  style={{
                    position: "absolute",
                    left: "100%",
                    marginLeft: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Loading
                    variant={loadingVariant}
                    size={loadingSize}
                    color={loadingColor}
                  />
                </div>
              )}
            </h1>
            {description && (
              <p className="page-description m-0">{description}</p>
            )}
          </div>
          {headerActions && (
            <div className="header-actions">{headerActions}</div>
          )}
        </div>
      </div>

      <div className="page-content">{children}</div>
    </div>
  );
};

export default Page;
