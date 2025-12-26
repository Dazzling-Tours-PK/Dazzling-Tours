// Example usage of PaginationComponent
import React, { useState } from "react";
import PaginationComponent from "@/app/Components/Common/PaginationComponent";
import { Pagination } from "@/lib/types/common";

// Example component showing how to use PaginationComponent
const ExamplePaginationUsage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Mock pagination data
  const pagination: Pagination = {
    total: 150,
    page: currentPage,
    limit: pageSize,
    pages: Math.ceil(150 / pageSize),
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Here you would typically trigger a new API call
    console.log(`Page changed to: ${page}`);
  };

  return (
    <div>
      <h2>Example Pagination Usage</h2>
      <p>Current page: {currentPage}</p>

      <PaginationComponent
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={pageSize}
      />
    </div>
  );
};

export default ExamplePaginationUsage;
