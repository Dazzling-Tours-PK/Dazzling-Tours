import React from "react";

const HeroBanner2 = () => {
  const heroImage = "/assets/img/hero/hero2.webp";

  return (
    <section className="hero-section-2">
      <div
        className="hero-2 bg-cover"
        data-background={heroImage}
        style={{
          backgroundImage: `url('${heroImage}')`,
        }}
        suppressHydrationWarning
      >
        {/* Black overlay for better text visibility */}
        <div className="hero-overlay"></div>
        <div className="container custom-container-3">
          <div className="row">
            <div className="col-lg-6">
              <div className="hero-content">
                <div className="sub-title wow fadeInUp">
                  Your Adventure Starts Here
                </div>
                <h1 className="wow fadeInUp" data-wow-delay=".3s">
                  Explore the nature
                </h1>
                <p className="wow fadeInUp" data-wow-delay=".5s">
                  Discover breathtaking landscapes and unforgettable experiences
                  with Dazzling Tours. Let us take you on your next
                  extraordinary adventure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner2;
