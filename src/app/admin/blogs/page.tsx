"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useGetBlogs,
  useCreateBlog,
  useUpdateBlog,
  useDeleteBlog,
  useNotification,
  useGetCategories,
  useAuth,
} from "@/lib/hooks";
import { useRouter } from "next/navigation";
import PaginationComponent from "@/app/Components/Common/PaginationComponent";
import { TextInput, Select } from "@/app/Components/Form";
import {
  Group,
  Stack,
  Page,
  Button,
  Badge,
  ConfirmModal,
  Table,
  Title,
  Text,
  Icon,
} from "@/app/Components/Common";
import { UNCATEGORIZED_CATEGORY_NAME } from "@/lib/constants/categories";
import { BlogStatus } from "@/lib/enums/blog";
import {
  getCategoryBadgeColor,
  getStatusBadgeClass,
  getStatusColor,
} from "@/lib/utils/blogUtils";

const BlogsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterFeatured, setFilterFeatured] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

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
  const createBlogMutation = useCreateBlog();
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
      published: allBlogs.filter((b) => b.status === BlogStatus.PUBLISHED)
        .length,
      drafts: allBlogs.filter((b) => b.status === BlogStatus.DRAFT).length,
      featured: allBlogs.filter((b) => b.featured).length,
    };
  }, [blogsData]);

  const deleteBlog = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteBlogMutation.mutate(deleteId, {
        onSuccess: () => {
          showSuccess("Blog deleted successfully!");
          setDeleteId(null);
        },
        onError: (error) => {
          showError(error.message || "Failed to delete blog");
          setDeleteId(null);
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
        status:
          currentStatus === BlogStatus.PUBLISHED
            ? BlogStatus.DRAFT
            : BlogStatus.PUBLISHED,
      },
      {
        onSuccess: () => {
          showSuccess(
            `Blog status updated to ${
              currentStatus === BlogStatus.PUBLISHED
                ? BlogStatus.DRAFT
                : BlogStatus.PUBLISHED
            }!`,
          );
        },
        onError: (error) => {
          showError(error.message || "Failed to update blog status");
        },
      },
    );
  };

  const handleCreateBlog = async () => {
    try {
      const result = await createBlogMutation.mutateAsync({
        title: "New Blog Draft",
        excerpt: "Draft excerpt. Write a brief overview here.",
        content: "<p>Start writing your blog content here...</p>",
        category: UNCATEGORIZED_CATEGORY_NAME,
        author: user ? `${user.firstName} ${user.lastName}` : "Admin", // Provide default author from logged in user
        status: BlogStatus.DRAFT,
        featured: false,
        tags: [],
        seo: {
          metaTitle: "",
          metaDescription: "",
          slug: "",
          focusKeyword: "",
          ogImage: "",
        },
      });

      if (result.success && result.data._id) {
        showSuccess("Draft created! Redirecting to editor...");
        router.push(`/admin/blogs/edit/${result.data._id}`);
      }
    } catch (err) {
      console.error("[BlogsList] Failed to create draft:", err);
      showError("Failed to create blog draft");
    }
  };

  // Blog display utilities are now imported from @/lib/utils/blogUtils

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
        <Button
          onClick={handleCreateBlog}
          loading={createBlogMutation.isPending}
        >
          <Icon name="plus-circle" /> Add New Blog
        </Button>
      }
    >
      <Stack>
        {/* Statistics Cards */}
        <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e3f2fd" }}>
              <Icon name="file-text" color="#1976d2" />
            </div>
            <div className="stat-content">
              <Title order={4} size="h5">
                Total Blogs
              </Title>
              <Text weight={700} size="lg">
                {stats.total}
              </Text>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#e8f5e9" }}>
              <Icon name="check-circle" color="#388e3c" />
            </div>
            <div className="stat-content">
              <Title order={4} size="h5">
                Published
              </Title>
              <Text weight={700} size="lg">
                {stats.published}
              </Text>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#fff3e0" }}>
              <Icon name="file-earmark" color="#f57c00" />
            </div>
            <div className="stat-content">
              <Title order={4} size="h5">
                Drafts
              </Title>
              <Text weight={700} size="lg">
                {stats.drafts}
              </Text>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: "#fce4ec" }}>
              <Icon name="star-fill" color="#c2185b" />
            </div>
            <div className="stat-content">
              <Title order={4} size="h5">
                Featured
              </Title>
              <Text weight={700} size="lg">
                {stats.featured}
              </Text>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Group>
          <TextInput
            placeholder="Search by title, author, or category..."
            value={searchTerm}
            onChange={handleSearchChange}
            leftIcon={<Icon name="search" />}
            style={{ flex: 1, minWidth: "450px" }}
          />

          <Select
            value={filterStatus}
            onChange={handleStatusChange}
            data={[
              { value: "all", label: "All Status" },
              { value: BlogStatus.PUBLISHED, label: "Published" },
              { value: BlogStatus.DRAFT, label: "Draft" },
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
        <Table verticalSpacing="sm" horizontalSpacing="md">
          <thead>
            <tr>
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
                <td>
                  <div
                    className="blog-title"
                    style={{
                      display: "flex",
                      gap: "1rem",
                      alignItems: "center",
                    }}
                  >
                    {blog.featuredImage ? (
                      <div
                        style={{
                          width: "64px",
                          height: "48px",
                          borderRadius: "6px",
                          overflow: "hidden",
                          flexShrink: 0,
                          border: "1px solid #eee",
                          position: "relative",
                        }}
                      >
                        <Image
                          src={blog.featuredImage}
                          alt={blog.title}
                          width={64}
                          height={48}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: "64px",
                          height: "48px",
                          borderRadius: "6px",
                          backgroundColor: "#f8f9fa",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: "1px solid #eee",
                          flexShrink: 0,
                        }}
                      >
                        <Icon
                          name="image"
                          color="#dee2e6"
                          size="1rem"
                        />
                      </div>
                    )}
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <Title order={6} size="h6" weight={700}>
                        {blog.title}
                      </Title>
                      <Text
                        className="excerpt"
                        size="xs"
                        color="dimmed"
                        style={{ lineHeight: 1.4 }}
                      >
                        {blog.excerpt?.substring(0, 80)}
                        {blog.excerpt && blog.excerpt.length > 80 && "..."}
                      </Text>
                      {blog.tags && blog.tags.length > 0 && (
                        <div
                          className="tags"
                          style={{
                            display: "flex",
                            gap: "0.25rem",
                            flexWrap: "wrap",
                            marginTop: "2px",
                          }}
                        >
                          {blog.tags.slice(0, 3).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="light"
                              color="secondary"
                              size="xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {blog.tags.length > 3 && (
                            <Badge variant="light" color="secondary" size="xs">
                              +{blog.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td style={{ textAlign: "center" }}>
                  <div className="author-info">
                    <Text weight={700} size="sm">
                      {blog.author || "N/A"}
                    </Text>
                  </div>
                </td>
                <td style={{ textAlign: "center" }}>
                  <Badge
                    variant="filled"
                    color={getCategoryBadgeColor(
                      blog.category || UNCATEGORIZED_CATEGORY_NAME,
                    )}
                    size="sm"
                    style={{ textTransform: "uppercase" }}
                  >
                    {blog.category || UNCATEGORIZED_CATEGORY_NAME}
                  </Badge>
                </td>
                <td style={{ textAlign: "center" }}>
                  <Button
                    onClick={() => toggleStatus(blog._id, blog.status)}
                    variant="outline"
                    size="sm"
                    style={{
                      padding: "4px 12px",
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      color: getStatusColor(blog.status as BlogStatus),
                      borderColor: getStatusColor(blog.status as BlogStatus),
                    }}
                  >
                    {blog.status}
                  </Button>
                </td>
                <td style={{ textAlign: "center" }}>
                  <Button
                    onClick={() =>
                      toggleFeatured(blog._id, blog.featured || false)
                    }
                    variant="subtle"
                    size="sm"
                    title={
                      blog.featured
                        ? "Unfeature this blog"
                        : "Feature this blog"
                    }
                    style={{ padding: 0, minWidth: "auto", height: "auto" }}
                  >
                    {blog.featured ? (
                      <Icon
                        name="star-fill"
                        color="#ffc107"
                        size="1.2rem"
                      />
                    ) : (
                      <Icon
                        name="star"
                        color="#cbd5e0"
                        size="1.2rem"
                        className="text-muted"
                      />
                    )}
                  </Button>
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
                      passHref
                    >
                      <Button variant="outline" size="sm" title="Edit">
                        <Icon name="pencil" />
                      </Button>
                    </Link>
                    <Button
                      onClick={() => deleteBlog(blog._id)}
                      variant="outline"
                      color="error"
                      size="sm"
                      title="Delete"
                    >
                      <Icon name="trash" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {blogs.length === 0 && !loading && (
          <div
            className="no-data"
            style={{ textAlign: "center", padding: "3rem" }}
          >
            <Icon
              name="inbox"
              size={48}
              color="dimmed"
              style={{ marginBottom: "1rem" }}
            />
            <Text color="dimmed" weight={500} size="lg">
              No blogs found
            </Text>
            <Button
              onClick={handleCreateBlog}
              loading={createBlogMutation.isPending}
              className="mt-3"
            >
              <Icon name="plus-circle" /> Create Your First Blog
            </Button>
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

        {/* Deletion Confirmation Modals */}
        <ConfirmModal
          opened={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          title="Delete Blog"
          confirmLabel="Delete"
          color="error"
          loading={deleteBlogMutation.isPending}
        >
          Are you sure you want to delete this blog? This action cannot be
          undone.
        </ConfirmModal>
      </Stack>
    </Page>
  );
};

export default BlogsList;
