import Image from "next/image";
import React from "react";

const Feature1 = () => {
  return (
    <section className="feature-section section-padding">
      <div className="container">
        <div className="row">
          <div
            className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp wow"
            data-wow-delay=".2s"
          >
            <div className="feature-card-items">
              <div className="icon">
                <Image
                  src="/assets/img/icon/01.svg"
                  alt="img"
                  width={46}
                  height={46}
                />
              </div>
              <div className="content">
                <h3>A Lot of Discount</h3>
              </div>
            </div>
          </div>
          <div
            className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp wow"
            data-wow-delay=".4s"
          >
            <div className="feature-card-items">
              <div className="icon bg-color">
                <Image
                  src="/assets/img/icon/02.svg"
                  alt="img"
                  width={46}
                  height={46}
                />
              </div>
              <div className="content">
                <h3>Best Guide</h3>
              </div>
            </div>
          </div>
          <div
            className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp wow"
            data-wow-delay=".6s"
          >
            <div className="feature-card-items">
              <div className="icon">
                <Image
                  src="/assets/img/icon/03.svg"
                  alt="img"
                  width={46}
                  height={46}
                />
              </div>
              <div className="content">
                <h3>24/7 Support</h3>
              </div>
            </div>
          </div>
          <div
            className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp wow"
            data-wow-delay=".8s"
          >
            <div className="feature-card-items">
              <div className="icon">
                <Image
                  src="/assets/img/icon/04.svg"
                  alt="img"
                  width={46}
                  height={46}
                />
              </div>
              <div className="content">
                <h3>Travel Management</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature1;
