"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { IconTick } from "../Common/icons";

const About = () => {
  const pathname = usePathname();
  const isAboutUsPage = pathname === "/about-us";
  return (
    <section className="about-section section-padding fix">
      <div className="container">
        <div className="about-wrapper-2">
          <div className="row g-4">
            <div className="col-lg-6">
              <div
                className="about-image wow fadeInUp wow"
                data-wow-delay=".3s"
              >
                <Image
                  src="/assets/img/about/about1.webp"
                  alt="Dazzling Tours team creating memorable travel experiences"
                  width={450}
                  height={449}
                  priority
                />
                <div
                  className="about-image-2 wow fadeInUp wow"
                  data-wow-delay=".5s"
                >
                  <Image
                    src="/assets/img/about/about2.webp"
                    alt="Travel experts planning personalized tours"
                    width={150}
                    height={150}
                  />
                </div>
                <div
                  className="about-image-3 wow fadeInUp wow"
                  data-wow-delay=".7s"
                >
                  <Image
                    src="/assets/img/about/about3.webp"
                    alt="Beautiful destinations and travel adventures"
                    width={200}
                    height={200}
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="about-content">
                <div className="section-title">
                  <span className="sub-title wow fadeInUp">About Us</span>
                  <h2 className="wow fadeInUp wow" data-wow-delay=".3s">
                    Your Trusted Partner in Creating Unforgettable Journeys
                  </h2>
                </div>
                <p className="wow fadeInUp wow" data-wow-delay=".5s">
                  With years of experience in crafting exceptional travel
                  experiences, we specialize in curating personalized tours that
                  showcase the world&apos;s most beautiful destinations. Your
                  adventure is our passion.
                </p>
                <div
                  className="about-items wow fadeInUp wow"
                  data-wow-delay=".3s"
                >
                  <div className="about-icon-items">
                    <div className="icon">
                      <IconTick />
                    </div>
                    <div className="content">
                      <h5>
                        Curated <br /> Experiences
                      </h5>
                    </div>
                  </div>
                  <div className="text">
                    <p>
                      Handpicked destinations and <br /> carefully planned
                      itineraries tailored to your preferences.
                    </p>
                  </div>
                </div>
                <div
                  className="about-items wow fadeInUp wow"
                  data-wow-delay=".5s"
                >
                  <div className="about-icon-items">
                    <div className="icon">
                      <IconTick />
                    </div>
                    <div className="content">
                      <h5>
                        Expert <br /> Guidance
                      </h5>
                    </div>
                  </div>
                  <div className="text">
                    <p>
                      Professional travel experts <br /> dedicated to making
                      your journey seamless and memorable.
                    </p>
                  </div>
                </div>
                {!isAboutUsPage && (
                  <Link
                    href="/about-us"
                    className="theme-btn wow fadeInUp wow"
                    data-wow-delay=".7s"
                  >
                    Discover More<i className="bi bi-arrow-right"></i>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
