"use client";
import React, { useEffect, useState } from "react";
import loadBackgroundImages from "../Common/loadBackgroundImages";
import Link from "next/link";
import Image from "next/image";
import {
  useGetCommentsByBlog,
  useCreateComment,
  useGetBlogBySlug,
  useGetBlogs,
  useNotification,
} from "@/lib/hooks";
import { Loading, Icon } from "@/app/Components/Common";
import { BlogStatus } from "@/lib/enums/blog";

const BlogDetails = ({ slug }: { slug: string }) => {
  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    content: "",
    parentId: undefined as string | undefined,
  });
  const [replyToName, setReplyToName] = useState("");

  // Fetch the blog data
  const { data: blogData, isLoading, error } = useGetBlogBySlug(slug);
  const blog = blogData?.data;

  // Fetch comments for this specific blog
  const { data: commentsData } = useGetCommentsByBlog(blog?._id || "", {
    status: "Approved",
    includeReplies: true,
  });
  const comments = commentsData?.data || [];

  const { data: recentBlogsData } = useGetBlogs({
    status: BlogStatus.PUBLISHED,
    limit: 3,
    page: 1,
  });
  const recentBlogs = recentBlogsData?.data || [];

  const createCommentMutation = useCreateComment();
  const { showSuccess, showError } = useNotification();

  const [shareUrl, setShareUrl] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href);
    }
  }, []);

  const encodedTitle = encodeURIComponent(blog?.title || "Dazzling Tours");

  useEffect(() => {
    loadBackgroundImages();
  }, [blog]); // Reload background when blog changes

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog?._id) return;

    createCommentMutation.mutate(
      {
        ...commentForm,
        blogId: blog._id,
      },
      {
        onSuccess: () => {
          showSuccess(
            "Thank you! Your comment has been submitted and is awaiting approval.",
          );
          setCommentForm({
            name: "",
            email: "",
            content: "",
            parentId: undefined,
          });
          setReplyToName("");
        },
        onError: (error) => {
          showError(error.message || "Failed to submit comment");
        },
      },
    );
  };

  const handleReply = (commentId: string, name: string) => {
    setCommentForm((prev) => ({
      ...prev,
      parentId: commentId,
    }));
    setReplyToName(name);
    // Scroll to form
    const formElement = document.getElementById("comment-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const cancelReply = () => {
    setCommentForm((prev) => ({
      ...prev,
      parentId: undefined,
    }));
    setReplyToName("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCommentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
      full: date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "800px" }}
      >
        <Loading
          variant="spinner"
          size="lg"
          color="primary"
          text="Loading article details..."
        />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <section className="news-details fix section-padding">
        <div className="container">
          <div className="text-center" style={{ padding: "5rem 2rem" }}>
            <i
              className="bi bi-exclamation-octagon"
              style={{ fontSize: "4rem", color: "#ccc" }}
            ></i>
            <h2 className="mt-3">Article Not Found</h2>
            <p className="text-muted">
              The article you are looking for might have been moved or
              doesn&apos;t exist.
            </p>
            <Link href="/blogs" className="theme-btn mt-4">
              Browse All Articles
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const { day, month } = formatDate(blog.publishedAt || blog.createdAt);

  return (
    <section className="news-details fix section-padding">
      <div className="container">
        <div className="news-details-area">
          <div className="row g-5">
            <div className="col-12 col-lg-8">
              <div className="blog-post-details">
                <div className="single-blog-post">
                  <div
                    className="post-featured-thumb bg-cover"
                    style={{
                      backgroundImage: `url(${blog.featuredImage || "/assets/img/news/post-4.jpg"})`,
                    }}
                  >
                    <div className="post">
                      <h3>
                        {day}
                        <span>{month}</span>
                      </h3>
                    </div>
                  </div>

                  <div className="post-content">
                    <h3>{blog.title}</h3>

                    <div
                      className="blog-main-content"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                  </div>
                </div>

                <hr className="my-5 text-muted opacity-25" />

                <div className="comments-area">
                  <div className="comments-heading">
                    <h3>
                      {commentsData?.total && commentsData.total > 0
                        ? `${commentsData.total.toString().padStart(2, "0")} Comments`
                        : "No Comments Yet"}
                    </h3>
                  </div>
                  <div className="comments-list">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {comments.map((comment: any) => (
                      <div key={comment._id} className="comment-thread mb-4">
                        <div className="blog-single-comment d-flex gap-4 pt-4 pb-4">
                          <div className="image flex-shrink-0">
                            <Image
                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.name || "U")}&background=fd7e14&color=fff&size=80&rounded=true`}
                              alt={comment.name}
                              width={80}
                              height={80}
                              className="rounded-circle shadow-sm border border-light"
                            />
                          </div>
                          <div className="content flex-grow-1">
                            <div className="head d-flex flex-wrap gap-2 align-items-center justify-content-between mb-2">
                              <div className="con">
                                <h5 className="mb-1">{comment.name}</h5>
                                <span
                                  className="text-muted"
                                  style={{ fontSize: "0.85rem" }}
                                >
                                  {new Date(
                                    comment.createdAt,
                                  ).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <button
                                onClick={() =>
                                  handleReply(comment._id, comment.name)
                                }
                                className="reply-btn border-0 bg-transparent fw-bold"
                                style={{ color: "#fd7e14", fontSize: "0.9rem" }}
                              >
                                <i className="bi bi-reply-fill"></i> Reply
                              </button>
                            </div>
                            <p
                              className="mt-2 mb-0"
                              style={{ lineHeight: "1.6" }}
                            >
                              {comment.content}
                            </p>
                          </div>
                        </div>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div
                            className="comment-replies-list"
                            style={{ marginLeft: "60px" }}
                          >
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {comment.replies.map((reply: any) => (
                              <div
                                className="blog-single-comment d-flex gap-4 pt-3 pb-3 border-top border-light"
                                key={reply._id}
                              >
                                <div className="image flex-shrink-0">
                                  <Image
                                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(reply.name || "U")}&background=fd7e14&color=fff&size=60&rounded=true`}
                                    alt={reply.name}
                                    width={60}
                                    height={60}
                                    className="rounded-circle shadow-sm border border-light"
                                  />
                                </div>
                                <div className="content flex-grow-1">
                                  <div className="head d-flex flex-wrap gap-2 align-items-center justify-content-between mb-1">
                                    <div className="con">
                                      <h6 className="mb-0">{reply.name}</h6>
                                      <span
                                        className="text-muted"
                                        style={{ fontSize: "0.75rem" }}
                                      >
                                        {new Date(
                                          reply.createdAt,
                                        ).toLocaleDateString("en-US", {
                                          day: "numeric",
                                          month: "short",
                                          year: "numeric",
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                  <p
                                    className="mt-1 mb-0"
                                    style={{
                                      fontSize: "0.9rem",
                                      lineHeight: "1.5",
                                    }}
                                  >
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="comment-form-wrap pt-5" id="comment-form">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3>
                      {commentForm.parentId
                        ? `Reply to ${replyToName}`
                        : "Leave a comments"}
                    </h3>
                    {commentForm.parentId && (
                      <button
                        onClick={cancelReply}
                        className="btn btn-sm btn-outline-secondary"
                        style={{ fontSize: "0.8rem" }}
                      >
                        Cancel Reply
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleCommentSubmit}>
                    <div className="row g-4">
                      <div className="col-lg-6">
                        <div className="form-clt">
                          <span>Your Name*</span>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Your Name"
                            value={commentForm.name}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-clt">
                          <span>Your Email*</span>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Your Email"
                            value={commentForm.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-lg-12">
                        <div className="form-clt">
                          <span>Message*</span>
                          <textarea
                            name="content"
                            id="message"
                            placeholder="Write Message"
                            value={commentForm.content}
                            onChange={handleInputChange}
                            required
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <button
                          type="submit"
                          className="theme-btn"
                          disabled={createCommentMutation.isPending}
                        >
                          {createCommentMutation.isPending
                            ? "Posting..."
                            : "Post Comment"}
                          <i className="bi bi-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <div className="tour-destination-wrapper">
                <div className="main-sidebar">
                  {/* Post Information Widget */}
                  {blog && (
                    <div className="single-sidebar-widget">
                      <div className="wid-title">
                        <h3>Post Details</h3>
                      </div>
                      <ul className="post-list list-unstyled mb-0 d-flex flex-column gap-3 px-1 mt-3">
                        <li className="d-flex justify-content-between align-items-center pb-2 border-bottom border-light">
                          <span className="text-secondary d-flex align-items-center gap-2 fw-medium">
                            <Icon name="folder2-open" color="#fd7e14" />{" "}
                            Category
                          </span>
                          <Link
                            href={`/blogs?category=${blog?.category}`}
                            className="text-dark fw-semibold text-decoration-none text-capitalize"
                          >
                            {blog?.category || "Uncategorized"}
                          </Link>
                        </li>
                        <li className="d-flex justify-content-between align-items-center pb-2 border-bottom border-light">
                          <span className="text-secondary d-flex align-items-center gap-2 fw-medium">
                            <Icon name="person" color="#fd7e14" /> Author
                          </span>
                          <span className="fw-semibold text-dark text-capitalize">
                            {blog?.author?.trim() ? blog.author : "Admin"}
                          </span>
                        </li>
                        <li className="d-flex justify-content-between align-items-center">
                          <span className="text-secondary d-flex align-items-center gap-2 fw-medium">
                            <Icon name="chat" color="#fd7e14" /> Comments
                          </span>
                          <span className="fw-semibold text-dark">
                            {commentsData?.total || 0}
                          </span>
                        </li>
                      </ul>
                    </div>
                  )}

                  {/* Share Article Widget */}
                  <div className="single-sidebar-widget">
                    <div className="wid-title">
                      <h3>Share This Article</h3>
                    </div>
                    <div className="social-share d-flex gap-4 mt-3">
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodedTitle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fs-5 d-flex align-items-center text-decoration-none"
                        style={{ transition: "0.3s" }}
                      >
                        <Icon name="facebook" color="#1877F2" />
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodedTitle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fs-5 d-flex align-items-center text-decoration-none"
                        style={{ transition: "0.3s" }}
                      >
                        <Icon name="twitter-x" color="#000000" />
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fs-5 d-flex align-items-center text-decoration-none"
                        style={{ transition: "0.3s" }}
                      >
                        <Icon name="linkedin" color="#0A66C2" />
                      </a>
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="fs-5 d-flex align-items-center text-decoration-none"
                        style={{ transition: "0.3s" }}
                      >
                        <Icon name="whatsapp" color="#25D366" />
                      </a>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(shareUrl);
                          showSuccess("Link copied to clipboard!");
                        }}
                        className="fs-5 border-0 bg-transparent p-0 d-flex align-items-center text-decoration-none"
                        style={{ transition: "0.3s" }}
                        title="Copy link"
                      >
                        <Icon name="link-45deg" color="#fd7e14" />
                      </button>
                    </div>
                  </div>

                  {/* Post Tags Widget */}
                  {blog?.tags && blog.tags.length > 0 && (
                    <div className="single-sidebar-widget">
                      <div className="wid-title">
                        <h3>Tags</h3>
                      </div>
                      <div className="tagcloud">
                        {blog.tags.map((tag, idx) => (
                          <Link key={idx} href={`/blogs?tags=${tag.trim()}`}>
                            {tag.trim()}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;
