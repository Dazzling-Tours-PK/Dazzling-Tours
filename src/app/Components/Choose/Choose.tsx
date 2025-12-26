import Image from "next/image";

const Choose = () => {
  return (
    <section
      className="choose-us-section section-padding fix"
      style={{
        background:
          "linear-gradient(135deg, rgba(253, 125, 2, 0.1) 0%, rgba(2, 109, 247, 0.05) 50%, rgba(255, 193, 7, 0.08) 100%)",
        position: "relative",
      }}
    >
      <div className="container">
        <div className="choose-us-wrapper">
          <div className="row g-4 align-items-center">
            <div className="col-xl-7 col-lg-6">
              <div className="choose-us-content">
                <div className="section-title">
                  <span className="sub-title wow fadeInUp">Why Choose Us</span>
                  <h2 className="wow fadeInUp wow" data-wow-delay=".3s">
                    Your Journey, <br />
                    Our Commitment
                  </h2>
                </div>
                <p className="wow fadeInUp wow" data-wow-delay=".3s">
                  We go beyond just booking trips. We create experiences that{" "}
                  <br />
                  transform how you see the world, with personalized service and
                  attention to every detail.
                </p>
                <div className="choose-us-area">
                  <div className="line-shape">
                    <div className="custom-line"></div>
                  </div>
                  <div
                    className="choose-us-items wow fadeInUp wow"
                    data-wow-delay=".3s"
                  >
                    <h3 className="number">01</h3>
                    <div className="content">
                      <h4>
                        Personalized Tours <br />
                        Tailored to Your Dreams
                      </h4>
                      <p>
                        Every journey is uniquely crafted to match your
                        interests, <br />
                        budget, and travel style. Your perfect adventure awaits.
                      </p>
                    </div>
                  </div>
                  <div
                    className="choose-us-items wow fadeInUp wow"
                    data-wow-delay=".5s"
                  >
                    <h3 className="number">02</h3>
                    <div className="content">
                      <h4>Expert Local Guides & Support</h4>
                      <p>
                        Travel with confidence knowing our experienced team{" "}
                        <br />
                        is with you every step of the way, 24/7.
                      </p>
                    </div>
                  </div>
                  <div
                    className="choose-us-items wow fadeInUp wow"
                    data-wow-delay=".7s"
                  >
                    <h3 className="number">03</h3>
                    <div className="content">
                      <h4>Memories That Last Forever</h4>
                      <p>
                        We don&apos;t just plan trips, we create unforgettable{" "}
                        <br />
                        moments and stories you&apos;ll cherish for a lifetime.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-xl-5 col-lg-6 wow fadeInUp wow"
              data-wow-delay=".3s"
            >
              <div className="choose-us-thumb">
                <Image
                  src="/assets/img/choose/Choose1.webp"
                  className="wow img-custom-anim-left"
                  alt="img"
                  width={828}
                  height={620}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Choose;
