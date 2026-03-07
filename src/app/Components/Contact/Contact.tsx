"use client";
import Image from "next/image";
import React, { useState } from "react";
import { useCreateContactInquiry, useNotification } from "@/lib/hooks";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const createContactMutation = useCreateContactInquiry();
  const { showSuccess } = useNotification();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createContactMutation.mutate(formData, {
      onSuccess: () => {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        showSuccess("Thank you! Your message has been sent successfully.");
      },
    });
  };
  return (
    <div>
      <section className="contact-us-section fix section-padding">
        <div className="container">
          <div className="row">
            <div className="col-xl-4 col-lg-6 col-md-6">
              <div className="contact-us-main">
                <div className="contact-box-items">
                  <div className="icon">
                    <Image
                      src="/assets/img/icon/18.svg"
                      alt="img"
                      width={70}
                      height={70}
                    />
                  </div>
                  <div className="content">
                    <h3>Our Address</h3>
                    <p>2464 Royal Ln. Mesa, New Jersey 45463.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6">
              <div className="contact-us-main style-2">
                <div className="contact-box-items">
                  <div className="icon">
                    <Image
                      src="/assets/img/icon/19.svg"
                      alt="img"
                      width={70}
                      height={70}
                    />
                  </div>
                  <div className="content">
                    <h3>
                      <a href="mailto:info@dazzlingtours.com">
                        info@dazzlingtours.com
                      </a>
                    </h3>
                    <p>
                      Email us anytime for any kind <br /> of queries.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6">
              <div className="contact-us-main">
                <div className="contact-box-items">
                  <div className="icon">
                    <Image
                      src="/assets/img/icon/20.svg"
                      alt="img"
                      width={70}
                      height={70}
                    />
                  </div>
                  <div className="content">
                    <h3>
                      <a href="tel:+256214203215">Hot:+256 214 203 215</a>
                    </h3>
                    <p>Call us any kind of support, we will wait for it.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-us-section-2 section-bg-2 fix">
        <div className="container">
          <div className="contact-us-wrapper">
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="contact-us-contact">
                  <div className="section-title">
                    <span className="sub-title text-white wow fadeInUp">
                      Contact us
                    </span>
                    <h2
                      className=" text-white wow fadeInUp wow"
                      data-wow-delay=".2s"
                    >
                      Send Message Anytime
                    </h2>
                  </div>
                  <div className="comment-form-wrap">
                    <form onSubmit={handleSubmit} id="contact-form">
                      <div className="row g-4">
                        <div className="col-lg-6">
                          <div className="form-clt">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              placeholder="Your Name"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-clt">
                            <input
                              type="email"
                              name="email"
                              id="email4"
                              placeholder="Your Email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="form-clt">
                            <input
                              type="text"
                              name="subject"
                              id="subject"
                              placeholder="Subject"
                              value={formData.subject}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="form-clt">
                            <textarea
                              name="message"
                              id="message"
                              placeholder="Your Message"
                              value={formData.message}
                              onChange={handleInputChange}
                              required
                            ></textarea>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <button
                            type="submit"
                            className="theme-btn"
                            disabled={createContactMutation.isPending}
                          >
                            {createContactMutation.isPending
                              ? "Sending..."
                              : "Submit Message"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="map-area">
                  <div className="google-map">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6678.7619084840835!2d144.9618311901502!3d-37.81450084255415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642b4758afc1d%3A0x3119cc820fdfc62e!2sEnvato!5e0!3m2!1sen!2sbd!4v1641984054261!5m2!1sen!2sbd"
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
