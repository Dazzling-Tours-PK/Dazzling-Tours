"use client";
import { useEffect, useState } from "react";
import Nav from "./Nav";
import Link from "next/link";
import Image from "next/image";
export default function Header3() {
  const [mobileToggle, setMobileToggle] = useState(false);
  const [isSticky, setIsSticky] = useState<string>("");
  const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
  const [searchToggle, setSearchToggle] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      if (currentScrollPos > prevScrollPos) {
        setIsSticky("cs-gescout_sticky"); // Scrolling down
      } else if (currentScrollPos !== 0) {
        setIsSticky("cs-gescout_show cs-gescout_sticky"); // Scrolling up
      } else {
        setIsSticky("");
      }
      setPrevScrollPos(currentScrollPos); // Update previous scroll position
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup the event listener
    };
  }, [prevScrollPos]);

  return (
    <div>
      <header
        className={`cs_site_header header_style_2 header_style_2_2 cs_style_1 header_sticky_style1 cs_sticky_header cs_site_header_full_width ${
          mobileToggle ? "cs_mobile_toggle_active" : ""
        } ${isSticky ? isSticky : ""}`}
      >
        <div className="cs_top_header">
          <div className="container">
            <div className="cs_top_header_in">
              <div className="cs_top_header_left header-info">
                <ul className="cs_header_contact_list cs_mp_0 cs_white_color">
                  <li>
                    <i className="bi bi-envelope-fill"></i>
                    <a href="mailto:demo@example.com" aria-label="Email link">
                      demo@example.com
                    </a>
                  </li>
                  <li>
                    <i className="bi bi-telephone-fill"></i>
                    <a href="tel:+990123456789" aria-label="Phone call link">
                      +990 123 456 789
                    </a>
                  </li>
                  <li>
                    <i className="bi bi-geo-alt-fill"></i>
                    15/K, Dhaka London City, LOT
                  </li>
                </ul>
              </div>
              <div className="cs_top_header_right">
                <div className="cs_header_social_links_wrap">
                  <div className="cs_header_social_links top-header-social-icon">
                    <div className="cs_social_btns cs_style_1">
                      <a
                        href="#"
                        aria-label="Social link"
                        className="cs_center"
                      >
                        <i className="bi bi-twitter-x"></i>
                      </a>
                      <a
                        href="#"
                        aria-label="Social link"
                        className="cs_center"
                      >
                        <i className="bi bi-facebook"></i>
                      </a>
                      <a
                        href="#"
                        aria-label="Social link"
                        className="cs_center"
                      >
                        <i className="bi bi-linkedin"></i>
                      </a>
                      <a
                        href="#"
                        aria-label="Social link"
                        className="cs_center"
                      >
                        <i className="bi bi-instagram"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="cs_main_header">
          <div className="container">
            <div className="cs_main_header_in">
              <div className="cs_main_header_left">
                <Link className="cs_site_branding" href="/">
                  <Image
                    src="/assets/img/logo/black-logo.svg"
                    alt="img"
                    width={213}
                    height={55}
                  />
                </Link>
              </div>
              <div className="cs_main_header_center">
                <div className="cs_nav cs_primary_font fw-medium">
                  <span
                    className={
                      mobileToggle
                        ? "cs-munu_toggle cs_teggle_active"
                        : "cs-munu_toggle"
                    }
                    onClick={() => setMobileToggle(!mobileToggle)}
                  >
                    <span></span>
                  </span>
                  <Nav setMobileToggle={setMobileToggle} />
                </div>
              </div>
              <div className="cs_main_header_right">
                <div className="header-btn d-flex align-items-center">
                  <div className="main-button">
                    <a
                      onClick={() => setSearchToggle(!searchToggle)}
                      className="search-trigger search-icon"
                    >
                      <i className="bi bi-search"></i>
                    </a>
                    <Link href="/contact" className="theme-btn">
                      <span>
                        {" "}
                        Request A Quote{" "}
                        <i className="bi bi-arrow-right"></i>{" "}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="cs_site_header_spacing_140"></div>

      <div className={`search-wrap ${searchToggle ? "active" : ""}`}>
        <div className="search-inner">
          <i
            onClick={() => setSearchToggle(!searchToggle)}
            id="search-close"
            className="bi bi-x-lg search-close"
          ></i>
          <div className="search-cell">
            <form method="get">
              <div className="search-field-holder">
                <input
                  type="search"
                  className="main-search-input"
                  placeholder="Search..."
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
