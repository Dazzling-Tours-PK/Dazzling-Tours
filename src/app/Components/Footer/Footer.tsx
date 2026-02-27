"use client";
import React, { useEffect } from "react";
import loadBackgroundImages from "../Common/loadBackgroundImages";
import Link from "next/link";
import Image from "next/image";
import { Group } from "../Common";

const Footer = () => {
  useEffect(() => {
    loadBackgroundImages();
  }, []);

  return (
    <footer
      className="footer-section fix bg-cover"
      data-background="/assets/img/footer/footer-bg.jpg"
    >
      <div className="footer-overlay"></div>
      <div className="container">
        <div className="footer-widget-wrapper-new">
          <div className="row">
            {/* Logo + Social Icons Column */}
            <div
              className="col-xl-4 col-lg-4 col-md-6 col-sm-12 wow fadeInUp"
              data-wow-delay=".2s"
            >
              <div className="single-widget-items text-center">
                <div className="widget-head mb-3">
                  <Link href="/" className="d-flex justify-content-center">
                    <Image
                      src="/assets/img/logo dazzling/Dazzling Tours Png.png"
                      alt="Dazzling Tours"
                      width={200}
                      height={200}
                      style={{ display: "block", margin: "0 auto" }}
                    />
                  </Link>
                </div>
                <div
                  className="social-icon d-flex align-items-center justify-content-center gap-3 mt-3"
                  style={{ fontSize: "1.3rem" }}
                >
                  <a
                    href="https://www.tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    style={{ color: "#fd7d02" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    style={{ color: "#fd7d02" }}
                  >
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    style={{ color: "#fd7d02" }}
                  >
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a
                    href="https://www.youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    style={{ color: "#fd7d02" }}
                  >
                    <i className="bi bi-youtube"></i>
                  </a>
                </div>
              </div>
            </div>
            <div
              className="col-xl-2 col-lg-3 col-md-4 col-sm-6 ps-lg-5 wow fadeInUp wow"
              data-wow-delay=".4s"
            >
              <div className="single-widget-items">
                <div className="widget-head">
                  <h4>Quick Links</h4>
                </div>
                <ul className="list-items">
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li>
                    <Link href="/about">About Us</Link>
                  </li>
                  <li>
                    <Link href="/blogs">Blogs</Link>
                  </li>

                  <li>
                    <Link href="/tours">Tours</Link>
                  </li>
                  <li>
                    <Link href="/contact">Contact</Link>
                  </li>
                  <li>
                    <Link href="/admin">Admin</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div
              className="col-xl-3 col-lg-4 col-md-6 col-sm-6 ps-xl-5 wow fadeInUp wow"
              data-wow-delay=".6s"
            >
              <div className="single-widget-items">
                <div className="widget-head">
                  <h4>Contact Us</h4>
                </div>
                <div className="contact-info">
                  {/* <div className="contact-items">
                    <div className="icon">
                      <i className="bi bi-geo-alt-fill"></i>
                    </div>
                    <div className="content">
                      <h6>
                        2464 Royal Ln. Mesa, New Jersey 45463. <br />
                        United States
                      </h6>
                    </div>
                  </div> */}
                  <div className="contact-items">
                    <div className="icon">
                      <i className="bi bi-envelope-fill"></i>
                    </div>
                    <div className="content">
                      <h6>
                        <a
                          href="mailto:info@dazzlingtours.com"
                          style={{ textTransform: "lowercase" }}
                        >
                          info@dazzlingtours.com
                        </a>
                      </h6>
                    </div>
                  </div>
                  <div className="contact-items">
                    <div className="icon">
                      <i className="bi bi-telephone-fill"></i>
                    </div>
                    <div className="content">
                      <h6>
                        <a href="tel:+923073440223">+92 307 3440223</a> <br />
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-wrapper">
            <Group>
              <p className="wow fadeInUp" data-wow-delay=".3s">
                Copyright © <span>Dazzling Tours,</span> All Rights Reserved.
              </p>
              <p className="wow fadeInUp" data-wow-delay=".3s">
                Made with{" "}
                <span style={{ color: "red" }}>
                  <i className="bi bi-heart-fill"></i>
                </span>{" "}
                by{" "}
                <span>
                  <a href="https://www.alphabrackets.com">Alpha Brackets</a>
                </span>
              </p>
            </Group>
            <Group className="bottom-list">
              <Link
                href="/terms-and-conditions"
                target="_blank"
                className="footer-link"
              >
                Terms and Conditions
              </Link>
              <Link
                href="/privacy-policy"
                target="_blank"
                className="footer-link"
              >
                Privacy Policy
              </Link>
            </Group>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
