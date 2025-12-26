"use client";
import React, { useEffect, useState } from "react";
import loadBackgroundImages from "../Common/loadBackgroundImages";
import Link from "next/link";
import Image from "next/image";
import { useSubscribeNewsletter, useNotification } from "@/lib/hooks";
import { Group } from "../Common";

const Footer = () => {
  const [email, setEmail] = useState("");

  const subscribeMutation = useSubscribeNewsletter();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    loadBackgroundImages();
  }, []);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showError("Please enter your email address");
      return;
    }

    subscribeMutation.mutate(
      { email },
      {
        onSuccess: (data) => {
          setEmail("");
          showSuccess(
            data.message || "Thank you for subscribing to our newsletter!"
          );
        },
        onError: (error) => {
          showError(error.message || "Failed to subscribe to newsletter");
        },
      }
    );
  };

  return (
    <footer
      className="footer-section fix bg-cover"
      data-background="/assets/img/footer/footer-bg.jpg"
    >
      <div className="footer-overlay"></div>
      <div className="container">
        <div className="footer-widget-wrapper-new">
          <div className="row">
            <div
              className="col-xl-4 col-lg-5 col-md-8 col-sm-6 wow fadeInUp wow"
              data-wow-delay=".2s"
            >
              <div className="single-widget-items text-center">
                <div className="widget-head">
                  <a href="#">
                    <Image
                      src="/assets/img/logo dazzling/Dazzling Tours Png.png"
                      alt="img"
                      width={100}
                      height={100}
                    />
                  </a>
                </div>
                <div className="footer-content">
                  <h3>Subscribe Newsletter</h3>
                  <p>Get Our Latest Deals and Update</p>
                  <form onSubmit={handleNewsletterSubmit}>
                    <div className="footer-input">
                      <input
                        type="email"
                        id="email2"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={subscribeMutation.isPending}
                      />
                      <button
                        className="newsletter-btn theme-btn"
                        type="submit"
                        disabled={subscribeMutation.isPending}
                      >
                        {subscribeMutation.isPending
                          ? "Subscribing..."
                          : "Subscribe"}{" "}
                        <i className="bi bi-arrow-right"></i>
                      </button>
                    </div>
                  </form>
                  <div className="social-icon d-flex align-items-center justify-content-center">
                    <a href="#">
                      <i className="bi bi-facebook"></i>
                    </a>
                    <a href="#">
                      <i className="bi bi-twitter-x"></i>
                    </a>
                    <a href="#">
                      <i className="bi bi-linkedin"></i>
                    </a>
                    <a href="#">
                      <i className="bi bi-instagram"></i>
                    </a>
                  </div>
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
                  <div className="contact-items">
                    <div className="icon">
                      <i className="bi bi-geo-alt-fill"></i>
                    </div>
                    <div className="content">
                      <h6>
                        2464 Royal Ln. Mesa, New Jersey 45463. <br />
                        United States
                      </h6>
                    </div>
                  </div>
                  <div className="contact-items">
                    <div className="icon">
                      <i className="bi bi-envelope-fill"></i>
                    </div>
                    <div className="content">
                      <h6>
                        <a href="mailto:info@dazzlingtours.com">
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
                        <a href="tel:+256214203215">+256 214 203 215</a> <br />
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
