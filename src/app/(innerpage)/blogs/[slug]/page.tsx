import React from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import BlogDetails from "../../../Components/BlogDetails/BlogDetails";
import Cta from "../../../Components/Cta/Cta";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  // We can fetch the blog here for metadata if we want, but for now we'll just set the title

  // We can fetch the blog here for metadata if we want, but for now we'll just set the title
  // Detailed metadata can be added later if needed.
  return {
    title: `Blog Details | Dazzling Tours`,
  };
}

const page = async ({ params }: Props) => {
  const { slug } = await params;

  return (
    <div>
      <BreadCrumb
        bgImg="/assets/img/blogs/BlogsPage.webp"
        Title="Blog Details"
      ></BreadCrumb>
      <BlogDetails slug={slug}></BlogDetails>
      <Cta />
    </div>
  );
};

export default page;
