"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useGetBlogs } from "@/lib/hooks";

const Blog3 = () => {
  const {
    data: blogsData,
    isLoading: loading,
    error,
  } = useGetBlogs({
    featured: true,
    status: "Published",
    limit: 3,
  });

  const blogs = blogsData?.data || [];

  // Format date to "26Nov" format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    return { day, month };
  };

  if (loading) {
    return (
      <section className="news-section-3 section-padding fix">
        <div className="container">
          <div className="section-title text-center">
            <span className="sub-title wow fadeInUp">News & Updates</span>
            <h2 className="wow fadeInUp" data-wow-delay=".2s">
              Recent Blog Posts
            </h2>
          </div>
          <div className="text-center" style={{ padding: "3rem" }}>
            <p>Loading featured blogs...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="news-section-3 section-padding fix">
        <div className="container">
          <div className="section-title text-center">
            <span className="sub-title wow fadeInUp">News & Updates</span>
            <h2 className="wow fadeInUp" data-wow-delay=".2s">
              Recent Blog Posts
            </h2>
          </div>
          <div className="text-center" style={{ padding: "3rem" }}>
            <p>Unable to load featured blogs. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  if (blogs.length === 0) {
    return (
      <section className="news-section-3 section-padding fix">
        <div className="container">
          <div className="section-title text-center">
            <span className="sub-title wow fadeInUp">News & Updates</span>
            <h2 className="wow fadeInUp" data-wow-delay=".2s">
              Recent Blog Posts
            </h2>
          </div>
          <div className="text-center" style={{ padding: "3rem" }}>
            <p>No featured blogs available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="news-section-3 section-padding pb-0 fix">
      <div className="container">
        <div className="section-title text-center">
          <span className="sub-title wow fadeInUp">News & Updates</span>
          <h2 className="wow fadeInUp" data-wow-delay=".2s">
            Recent Blog Posts
          </h2>
        </div>
        <div className="row">
          {blogs.map((blog) => {
            const { day, month } = formatDate(
              blog.publishedAt || blog.createdAt,
            );
            const blogSlug = blog.seo?.slug || blog._id;
            const blogUrl = `/blogs/${blogSlug}`;

            return (
              <div
                key={blog._id}
                className="col-xl-4 col-md-6 col-lg-6 wow fadeInUp"
                data-wow-delay=".3s"
              >
                <div className="news-card-items-3 style-4">
                  <div className="news-image">
                    <Image
                      src={blog.featuredImage || "/assets/img/news/08.jpg"}
                      alt={blog.title}
                      width={416}
                      height={347}
                    />
                  </div>
                  <div className="news-content">
                    <ul className="post-meta">
                      <li className="post">
                        {day}
                        <span>{month}</span>
                      </li>
                      <li>
                        <i className="bi bi-person"></i>
                        By {blog.author || "Admin"}
                      </li>
                      <li>
                        <i className="bi bi-tag-fill"></i>
                        {blog.category || "Travel"}
                      </li>
                    </ul>
                    <h4>
                      <Link href={blogUrl}>{blog.title}</Link>
                    </h4>
                    <Link href={blogUrl} className="link-btn">
                      Read More <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Blog3;
