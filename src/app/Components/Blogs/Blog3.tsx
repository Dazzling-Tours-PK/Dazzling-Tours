"use client";
import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import Image from "next/image";
import Link from "next/link";
import { useGetBlogs } from "@/lib/hooks";
import { Section, Container, Grid } from "@/app/Components/Common";
import { ArrowRight, Tag, User } from "lucide-react";

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    return { day, month };
  };

  const renderHeader = () => (
    <div className="flex flex-col items-center justify-center text-center mb-12">
      <span className="inline-block text-[#EF7C00] font-bold tracking-widest uppercase mb-3 text-sm md:text-base animate-in fade-in slide-in-from-bottom-4 duration-500">
        News &amp; Updates
      </span>
      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 fill-mode-both">
        Recent Blog Posts
      </h2>
    </div>
  );

  if (loading || error || blogs.length === 0) {
    return null;
  }

  return (
    <Section padding="lg" className="news-section-3 pb-0 fix bg-gray-50">
      <Container>
        {renderHeader()}
        <Grid cols={1} className="md:grid-cols-2 lg:grid-cols-3" gap="md">
          {blogs.map((blog, index) => {
            const { day, month } = formatDate(
              blog.publishedAt || blog.createdAt,
            );
            const blogSlug = blog.seo?.slug || blog._id;
            const blogUrl = `/blogs/${blogSlug}`;

            return (
              <div
                key={blog._id}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 group">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={blog.featuredImage || `${IMAGEKIT_URL_ENDPOINT}/assets/img/blogs/BlogsPage.webp`}
                      alt={blog.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <ul className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                      <li className="flex flex-col items-center justify-center bg-[var(--theme)]/10 text-[var(--theme)] font-bold rounded-lg w-12 h-12">
                        <span className="text-lg leading-none">{day}</span>
                        <span className="text-xs uppercase">{month}</span>
                      </li>
                      <li className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-amber-500" />
                        By {typeof blog.author === 'string' ? blog.author : (blog.author?.name || "Admin")}
                      </li>
                      <li className="flex items-center gap-1">
                        <Tag className="h-3.5 w-3.5 text-amber-500" />
                        {typeof blog.category === 'string' ? blog.category : (blog.category?.name || "Travel")}
                      </li>
                    </ul>

                    <h4 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 flex-1">
                      <Link href={blogUrl} className="hover:text-[var(--theme)] transition-colors">
                        {blog.title}
                      </Link>
                    </h4>

                    <div className="pt-3 border-t border-gray-100 mt-auto">
                      <Link
                        href={blogUrl}
                        className="text-sm font-bold text-[var(--header)] hover:text-[var(--theme)] transition-colors inline-flex items-center gap-2"
                      >
                        Read More <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Grid>
      </Container>
    </Section>
  );
};

export default Blog3;
