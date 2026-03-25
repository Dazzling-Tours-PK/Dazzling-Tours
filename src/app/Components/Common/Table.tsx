"use client";
import React from "react";

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  highlightOnHover?: boolean;
  verticalSpacing?: "xs" | "sm" | "md" | "lg" | "xl";
  horizontalSpacing?: "xs" | "sm" | "md" | "lg" | "xl";
  fixedHeader?: boolean;
}

const Table: React.FC<TableProps> = ({
  striped = false,
  highlightOnHover = true,
  verticalSpacing = "sm",
  horizontalSpacing = "md",
  fixedHeader = false,
  className = "",
  children,
  style,
  ...rest
}) => {
  const getSpacing = (spacing: string) => {
    const map = {
      xs: "0.25rem",
      sm: "0.5rem",
      md: "0.75rem",
      lg: "1rem",
      xl: "1.5rem",
    };
    return map[spacing as keyof typeof map] || "0.75rem";
  };

  const vSpacing = getSpacing(verticalSpacing);
  const hSpacing = getSpacing(horizontalSpacing);

  return (
    <div
      className="table-responsive"
      style={{
        width: "100%",
        overflowX: "auto",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        border: "1px solid #f1f3f5",
        background: "#fff",
      }}
    >
      <table
        className={`custom-table ${striped ? "striped" : ""} ${
          highlightOnHover ? "highlight" : ""
        } ${className}`}
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          ...style,
        }}
        {...rest}
      >
        <style jsx>{`
          .custom-table :global(th) {
            padding: ${vSpacing} ${hSpacing};
            background-color: #f8f9fa;
            color: #495057;
            font-weight: 600;
            font-size: 0.825rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            text-align: left;
            border-bottom: 2px solid #f1f3f5;
            white-space: nowrap;
            ${fixedHeader ? "position: sticky; top: 0; z-index: 10;" : ""}
          }

          .custom-table :global(td) {
            padding: ${vSpacing} ${hSpacing};
            vertical-align: middle;
            border-bottom: 1px solid #f1f3f5;
            color: #212529;
            font-size: 0.875rem;
            transition: background 0.2s ease;
          }

          .custom-table.striped :global(tbody tr:nth-child(even)) {
            background-color: #fafbfc;
          }

          .custom-table.highlight :global(tbody tr:hover) {
            background-color: #f8f9fa;
          }

          .custom-table :global(tr:last-child td) {
            border-bottom: none;
          }

          .custom-table :global(th:first-child),
          .custom-table :global(td:first-child) {
            padding-left: 1.25rem;
          }

          .custom-table :global(th:last-child),
          .custom-table :global(td:last-child) {
            padding-right: 1.25rem;
          }
        `}</style>
        {children}
      </table>
    </div>
  );
};

export default Table;
