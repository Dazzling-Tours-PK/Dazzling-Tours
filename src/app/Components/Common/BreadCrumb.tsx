"use client";
import Link from "next/link";

interface BreadCrumbProps {
  Title: string;
  bgImg: string;
}

const BreadCrumb = ({ Title, bgImg }: BreadCrumbProps) => {
  return (
    <section
      className="breadcrumb-wrapper fix bg-cover"
      data-background={bgImg}
      style={{
        backgroundImage: bgImg ? `url('${bgImg}')` : undefined,
      }}
      suppressHydrationWarning
    >
      <div className="container">
        <div className="row">
          <div className="page-heading">
            <h2>{Title}</h2>
            <ul className="breadcrumb-list">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <i className="bi bi-chevron-double-right"></i>
              </li>
              <li>{Title}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BreadCrumb;
