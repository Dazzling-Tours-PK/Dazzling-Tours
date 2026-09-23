import { IMAGEKIT_URL_ENDPOINT } from "@/lib/utils/imageUtils";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import BlogDetails from "../../../Components/BlogDetails/BlogDetails";
import Cta from "../../../Components/Cta/Cta";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import { Blog } from "@/models";

type Props = {
  params: Promise<{ slug: string }>;
};

// Server-side helper to fetch blog
async function getBlogBySlug(slug: string) {
  try {
    await connectDB();
    const blog = await Blog.findOne({ "seo.slug": slug }).lean();
    if (!blog) {
      // Fallback search by ID
      const blogById = await Blog.findById(slug).lean();
      if (!blogById) return null;
      return JSON.parse(JSON.stringify(blogById));
    }
    return JSON.parse(JSON.stringify(blog));
  } catch (error) {
    console.error("❌ Error fetching blog by slug:", error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found | Dazzling Tours",
      description: "The blog post you're looking for doesn't exist.",
    };
  }

  const metaTitle = blog.seo?.metaTitle || blog.title;
  const metaDescription =
    blog.seo?.metaDescription ||
    blog.excerpt ||
    blog.content?.substring(0, 160) ||
    "";
  const ogImage =
    blog.seo?.ogImage ||
    blog.featuredImage ||
    `${IMAGEKIT_URL_ENDPOINT}/assets/img/blogs/BlogsPage.webp`;

  return {
    title: `${metaTitle} | Dazzling Tours`,
    description: metaDescription,
    keywords: blog.seo?.focusKeyword || blog.tags?.join(", ") || "",
    openGraph: {
      title: `${metaTitle} | Dazzling Tours`,
      description: metaDescription,
      images: ogImage ? [{ url: ogImage, alt: blog.title }] : [],
      type: "article",
      publishedTime: blog.publishedAt || blog.createdAt,
      authors: [blog.author || "Dazzling Tours"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${metaTitle} | Dazzling Tours`,
      description: metaDescription,
      images: ogImage ? [ogImage] : [],
    },
    alternates: {
      canonical: `/blogs/${blog.seo?.slug || blog._id}`,
    },
  };
}

const page = async ({ params }: Props) => {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://dazzlingtours.pk";

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${baseUrl}/blogs`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blog.title,
        item: `${baseUrl}/blogs/${blog.seo?.slug || blog._id}`,
      },
    ],
  };

  const blogPostSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt || blog.seo?.metaDescription || "",
    image: blog.featuredImage || blog.seo?.ogImage || `${IMAGEKIT_URL_ENDPOINT}/assets/img/blogs/BlogsPage.webp`,
    datePublished: blog.publishedAt || blog.createdAt,
    dateModified: blog.updatedAt || blog.createdAt,
    author: {
      "@type": "Person",
      name: blog.author || "Dazzling Tours",
    },
    publisher: {
      "@type": "Organization",
      name: "Dazzling Tours",
      logo: {
        "@type": "ImageObject",
        url: `${IMAGEKIT_URL_ENDPOINT}/assets/img/logo-dazzling/Logo_Black.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blogs/${blog.seo?.slug || blog._id}`,
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
        id="blog-breadcrumb-schema"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostSchema),
        }}
        id="blog-post-schema"
      />
      <BreadCrumb
        Title={blog.title}
        bgImg={blog.featuredImage || `${IMAGEKIT_URL_ENDPOINT}/assets/img/blogs/BlogsPage.webp`}
        items={[
          { label: "Blogs", href: "/blogs" },
          { label: blog.title },
        ]}
      />
      <BlogDetails slug={slug} />
      <Cta />
    </div>
  );
};

export default page;
