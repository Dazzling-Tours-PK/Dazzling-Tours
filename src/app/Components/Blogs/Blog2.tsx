"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useGetBlogs } from "@/lib/hooks";

const Blog2 = () => {
  const {
    data: blogsData,
    isLoading: loading,
    error,
  } = useGetBlogs({
    status: "Published",
    limit: 6,
  });

  const blogs = blogsData?.data || [];

  // Format date to "26Nov" format (matching Blog3)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    return { day, month };
  };

  if (loading) {
    return (
      <section className="news-section-2 section-padding fix">
        <div className="container">
          <div className="text-center">
            <p>Loading blogs...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="news-section-2 section-padding fix">
        <div className="container">
          <div className="text-center">
            <p>Error: {error.message}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="news-section-2 section-padding fix">
      <div className="container">
        <div className="row g-5">
          <div className="col-12 col-lg-8">
            <div className="section-title text-center">
              <span className="sub-title wow fadeInUp">News & Updates</span>
              <h2 className="wow fadeInUp wow" data-wow-delay=".2s">
                Our Latest News & Articles
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
                    className="col-xxl-6 col-xl-4 col-md-6 col-lg-6 wow fadeInUp wow"
                    data-wow-delay=".2s"
                  >
                    <div className="news-card-items-2">
                      <div className="news-image">
                        <Image
                          src={blog.featuredImage || "/assets/img/news/04.jpg"}
                          alt={blog.title}
                          width={376}
                          height={268}
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
                        {blog.excerpt && (
                          <p className="excerpt">{blog.excerpt}</p>
                        )}
                        <div className="news-info">
                          <Link href={blogUrl} className="link-btn style-2">
                            Read More <i className="bi bi-arrow-right"></i>
                          </Link>
                          <div className="group-image">
                            <Image
                              src="/assets/img/news/Group.png"
                              alt="img"
                              width={103}
                              height={30}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="page-nav-wrap text-center">
              <ul>
                <li>
                  <a className="page-numbers" href="#">
                    <i className="bi bi-arrow-left"></i>
                  </a>
                </li>
                <li>
                  <a className="page-numbers" href="#">
                    01
                  </a>
                </li>
                <li>
                  <a className="page-numbers" href="#">
                    02
                  </a>
                </li>
                <li>
                  <a className="page-numbers" href="#">
                    03
                  </a>
                </li>
                <li>
                  <a className="page-numbers" href="#">
                    <i className="bi bi-arrow-right"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <div className="main-sideber">
              <div className="single-sidebar-widget">
                <div className="wid-title">
                  <h4>Search</h4>
                </div>
                <div className="search-widget">
                  <form action="#">
                    <input type="text" placeholder="Search here" />
                    <button type="submit">
                      <i className="bi bi-search"></i>
                    </button>
                  </form>
                </div>
              </div>
              <div className="single-sidebar-widget">
                <div className="wid-title">
                  <h4>Services</h4>
                </div>
                <div className="news-widget-categories">
                  <ul>
                    <li>
                      <a href="#">Travel</a>
                      <span>04</span>
                    </li>
                    <li>
                      <a href="#">System</a>
                      <span>03</span>
                    </li>
                    <li>
                      <a href="#">Agency</a>
                      <span>02</span>
                    </li>
                    <li>
                      <a href="#">Restaurant</a>
                      <span>05</span>
                    </li>
                    <li>
                      <a href="#">Rant A Car</a>
                      <span>06</span>
                    </li>
                    <li>
                      <a href="#">Blueprint Builders</a>
                      <span>(03)</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="single-sidebar-widget">
                <div className="wid-title">
                  <h4>Recent Post</h4>
                </div>
                <div className="recent-post-area">
                  <div className="recent-items">
                    <div className="recent-thumb">
                      <Image
                        src="/assets/img/news/pp1.jpg"
                        alt="img"
                        width={78}
                        height={79}
                      />
                    </div>
                    <div className="recent-content">
                      <ul>
                        <li>
                          <i className="bi bi-calendar-check"></i>
                          14 Feb, 2024
                        </li>
                      </ul>
                      <h6>
                        <Link href={`/blog/${1}`}>
                          Get Best Advertised Your Side Pocket.
                        </Link>
                      </h6>
                    </div>
                  </div>
                  <div className="recent-items">
                    <div className="recent-thumb">
                      <Image
                        src="/assets/img/news/pp2.jpg"
                        alt="img"
                        width={78}
                        height={79}
                      />
                    </div>
                    <div className="recent-content">
                      <ul>
                        <li>
                          <i className="bi bi-calendar-check"></i>
                          12 Mar, 2024
                        </li>
                      </ul>
                      <h6>
                        <Link href={`/blog/${2}`}>
                          Supervisor Disapproved of Latest Work.
                        </Link>
                      </h6>
                    </div>
                  </div>
                  <div className="recent-items">
                    <div className="recent-thumb">
                      <Image
                        src="/assets/img/news/pp3.jpg"
                        alt="img"
                        width={78}
                        height={79}
                      />
                    </div>
                    <div className="recent-content">
                      <ul>
                        <li>
                          <i className="bi bi-calendar-check"></i>
                          23 Feb, 2024
                        </li>
                      </ul>
                      <h6>
                        <Link href={`/blog/${3}`}>
                          Sakura dreams and samurai tales.
                        </Link>
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="single-sidebar-widget">
                <div className="wid-title">
                  <h4>Tags</h4>
                </div>
                <div className="news-widget-categories">
                  <div className="tagcloud">
                    <a href="#">Agency</a>
                    <a href="#">Traveling</a>
                    <a href="#">Design</a>
                    <a href="#">Travel</a>
                    <a href="#">Change</a>
                    <a href="#">Video</a>
                    <a href="#">World</a>
                    <a href="#">Startup</a>
                    <a href="#">Services</a>
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

export default Blog2;
