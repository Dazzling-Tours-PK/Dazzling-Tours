"use client";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useGetBlogs, useGetBlogCategories, useGetBlogTags } from "@/lib/hooks";
import { BlogStatus } from "@/lib/enums/blog";
import PaginationComponent from "@/app/Components/Common/PaginationComponent";
import { Loading } from "@/app/Components/Common";

const Blog2Content = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlCategory = searchParams.get("category");
  const urlSearch = searchParams.get("search");
  const urlTags = searchParams.get("tags");
  const urlPage = searchParams.get("page");

  const pageLimit = 6;
  const [searchQuery, setSearchQuery] = useState(urlSearch || "");
  const [searchTerm, setSearchTerm] = useState(urlSearch || "");
  const [currentPage, setCurrentPage] = useState(
    urlPage ? parseInt(urlPage) : 1,
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    urlCategory ? urlCategory.split(",") : [],
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    urlTags ? urlTags.split(",") : [],
  );

  // Function to update URL with new filters
  const updateUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      // Always reset page to 1 when filters change, unless page itself is being updated
      if (!updates.hasOwnProperty("page")) {
        params.delete("page");
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, pathname, router],
  );

  // Sync state with URL params if they change (from external source or back button)
  useEffect(() => {
    setSearchTerm(urlSearch || "");
    setSearchQuery(urlSearch || "");
    setSelectedCategories(urlCategory ? urlCategory.split(",") : []);
    setSelectedTags(urlTags ? urlTags.split(",") : []);
    setCurrentPage(urlPage ? parseInt(urlPage) : 1);
  }, [urlCategory, urlSearch, urlTags, urlPage]);

  // Fetch blog categories with counts
  const { data: categoriesData } = useGetBlogCategories(BlogStatus.PUBLISHED);
  const categories = categoriesData?.data || [];

  // Fetch unique tags
  const { data: tagsData } = useGetBlogTags(BlogStatus.PUBLISHED);
  const tags = tagsData?.data || [];

  // Fetch blogs based on filters
  const {
    data: blogsData,
    isLoading: loading,
    error,
  } = useGetBlogs({
    status: BlogStatus.PUBLISHED,
    search: searchTerm || undefined,
    category:
      selectedCategories.length > 0 ? selectedCategories.join(",") : undefined,
    tags: selectedTags.length > 0 ? selectedTags.join(",") : undefined,
    page: currentPage,
    limit: pageLimit,
  });

  // Fetch recent posts (latest 3)
  const { data: recentBlogsData } = useGetBlogs({
    status: BlogStatus.PUBLISHED,
    limit: 3,
    page: 1,
  });
  const recentBlogs = recentBlogsData?.data || [];

  const blogs = blogsData?.data || [];
  const pagination = blogsData?.pagination;

  // Reset to first page when search, category or tag changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategories, selectedTags]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = searchQuery.trim();
    setSearchTerm(query);
    updateUrl({ search: query });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchTerm("");
    updateUrl({ search: null });
  };

  const handleClearAll = () => {
    setSearchQuery("");
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedTags([]);
    router.push(pathname, { scroll: false });
  };

  const handleCategoryChange = (categoryName: string, checked: boolean) => {
    setSelectedCategories((prev) => {
      const newCategories = checked
        ? [...prev, categoryName]
        : prev.filter((cat) => cat !== categoryName);

      updateUrl({
        category: newCategories.length > 0 ? newCategories.join(",") : null,
      });
      return newCategories;
    });
  };

  const handleTagChange = (tagName: string, checked: boolean) => {
    setSelectedTags((prev) => {
      const newTags = checked
        ? [...prev, tagName]
        : prev.filter((tag) => tag !== tagName);

      updateUrl({ tags: newTags.length > 0 ? newTags.join(",") : null });
      return newTags;
    });
  };

  const handlePageChange = (page: number) => {
    updateUrl({ page: page.toString() });
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    return {
      day,
      month,
      full: date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
  };

  if (error) {
    return (
      <section className="news-section-2 section-padding fix">
        <div className="container">
          <div className="text-center" style={{ padding: "3rem" }}>
            <p>Unable to load blogs. Please try again later.</p>
            <p className="text-muted">{error.message}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="news-section-2 section-padding fix">
      <div className="container">
        <div className="tour-destination-wrapper">
          <div className="row g-5">
            <div className="col-12 col-lg-8">
              <div className="section-title text-center">
                <span className="sub-title wow fadeInUp">News & Updates</span>
                <h2 className="wow fadeInUp wow" data-wow-delay=".2s">
                  Our Latest News & Articles
                </h2>
              </div>

              {loading ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "600px" }}
                >
                  <Loading
                    variant="spinner"
                    size="lg"
                    color="primary"
                    text="Loading blogs..."
                  />
                </div>
              ) : blogs.length === 0 ? (
                <div className="text-center" style={{ padding: "4rem 2rem" }}>
                  <i
                    className="bi bi-journal-x"
                    style={{ fontSize: "4rem", color: "#ccc" }}
                  ></i>
                  <h4 className="mt-3">No Blogs Found</h4>
                  <p className="text-muted">
                    {searchTerm ||
                    selectedCategories.length > 0 ||
                    selectedTags.length > 0
                      ? "Try adjusting your search or category filters."
                      : "We haven't published any blogs yet. Stay tuned!"}
                  </p>
                  {(searchTerm ||
                    selectedCategories.length > 0 ||
                    selectedTags.length > 0) && (
                    <button
                      onClick={handleClearAll}
                      className="theme-btn style-2 mt-3"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="row">
                    {blogs.map((blog) => {
                      const blogSlug = blog.seo?.slug || blog._id;
                      const blogUrl = `/blogs/${blogSlug}`;

                      return (
                        <div
                          key={blog._id}
                          className="col-xxl-6 col-md-6 col-lg-6 wow fadeInUp wow"
                          data-wow-delay=".2s"
                        >
                          <div className="news-card-items-2 shadow-sm rounded-4 overflow-hidden border-0 bg-white">
                            <div
                              className="news-image"
                              style={{ height: "200px", overflow: "hidden" }}
                            >
                              <Image
                                src={
                                  blog.featuredImage ||
                                  "/assets/img/news/04.jpg"
                                }
                                alt={blog.title}
                                width={376}
                                height={200}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  transition: "transform 0.3s ease",
                                }}
                                className="blog-img"
                              />
                            </div>
                            <div
                              className="news-content"
                              style={{ padding: "1.5rem" }}
                            >
                              <div className="d-flex flex-wrap align-items-center gap-3 mb-2">
                                <span
                                  className="d-flex align-items-center gap-1 text-muted"
                                  style={{ fontSize: "0.85rem" }}
                                >
                                  <i
                                    className="bi bi-calendar3"
                                    style={{ color: "#fd7e14" }}
                                  ></i>
                                  {
                                    formatDate(
                                      blog.publishedAt || blog.createdAt,
                                    ).full
                                  }
                                </span>
                                <span
                                  className="d-flex align-items-center gap-1 text-muted"
                                  style={{ fontSize: "0.85rem" }}
                                >
                                  <i
                                    className="bi bi-person"
                                    style={{ color: "#fd7e14" }}
                                  ></i>
                                  {blog.author || "Admin"}
                                </span>
                                <span
                                  className="d-flex align-items-center gap-1 text-muted"
                                  style={{ fontSize: "0.85rem" }}
                                >
                                  <i
                                    className="bi bi-folder"
                                    style={{ color: "#fd7e14" }}
                                  ></i>
                                  {blog.category || "General"}
                                </span>
                              </div>

                              {blog.tags && blog.tags.length > 0 && (
                                <div
                                  className="d-flex align-items-center gap-2 mb-3 text-muted opacity-75"
                                  style={{ fontSize: "0.85rem" }}
                                >
                                  <i
                                    className="bi bi-tag"
                                    style={{ color: "#fd7e14" }}
                                  ></i>
                                  <span>{blog.tags.join(", ")}</span>
                                </div>
                              )}

                              <h4
                                className="mb-2"
                                style={{
                                  fontSize: "1.2rem",
                                  fontWeight: "700",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  minHeight: "2.8rem",
                                }}
                              >
                                <Link
                                  href={blogUrl}
                                  className="text-dark text-decoration-none"
                                >
                                  {blog.title}
                                </Link>
                              </h4>

                              {blog.excerpt && (
                                <p
                                  className="excerpt text-muted mb-4"
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    lineHeight: "1.6",
                                    fontSize: "0.95rem",
                                    minHeight: "4.5rem",
                                  }}
                                >
                                  {blog.excerpt}
                                </p>
                              )}

                              <div className="news-info border-top pt-3 mt-auto">
                                <Link
                                  href={blogUrl}
                                  className="link-btn text-decoration-none fw-bold d-flex align-items-center gap-2"
                                  style={{
                                    color: "var(--header)",
                                    fontSize: "0.95rem",
                                  }}
                                >
                                  Read More{" "}
                                  <i className="bi bi-arrow-right"></i>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {pagination && pagination.pages > 1 && (
                    <div className="mt-5">
                      <PaginationComponent
                        pagination={pagination}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        pageSize={pageLimit}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="col-12 col-lg-4">
              <div className="main-sidebar">
                <div className="single-sidebar-widget">
                  <div className="wid-title">
                    <h3>Search Blogs</h3>
                  </div>
                  <div className="search-widget enhanced-search">
                    <form
                      onSubmit={handleSearch}
                      className="search-form-enhanced"
                    >
                      <div
                        className="search-input-wrapper"
                        style={{ position: "relative" }}
                      >
                        <i
                          className="bi bi-search search-icon"
                          style={{
                            position: "absolute",
                            left: "20px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            pointerEvents: "none",
                            transition: "none",
                            zIndex: 2,
                          }}
                        ></i>
                        <input
                          type="text"
                          placeholder="Search news, tags..."
                          className="search-input-enhanced"
                          style={{ paddingLeft: "50px" }}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                          type={searchTerm ? "button" : "submit"}
                          className="search-btn-enhanced"
                          onClick={searchTerm ? handleClearSearch : undefined}
                          disabled={!searchQuery.trim() && !searchTerm}
                        >
                          <i
                            className={`bi ${
                              searchTerm ? "bi-x-lg" : "bi-arrow-right"
                            }`}
                          ></i>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="single-sidebar-widget">
                  <div className="wid-title">
                    <h3>Categories</h3>
                  </div>
                  <div className="categories-list">
                    {categories.length > 0 ? (
                      categories.map((cat, idx) => {
                        const isChecked = selectedCategories.some(
                          (c) =>
                            c.trim().toLowerCase() ===
                            cat.name.trim().toLowerCase(),
                        );
                        const categoryId = `cat-${idx}-${cat.name.replace(/\s+/g, "-")}`;
                        return (
                          <label
                            key={cat.name}
                            htmlFor={categoryId}
                            className="checkbox-single d-flex justify-content-between align-items-center"
                            style={{ cursor: "pointer" }}
                          >
                            <span className="d-flex gap-xl-3 gap-2 align-items-center">
                              <span className="checkbox-area d-center">
                                <input
                                  type="checkbox"
                                  id={categoryId}
                                  checked={isChecked}
                                  onChange={(e) =>
                                    handleCategoryChange(
                                      cat.name,
                                      e.target.checked,
                                    )
                                  }
                                />
                                <span className="checkmark d-center"></span>
                              </span>
                              <span className="text-color">{cat.name}</span>
                            </span>
                            <span className="text-color">{cat.count}</span>
                          </label>
                        );
                      })
                    ) : (
                      <p className="text-muted p-3">No categories available</p>
                    )}
                  </div>
                </div>

                <div className="single-sidebar-widget">
                  <div className="wid-title">
                    <h3>Recent Posts</h3>
                  </div>
                  <div className="recent-post-area">
                    {recentBlogs.length > 0 ? (
                      recentBlogs.map((recent) => (
                        <div
                          className="recent-items d-flex align-items-start gap-3 mb-4"
                          key={recent._id}
                        >
                          <div
                            className="recent-thumb rounded-3 overflow-hidden bg-light shadow-sm"
                            style={{
                              width: "75px",
                              minWidth: "75px",
                              height: "75px",
                            }}
                          >
                            <Image
                              src={recent.featuredImage || ""}
                              alt={recent.title}
                              width={75}
                              height={75}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </div>
                          <div className="recent-content pt-1">
                            <div
                              className="d-flex align-items-center gap-2 mb-1"
                              style={{
                                color: "#fd7e14",
                                fontSize: "0.8rem",
                                fontWeight: "600",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                              }}
                            >
                              <i className="bi bi-calendar3"></i>
                              <span>
                                {
                                  formatDate(
                                    recent.publishedAt || recent.createdAt,
                                  ).full
                                }
                              </span>
                            </div>
                            <h6
                              className="mb-0"
                              style={{
                                fontSize: "0.95rem",
                                fontWeight: "700",
                                lineHeight: "1.4",
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              <Link
                                href={`/blogs/${
                                  recent.seo?.slug || recent._id
                                }`}
                                className="text-dark text-decoration-none"
                              >
                                {recent.title}
                              </Link>
                            </h6>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted p-3">No recent posts</p>
                    )}
                  </div>
                </div>

                <div className="single-sidebar-widget">
                  <div className="wid-title">
                    <h3>Tags</h3>
                  </div>
                  <div className="categories-list">
                    {tags.length > 0 ? (
                      tags.map((tag, idx) => {
                        const isChecked = selectedTags.some(
                          (t) =>
                            t.trim().toLowerCase() === tag.trim().toLowerCase(),
                        );
                        const tagId = `tag-${idx}-${tag.replace(/\s+/g, "-")}`;
                        return (
                          <label
                            key={tag}
                            htmlFor={tagId}
                            className="checkbox-single d-flex justify-content-between align-items-center"
                            style={{ cursor: "pointer" }}
                          >
                            <span className="d-flex gap-xl-3 gap-2 align-items-center">
                              <span className="checkbox-area d-center">
                                <input
                                  type="checkbox"
                                  id={tagId}
                                  checked={isChecked}
                                  onChange={(e) =>
                                    handleTagChange(tag, e.target.checked)
                                  }
                                />
                                <span className="checkmark d-center"></span>
                              </span>
                              <span className="text-color">{tag}</span>
                            </span>
                          </label>
                        );
                      })
                    ) : (
                      <p className="text-muted p-3">No tags available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Blog2 = () => {
  return (
    <Suspense
      fallback={
        <div className="section-padding text-center">
          <Loading variant="spinner" text="Woking on it..." />
        </div>
      }
    >
      <Blog2Content />
    </Suspense>
  );
};

export default Blog2;
