"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Slider from "react-slick";

const Category1 = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
    autoplay: true,
    autoplaySpeed: 4000,
    responsive: [
      {
        breakpoint: 1399,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const categoryContent = [
    {
      img: "/assets/img/destination/category1.jpg",
      subtitle: "6 Tour",
      title: "Adventure",
    },
    {
      img: "/assets/img/destination/category2.jpg",
      subtitle: "6 Tour",
      title: "Adventure",
    },
    {
      img: "/assets/img/destination/category3.jpg",
      subtitle: "6 Tour",
      title: "Adventure",
    },
    {
      img: "/assets/img/destination/category4.jpg",
      subtitle: "6 Tour",
      title: "Adventure",
    },
    {
      img: "/assets/img/destination/category5.jpg",
      subtitle: "6 Tour",
      title: "Adventure",
    },
  ];

  return (
    <section className="destination-category-section section-padding pt-0">
      <div className="plane-shape float-bob-y">
        <Image
          src="/assets/img/destination/shape.png"
          alt="img"
          width={370}
          height={205}
        />
      </div>
      <div className="container">
        <div className="section-title text-center">
          <span className="sub-title wow fadeInUp">
            Wonderful Place For You
          </span>
          <h2 className="wow fadeInUp wow" data-wow-delay=".2s">
            Browse By Destination Category
          </h2>
        </div>
      </div>
      <div className="container-fluid">
        <div className="swiper category-slider">
          <div className="swiper-wrapper cs_slider_gap_301">
            <Slider {...settings}>
              {categoryContent.map((item, i) => (
                <div key={i} className="swiper-slide">
                  <div className="destination-category-item">
                    <div className="category-image">
                      <Image
                        src={item.img}
                        alt="img"
                        width={338}
                        height={337}
                      />
                      <div className="category-content">
                        <h5>
                          <Link href="/destination/destination-details">
                            {item.title}
                          </Link>
                        </h5>
                        <p>{item.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
        <div className="swiper-dot4 mt-5">
          <div className="dot"></div>
        </div>
      </div>
    </section>
  );
};

export default Category1;
