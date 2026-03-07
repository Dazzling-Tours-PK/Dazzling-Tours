import Image from "next/image";
import React from "react";

const Brand2 = () => {
  return (
    <section className="top-airlines-section section-padding pb-0 fix">
      <div className="container">
        <div className="section-title text-center">
          <span className="sub-title wow fadeInUp">top airlines</span>
          <h2 className="wow fadeInUp wow" data-wow-delay=".2s">
            Search Top Airlines
          </h2>
        </div>
        <div className="row">
          <div
            className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp"
            data-wow-delay=".2s"
          >
            <div className="airlines-items">
              <div className="airlines-image">
                <Image
                  src="/assets/img/feature/ar1.png"
                  alt="img"
                  width={64}
                  height={64}
                />
              </div>
              <div className="content">
                <h5>Etihad Airways</h5>
              </div>
            </div>
          </div>
          <div
            className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp"
            data-wow-delay=".4s"
          >
            <div className="airlines-items">
              <div className="airlines-image">
                <Image
                  src="/assets/img/feature/ar2.png"
                  alt="img"
                  width={64}
                  height={64}
                />
              </div>
              <div className="content">
                <h5>US-Bangla Airlines</h5>
              </div>
            </div>
          </div>
          <div
            className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp"
            data-wow-delay=".6s"
          >
            <div className="airlines-items">
              <div className="airlines-image">
                <Image
                  src="/assets/img/feature/ar3.png"
                  alt="img"
                  width={64}
                  height={64}
                />
              </div>
              <div className="content">
                <h5>Qatar Airways</h5>
              </div>
            </div>
          </div>
          <div
            className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp"
            data-wow-delay=".8s"
          >
            <div className="airlines-items">
              <div className="airlines-image">
                <Image
                  src="/assets/img/feature/ar4.png"
                  alt="img"
                  width={64}
                  height={64}
                />
              </div>
              <div className="content">
                <h5>NOVOAIR</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Brand2;
