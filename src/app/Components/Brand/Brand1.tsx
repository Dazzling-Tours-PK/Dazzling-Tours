"use client";
import Image from "next/image";
import React from "react";
import Slider from "react-slick";

const Brand1 = () => {
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

  const chooseContent = [
    { img: "/assets/img/brand/01.png" },
    { img: "/assets/img/brand/01.png" },
    { img: "/assets/img/brand/01.png" },
    { img: "/assets/img/brand/01.png" },
    { img: "/assets/img/brand/01.png" },
  ];

  return (
    <div className="brand-section section-padding pt-0">
      <div className="left-shape">
        <Image
          src="/assets/img/brand/shape.png"
          alt="img"
          width={148}
          height={262}
        />
      </div>

      <div className="container">
        <div className="brand-wrapper">
          <h4 className="brand-title wow fadeInUp" data-wow-delay=".3s">
            1k + Brands Trust Us
          </h4>
          <div className="swiper brand-slider">
            <div className="swiper-wrapper">
              <Slider {...settings}>
                {chooseContent.map((item, i) => (
                  <div key={i} className="swiper-slide">
                    <div className="brand-image">
                      <Image src={item.img} alt="img" width={154} height={31} />
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brand1;
