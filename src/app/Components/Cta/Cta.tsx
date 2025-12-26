"use client";
import React, { useState } from "react";
import VideoModal from "../VideoModal/VideoModal";
import Link from "next/link";

const Cta = () => {
  const [iframeSrc, setIframeSrc] = useState("about:blank");
  const [toggle, setToggle] = useState(false);

  const handelClick = () => {
    setIframeSrc("https://www.youtube.com/embed/HC-tgFdIcB0");
    setToggle(!toggle);
  };
  const handelClose = () => {
    setIframeSrc("about:blank");
    setToggle(!toggle);
  };

  const backgroundImage = "/assets/img/cta/mountain-trip-family.jpg";

  return (
    <section
      className="cta-bg-section fix bg-cover"
      data-background={backgroundImage}
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
      suppressHydrationWarning
    >
      <div className="container">
        <div className="row">
          <div className="cta-wrapper">
            <div className="section-title text-center">
              <span className="sub-title text-white wow fadeInUp">
                Ready to Explore?
              </span>
              <h2 className="text-white wow fadeInUp wow" data-wow-delay=".3s">
                Start Your Next <br />
                Adventure Today
              </h2>
            </div>
            <div className="cta-btn wow fadeInUp wow" data-wow-delay=".5s">
              <Link href="/tours" className="theme-btn">
                Explore Tours<i className="bi bi-arrow-right"></i>
              </Link>
              <div className="watch-btn">
                <a
                  onClick={handelClick}
                  data-delay=".7s"
                  className="video-btn video-popup"
                >
                  <i className="bi bi-play-fill"></i>
                </a>
                <h6>Watch Our Story</h6>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VideoModal
        isTrue={toggle}
        iframeSrc={iframeSrc}
        handelClose={handelClose}
      ></VideoModal>
    </section>
  );
};

export default Cta;
