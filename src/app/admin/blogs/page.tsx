"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  useGetBlogs,
  useUpdateBlog,
  useDeleteBlog,
  useBulkUpdateBlogs,
  useNotification,
  useGetCategories,
} from "@/lib/hooks";
import PaginationComponent from "@/app/Components/Common/PaginationComponent";
import { TextInput, Select } from "@/app/Components/Form";
import { Group, Stack, Page, Button } from "@/app/Components/Common";
import { UNCATEGORIZED_CATEGORY_NAME } from "@/lib/constants/categories";

const BlogsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterFeatured, setFilterFeatured] = useState("all");
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const { data: blogsData, isLoading: loading } = useGetBlogs({
    page: currentPage,
    limit: pageSize,
    status: filterStatus === "all" ? undefined : filterStatus,
    category: filterCategory === "all" ? undefined : filterCategory,
    featured:
      filterFeatured === "all"
        ? undefined
        : filterFeatured === "true"
          ? true
          : false,
    search: searchTerm || undefined,
  });

  const updateBlogMutation = useUpdateBlog();
  const deleteBlogMutation = useDeleteBlog();
  const bulkUpdateBlogsMutation = useBulkUpdateBlogs();
  const { showSuccess, showError } = useNotification();

  const blogs = useMemo(() => blogsData?.data || [], [blogsData?.data]);
  const pagination = blogsData?.pagination;

  // Fetch categories for the filter dropdown
  const { data: categoriesData } = useGetCategories({ limit: 1000 });
  const categoryFilterOptions = useMemo(() => {
    const categories = categoriesData?.data || [];
    return [
      { value: "all", label: "All Categories" },
      ...categories.map((cat) => ({
        value: cat.name,
        label: cat.name,
      })),
    ];
  }, [categoriesData]);

  // Calculate statistics
  const stats = useMemo(() => {
    const allBlogs = blogsData?.data || [];
    return {
      total: blogsData?.pagination?.total || 0,
      published: allBlogs.filter((b) => b.status === "Published").length,
      drafts: allBlogs.filter((b) => b.status === "Draft").length,
      featured: allBlogs.filter((b) => b.featured).length,
    };
  }, [blogsData]);

  const deleteBlog = (id: string) => {
    if (confirm("Are you sure you want to delete this blog?")) {
      deleteBlogMutation.mutate(id, {
        onSuccess: () => {
          showSuccess("Blog deleted successfully!");
        },
        onError: (error) => {
          showError(error.message || "Failed to delete blog");
        },
      });
    }
  };

  const toggleFeatured = (id: string, currentFeatured: boolean) => {
    const newFeaturedValue = !currentFeatured;
    updateBlogMutation.mutate(
      {
        _id: id,
        featured: newFeaturedValue,
      },
      {
        onSuccess: () => {
          showSuccess(
            `Blog ${newFeaturedValue ? "featured" : "unfeatured"} successfully!`,
          );
        },
        onError: (error) => {
          showError(error.message || "Failed to update blog");
        },
      },
    );
  };

  const toggleStatus = (id: string, currentStatus: string) => {
    updateBlogMutation.mutate(
      {
        _id: id,
        status: currentStatus === "Published" ? "Draft" : "Published",
      },
      {
        onSuccess: () => {
          showSuccess(
            `Blog status updated to ${
              currentStatus === "Published" ? "Draft" : "Published"
            }!`,
          );
        },
        onError: (error) => {
          showError(error.message || "Failed to update blog status");
        },
      },
    );
  };

  const bulkUpdateStatus = (status: string) => {
    if (selectedBlogs.length === 0) {
      showError("Please select blogs to update");
      return;
    }

    bulkUpdateBlogsMutation.mutate(
      {
        ids: selectedBlogs,
        action: "updateStatus",
        data: { status },
      },
      {
        onSuccess: () => {
          showSuccess(`${selectedBlogs.length} blog(s) updated successfully!`);
          setSelectedBlogs([]);
        },
        onError: (error) => {
          showError(error.message || "Failed to update blogs");
        },
      },
    );
  };

  const bulkDelete = () => {
    if (selectedBlogs.length === 0) {
      showError("Please select blogs to delete");
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete ${selectedBlogs.length} blog(s)?`,
      )
    ) {
      bulkUpdateBlogsMutation.mutate(
        {
          ids: selectedBlogs,
          action: "delete",
        },
        {
          onSuccess: () => {
            showSuccess(
              `${selectedBlogs.length} blog(s) deleted successfully!`,
            );
            setSelectedBlogs([]);
          },
          onError: (error) => {
            showError(error.message || "Failed to delete blogs");
          },
        },
      );
    }
  };

  const toggleBlogSelection = (id: string) => {
    setSelectedBlogs((prev) =>
      prev.includes(id)
        ? prev.filter((blogId) => blogId !== id)
        : [...prev, id],
    );
  };

  const selectAllBlogs = () => {
    const allBlogIds = blogs.map((blog) => blog._id);
    setSelectedBlogs(
      selectedBlogs.length === allBlogIds.length ? [] : allBlogIds,
    );
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Published":
        return "status-badge success";
      case "Draft":
        return "status-badge warning";
      case "Archived":
        return "status-badge secondary";
      default:
        return "status-badge secondary";
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    const colors = [
      "badge-primary",
      "badge-secondary",
      "badge-success",
      "badge-danger",
      "badge-warning",
      "badge-info",
    ];
    const hash = category.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  // Reset to first page when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setFilterCategory(value);
    setCurrentPage(1);
  };

  const handleFeaturedChange = (value: string) => {
    setFilterFeatured(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Page
      title="Blogs Management"
      description="Manage your blog posts, view statistics, and update blog information"
      loading={loading}
      headerActions={
        <Link href="/admin/blogs/add" className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> Add New Blog
        </Link>
      }
    >
      <Stack>
        {/* Statistics Cards */}
        <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e3f2fd" }}>
              <i className="bi bi-file-text" style={{ color: "#1976d2" }}></i>
            </div>
            <div className="stat-content">
              <h4>Total Blogs</h4>
              <p>{stats.total}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e8f5e9" }}>
              <i
                className="bi bi-check-circle"
                style={{ color: "#388e3c" }}
              ></i>
            </div>
            <div className="stat-content">
              <h4>Published</h4>
              <p>{stats.published}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#fff3e0" }}>
              <i
                className="bi bi-file-earmark"
                style={{ color: "#f57c00" }}
              ></i>
            </div>
            <div className="stat-content">
              <h4>Drafts</h4>
              <p>{stats.drafts}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#fce4ec" }}>
              <i className="bi bi-star-fill" style={{ color: "#c2185b" }}></i>
            </div>
            <div className="stat-content">
              <h4>Featured</h4>
              <p>{stats.featured}</p>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedBlogs.length > 0 && (
          <div
            className="bulk-actions"
            style={{
              background: "#fff3cd",
              border: "1px solid #ffc107",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div className="bulk-info" style={{ fontWeight: 600 }}>
              <i className="bi bi-check-circle me-2"></i>
              {selectedBlogs.length} blog(s) selected
            </div>
            <div
              className="bulk-buttons"
              style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
            >
              <Button
                size="sm"
                color="success"
                onClick={() => bulkUpdateStatus("Published")}
              >
                <i className="bi bi-check-circle"></i> Publish Selected
              </Button>
              <Button
                size="sm"
                color="warning"
                onClick={() => bulkUpdateStatus("Draft")}
              >
                <i className="bi bi-file-text"></i> Set as Draft
              </Button>
              <Button
                size="sm"
                color="secondary"
                onClick={() => bulkUpdateStatus("Archived")}
              >
                <i className="bi bi-archive"></i> Archive Selected
              </Button>
              <Button size="sm" color="error" onClick={bulkDelete}>
                <i className="bi bi-trash"></i> Delete Selected
              </Button>
              <Button
                size="sm"
                color="secondary"
                variant="outline"
                onClick={() => setSelectedBlogs([])}
              >
                <i className="bi bi-x-circle"></i> Clear Selection
              </Button>
            </div>
          </div>
        )}

        {/* Filters */}
        <Group>
          <TextInput
            placeholder="Search blogs by title, content, author, or category..."
            value={searchTerm}
            onChange={handleSearchChange}
            leftIcon={<i className="bi bi-search"></i>}
            style={{ flex: 1, minWidth: "250px" }}
          />

          <Select
            value={filterStatus}
            onChange={handleStatusChange}
            data={[
              { value: "all", label: "All Status" },
              { value: "Published", label: "Published" },
              { value: "Draft", label: "Draft" },
              { value: "Archived", label: "Archived" },
            ]}
            style={{ minWidth: "150px" }}
          />

          <Select
            value={filterCategory}
            onChange={handleCategoryChange}
            data={categoryFilterOptions}
            searchable
            style={{ minWidth: "180px" }}
          />

          <Select
            value={filterFeatured}
            onChange={handleFeaturedChange}
            data={[
              { value: "all", label: "All Blogs" },
              { value: "true", label: "Featured Only" },
              { value: "false", label: "Non-Featured Only" },
            ]}
            style={{ minWidth: "160px" }}
          />
        </Group>

        {/* Blogs Table */}
        <div className="blogs-table">
          <table>
            <thead>
              <tr>
                <th style={{ width: "50px", textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={
                      selectedBlogs.length === blogs.length && blogs.length > 0
                    }
                    onChange={selectAllBlogs}
                    style={{ cursor: "pointer" }}
                  />
                </th>
                <th>Title</th>
                <th style={{ textAlign: "center" }}>Author</th>
                <th style={{ textAlign: "center" }}>Category</th>
                <th style={{ textAlign: "center" }}>Status</th>
                <th style={{ textAlign: "center" }}>Featured</th>
                <th style={{ textAlign: "center" }}>Published</th>
                <th style={{ width: "120px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={selectedBlogs.includes(blog._id)}
                      onChange={() => toggleBlogSelection(blog._id)}
                      style={{ cursor: "pointer" }}
                    />
                  </td>
                  <td>
                    <div className="blog-title">
                      <h6 style={{ margin: 0, marginBottom: "0.15rem" }}>
                        {blog.title}
                      </h6>
                      <p
                        className="excerpt"
                        style={{
                          margin: 0,
                          fontSize: "0.875rem",
                          color: "#6c757d",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {blog.excerpt?.substring(0, 100)}
                        {blog.excerpt && blog.excerpt.length > 100 && "..."}
                      </p>
                      {blog.tags && blog.tags.length > 0 && (
                        <div
                          className="tags"
                          style={{
                            display: "flex",
                            gap: "0.25rem",
                            flexWrap: "wrap",
                          }}
                        >
                          {blog.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="badge badge-secondary"
                              style={{
                                fontSize: "0.75rem",
                                padding: "0.25rem 0.5rem",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                          {blog.tags.length > 3 && (
                            <span
                              className="badge badge-secondary"
                              style={{
                                fontSize: "0.75rem",
                                padding: "0.25rem 0.5rem",
                              }}
                            >
                              +{blog.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <div className="author-info">
                      <strong>{blog.author || "N/A"}</strong>
                    </div>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <span
                      className={`badge ${getCategoryBadgeClass(
                        blog.category || UNCATEGORIZED_CATEGORY_NAME,
                      )}`}
                    >
                      {blog.category || UNCATEGORIZED_CATEGORY_NAME}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      onClick={() => toggleStatus(blog._id, blog.status)}
                      className={`status-badge ${getStatusBadgeClass(
                        blog.status,
                      )} clickable`}
                      style={{ cursor: "pointer", border: "none" }}
                    >
                      {blog.status}
                    </button>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      onClick={() =>
                        toggleFeatured(blog._id, blog.featured || false)
                      }
                      className="btn btn-sm btn-link p-0"
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                      title={
                        blog.featured
                          ? "Unfeature this blog"
                          : "Feature this blog"
                      }
                    >
                      {blog.featured ? (
                        <i
                          className="bi bi-star-fill"
                          style={{ color: "#ffc107", fontSize: "1.2rem" }}
                        ></i>
                      ) : (
                        <i
                          className="bi bi-star"
                          style={{ color: "#6c757d", fontSize: "1.2rem" }}
                        ></i>
                      )}
                    </button>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <div className="date-info">
                      {blog.publishedAt
                        ? new Date(blog.publishedAt).toLocaleDateString()
                        : "Not published"}
                      <br />
                      <small style={{ color: "#6c757d" }}>
                        {blog.publishedAt
                          ? new Date(blog.publishedAt).toLocaleTimeString()
                          : "Draft"}
                      </small>
                    </div>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <div
                      className="action-buttons"
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                        justifyContent: "center",
                      }}
                    >
                      <Link
                        href={`/admin/blogs/edit/${blog._id}`}
                        className="btn btn-sm btn-outline-primary"
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </Link>
                      <button
                        onClick={() => deleteBlog(blog._id)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {blogs.length === 0 && !loading && (
          <div
            className="no-data"
            style={{ textAlign: "center", padding: "3rem" }}
          >
            <i
              className="bi bi-inbox"
              style={{
                fontSize: "3rem",
                color: "#6c757d",
                marginBottom: "1rem",
              }}
            ></i>
            <p style={{ fontSize: "1.1rem", color: "#6c757d" }}>
              No blogs found
            </p>
            <Link href="/admin/blogs/add" className="btn btn-primary mt-3">
              <i className="bi bi-plus-circle"></i> Create Your First Blog
            </Link>
          </div>
        )}

        {/* Pagination */}
        {pagination && (
          <PaginationComponent
            pagination={pagination}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            pageSize={pageSize}
          />
        )}
      </Stack>
    </Page>
  );
};

export default BlogsList;
