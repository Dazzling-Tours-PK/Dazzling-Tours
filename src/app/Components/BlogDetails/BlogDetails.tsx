"use client";
import { getOptimizedImage, IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import { AppImage } from "@/app/Components/Common";
import { ImageVariant } from "@/lib/constants/imageDimensions";
import React, { useState } from "react";
import Link from "next/link";
import {
  useGetCommentsByBlog,
  useCreateComment,
  useGetBlogBySlug,
  useGetBlogs,
  useNotification,
} from "@/lib/hooks";
import { Icon, ShareButtons } from "@/app/Components/Common";
import { TextInput, Textarea } from "@/app/Components/Form";
import { BlogStatus } from "@/lib/enums/blog";
import { Comment } from "@/lib/types/comment";


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
      <div className="flex justify-center items-center min-h-[800px] bg-gray-50">
        <div className="text-center animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#EF7C00]/20 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-[#EF7C00] animate-ping"></div>
          </div>
          <p className="text-gray-500 font-medium">Loading article details...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto py-16 px-4 bg-white rounded-3xl shadow-sm border border-gray-100">
            <Icon
              name="exclamation-octagon"
              className="mx-auto text-gray-300 mb-6"
              size={64}
            />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h2>
            <p className="text-gray-500 mb-8 text-lg">
              The article you are looking for might have been moved or doesn&apos;t exist.
            </p>
            <Link href="/blogs" className="inline-flex items-center gap-2 bg-[#EF7C00] hover:bg-[#D96E00] text-white font-bold py-4 px-8 rounded-xl transition-all">
              Browse All Articles <Icon name="arrow-right" size={20} />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const { day, month } = formatDate(blog.publishedAt || blog.createdAt);

  return (
    <section className="py-16 lg:py-24 bg-gray-50 min-h-screen">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-8 flex flex-col gap-10">

            {/* Main Article */}
            <article className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative w-full">
                <AppImage
                  variant={ImageVariant.HERO}
                  src={getOptimizedImage(blog.featuredImage || `${IMAGEKIT_URL_ENDPOINT}/assets/img/blogs/BlogsPage.webp`, 1200)}
                  alt={blog.title}
                  priority
                />
                <div className="absolute top-6 left-6 bg-[#EF7C00] text-white flex flex-col items-center justify-center w-20 h-20 rounded-2xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform">
                  <span className="text-3xl font-black leading-none">{day}</span>
                  <span className="text-sm font-bold uppercase tracking-wider">{month}</span>
                </div>
              </div>

              <div className="p-6 md:p-10 lg:p-12">
                <div className="flex items-center gap-4 text-sm font-semibold text-[#EF7C00] uppercase tracking-wider mb-6">
                  {blog.category && (
                    <span className="flex items-center gap-1.5 bg-[#EF7C00]/10 px-3 py-1 rounded-full">
                      <Icon name="tag" size={14} />
                      {typeof blog.category === 'string' ? blog.category : blog.category.name}
                    </span>
                  )}
                  {blog.author && (
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <Icon name="user" size={16} />
                      {typeof blog.author === 'string' ? blog.author : blog.author.name}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
                  {blog.title}
                </h1>

                <div
                  className="prose prose-lg md:prose-xl max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-a:text-[#EF7C00] prose-img:rounded-2xl"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                  suppressHydrationWarning
                />
              </div>
            </article>

            {/* Comments Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 lg:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-10 pb-4 border-b border-gray-100 flex items-center gap-3">
                <Icon name="message-square" className="text-[#EF7C00]" size={28} />
                {commentsData?.total && commentsData.total > 0
                  ? `${commentsData.total} ${commentsData.total === 1 ? 'Comment' : 'Comments'}`
                  : "No Comments Yet"}
              </h3>

              <div className="flex flex-col gap-8 mb-12">
                {comments.map((comment: Comment) => (
                  <div key={comment._id} className="group">
                    <div className="flex items-start relative">
                      <div className="flex-shrink-0 w-14 md:w-16 z-10 relative">
                        <AppImage
                          variant={ImageVariant.AVATAR}
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(comment.name || "U")}&background=EF7C00&color=fff&size=80&rounded=true`}
                          alt={comment.name}
                          imageClassName="ring-4 ring-white shadow-sm"
                        />
                      </div>
                      <div className="flex-grow bg-gray-50 p-6 rounded-2xl border border-gray-100 -ml-4 md:-ml-6 pl-8 md:pl-10">
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                          <div>
                            <h5 className="font-bold text-lg text-gray-900 m-0">{comment.name}</h5>
                            <span className="text-gray-500 text-sm font-medium flex items-center gap-1.5 mt-1">
                              <Icon name="clock" size={14} />
                              {new Date(comment.createdAt).toLocaleDateString("en-US", {
                                day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                              })}
                            </span>
                          </div>
                          <button
                            onClick={() => handleReply(comment._id, comment.name)}
                            className="text-[#EF7C00] font-semibold text-sm hover:underline flex items-center gap-1 bg-[#EF7C00]/10 px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Icon name="corner-up-left" size={14} /> Reply
                          </button>
                        </div>
                        <p className="text-gray-700 leading-relaxed m-0">{comment.content}</p>
                      </div>
                    </div>

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="flex flex-col gap-6 mt-6 ml-12 md:ml-20">
                        {comment.replies.map((reply: Comment) => (
                          <div key={reply._id} className="flex items-start relative">
                            <div className="flex-shrink-0 w-10 md:w-12 z-10 relative">
                              <AppImage
                                variant={ImageVariant.AVATAR}
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(reply.name || "U")}&background=e2e8f0&color=475569&size=60&rounded=true`}
                                alt={reply.name}
                                imageClassName="ring-4 ring-white shadow-sm"
                              />
                            </div>
                            <div className="flex-grow bg-white p-5 rounded-2xl border border-gray-100 shadow-sm -ml-4 md:-ml-5 pl-7 md:pl-8">
                              <div className="mb-2">
                                <h5 className="font-bold text-base text-gray-900 m-0">{reply.name}</h5>
                                <span className="text-gray-400 text-xs font-medium mt-1 block">
                                  {new Date(reply.createdAt).toLocaleDateString("en-US", {
                                    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit"
                                  })}
                                </span>
                              </div>
                              <p className="text-gray-600 leading-relaxed text-sm m-0">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Comment Form */}
              <div id="comment-form" className="bg-gray-50 p-6 md:p-10 rounded-3xl border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Leave a Comment</h3>
                <p className="text-gray-500 mb-8">Your email address will not be published. Required fields are marked *</p>

                {commentForm.parentId && (
                  <div className="flex justify-between items-center bg-[#EF7C00]/10 border border-[#EF7C00]/20 text-[#EF7C00] px-4 py-3 rounded-xl mb-6 font-medium">
                    <span className="flex items-center gap-2"><Icon name="corner-down-right" size={16} /> Replying to {replyToName}</span>
                    <button type="button" onClick={cancelReply} className="hover:text-red-500 transition-colors">
                      <Icon name="x" size={20} />
                    </button>
                  </div>
                )}

                <form onSubmit={handleCommentSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextInput
                      name="name"
                      label="Full Name"
                      placeholder="John Doe"
                      value={commentForm.name}
                      onChange={(v) => setCommentForm({ ...commentForm, name: v })}
                      required
                    />
                    <TextInput
                      name="email"
                      type="email"
                      label="Email Address"
                      placeholder="john@example.com"
                      value={commentForm.email}
                      onChange={(v) => setCommentForm({ ...commentForm, email: v })}
                      required
                    />
                  </div>
                  <Textarea
                    name="content"
                    label="Your Comment"
                    placeholder="Write your thoughts here..."
                    rows={5}
                    value={commentForm.content}
                    onChange={(v) => setCommentForm({ ...commentForm, content: v })}
                    required
                  />
                  <button
                    type="submit"
                    className="w-full md:w-auto bg-[#EF7C00] hover:bg-[#D96E00] text-white font-bold py-4 px-10 rounded-xl mt-2 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                    disabled={createCommentMutation.isPending}
                  >
                    {createCommentMutation.isPending ? "Submitting..." : "Post Comment"} <Icon name="send" size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 sticky top-24 flex flex-col gap-8">

            {/* Search Widget */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="mb-5 pb-4 border-b border-gray-100">
                <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2.5">
                  <span className="w-1.5 h-6 bg-[#EF7C00] rounded-full inline-block"></span> Search
                </h4>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full pl-5 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#EF7C00] focus:border-transparent outline-none transition-all"
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#EF7C00] p-2 bg-white rounded-lg shadow-sm">
                  <Icon name="search" size={18} />
                </button>
              </div>
            </div>

            {/* Recent Posts Widget */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
              <div className="mb-5 pb-4 border-b border-gray-100">
                <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2.5">
                  <span className="w-1.5 h-6 bg-[#EF7C00] rounded-full inline-block"></span> Recent Posts
                </h4>
              </div>
              <div className="flex flex-col gap-6">
                {recentBlogs.map((recentPost) => (
                  <div key={recentPost._id} className="flex items-center gap-4 group">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <AppImage
                        variant={ImageVariant.THUMBNAIL}
                        src={getOptimizedImage(recentPost.featuredImage || `${IMAGEKIT_URL_ENDPOINT}/assets/img/blogs/BlogsPage.webp`, 150)}
                        alt={recentPost.title}
                        imageClassName="group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-xs font-bold text-[#EF7C00] uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Icon name="calendar" size={12} />
                        {new Date(recentPost.publishedAt || recentPost.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <Link href={`/blogs/${recentPost.slug}`} className="text-gray-900 font-bold leading-snug hover:text-[#EF7C00] transition-colors line-clamp-2">
                        {recentPost.title}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Share Widget */}
            <ShareButtons
              title={blog?.title || "Dazzling Tours"}
              heading="Share This Post"
            />


          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetails;
