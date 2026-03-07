import Image from "next/image";
import React from "react";

const Counter4 = () => {
  return (
    <section className="counter-section theme-bg fix section-bg-3">
      <div className="container">
        <div className="counter-wrapper-3">
          <div className="counter-items wow fadeInUp wow" data-wow-delay=".2s">
            <div className="icon">
              <Image
                src="/assets/img/icon/35.svg"
                alt="img"
                width={40}
                height={40}
              />
            </div>
            <div className="counter-content">
              <h2>
                <span className="count">100,000</span>+
              </h2>
              <p>Our Explorers</p>
            </div>
          </div>
          <div className="counter-items wow fadeInUp wow" data-wow-delay=".4s">
            <div className="icon">
              <Image
                src="/assets/img/icon/36.svg"
                alt="img"
                width={40}
                height={40}
              />
            </div>
            <div className="counter-content">
              <h2>
                <span className="count">5,000</span>+
              </h2>
              <p>Destinations</p>
            </div>
          </div>
          <div className="counter-items wow fadeInUp wow" data-wow-delay=".6s">
            <div className="icon">
              <Image
                src="/assets/img/icon/37.svg"
                alt="img"
                width={40}
                height={40}
              />
            </div>
            <div className="counter-content">
              <h2>
                <span className="count">10,000</span>+
              </h2>
              <p>More Trips</p>
            </div>
          </div>
          <div
            className="counter-items style-2 wow fadeInUp wow"
            data-wow-delay=".8s"
          >
            <div className="icon">
              <Image
                src="/assets/img/icon/38.svg"
                alt="img"
                width={40}
                height={40}
              />
            </div>
            <div className="counter-content">
              <h2>
                <span className="count">2,000</span>+
              </h2>
              <p>Luxary Hotel</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Counter4;
