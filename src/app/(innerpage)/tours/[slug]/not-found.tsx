import React from "react";
import Link from "next/link";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

export default function NotFound() {
  return (
    <div>
      <BreadCrumb
        bgImg="/assets/img/breadcrumb/breadcrumb.jpg"
        Title="Tour Not Found"
      />
      <section className="section-padding">
        <div className="container">
          <div className="text-center" style={{ padding: "3rem" }}>
            <h2>Tour Not Found</h2>
            <p className="mt-3">
              The tour you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Link href="/tours" className="theme-btn mt-4">
              Browse All Tours <i className="bi bi-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
