"use client";
import React from "react";
import { Pagination } from "@/lib/types/common";
import "./PaginationComponent.css";

interface PaginationComponentProps {
  pagination: Pagination;
  currentPage: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  className?: string;
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  pagination,
  currentPage,
  onPageChange,
  pageSize = 10,
  className = "",
}) => {
  if (!pagination || pagination.pages <= 1 || pagination.total <= pageSize) {
    return null;
  }

  const getVisiblePages = () => {
    const pages: number[] = [];
    const totalPages = pagination.pages;

    // Always show first page
    pages.push(1);

    // Show pages around current page
    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Always show last page if it's not already included
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages.sort((a, b) => a - b);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`pagination ${className}`}>
      <div className="pagination-info">
        Showing {(currentPage - 1) * pageSize + 1} to{" "}
        {Math.min(currentPage * pageSize, pagination.total)} of{" "}
        {pagination.total} items
      </div>

      <div className="pagination-controls">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1 || pagination.pages <= 1}
          className="btn btn-outline-secondary btn-sm"
          aria-label="Previous page"
        >
          <i className="bi bi-chevron-left"></i> Previous
        </button>

        <div className="page-numbers">
          {visiblePages.map((page, index) => {
            const showEllipsis =
              index > 0 && page - visiblePages[index - 1] > 1;

            return (
              <React.Fragment key={page}>
                {showEllipsis && (
                  <span className="ellipsis" aria-label="More pages">
                    ...
                  </span>
                )}
                <button
                  onClick={() => onPageChange(page)}
                  className={`btn btn-sm ${
                    page === currentPage
                      ? "btn-primary"
                      : "btn-outline-secondary"
                  }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={page === currentPage ? "page" : undefined}
                >
                  {page}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= pagination.pages || pagination.pages <= 1}
          className="btn btn-outline-secondary btn-sm"
          aria-label="Next page"
        >
          Next <i className="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default PaginationComponent;
