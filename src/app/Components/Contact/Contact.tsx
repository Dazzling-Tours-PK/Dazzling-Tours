"use client";
import React, { useState } from "react";
import { useCreateContactInquiry, useNotification } from "@/lib/hooks";
import { Icon } from "@/app/Components/Common";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
          phone: "",
          subject: "",
          message: "",
        });
        showSuccess("Thank you! Your message has been sent successfully.");
      },
    });
  };

  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        #contact-form input,
        #contact-form textarea {
          border-radius: 50px !important;
          font-size: 0.95rem !important;
        }
        #contact-form textarea {
          border-radius: 20px !important; /* Slightly less round for textarea */
        }
        #contact-form input::placeholder,
        #contact-form textarea::placeholder {
          color: #777 !important;
          opacity: 1 !important;
          font-weight: 400 !important;
          font-style: italic;
        }
        #contact-form .form-control:focus {
          border-color: #fd7e14 !important;
          box-shadow: 0 0 0 1px rgba(253, 126, 20, 0.1) !important;
        }
      `,
        }}
      />
      <section className="contact-us-section fix section-padding">
        <div className="container">
          <div className="row justify-content-center g-4">
            <div className="col-xl-5 col-lg-6 col-md-6">
              <div
                className="contact-us-main rounded shadow-sm border-top border-4 border-warning h-100"
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: "#fd7e14 !important",
                }}
              >
                <div className="contact-box-items flex-column text-center align-items-center p-4">
                  <div
                    className="icon d-flex align-items-center justify-content-center mx-auto mb-4"
                    style={{
                      backgroundColor: "#fff5eb",
                      borderRadius: "50%",
                      width: "80px",
                      height: "80px",
                    }}
                  >
                    <Icon name="geo-alt-fill" color="#fd7e14" size="2.5rem" />
                  </div>
                  <div className="content">
                    <h3 className="mb-2 fw-bold text-dark">Our Address</h3>
                    <p className="text-secondary mb-0">
                      Discover our welcoming office spaces <br />
                      for your perfect adventure.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-xl-5 col-lg-6 col-md-6">
              <div
                className="contact-us-main rounded shadow-sm border-top border-4 border-warning h-100"
                style={{
                  backgroundColor: "#ffffff",
                  borderColor: "#fd7e14 !important",
                }}
              >
                <div className="contact-box-items flex-column text-center align-items-center p-4">
                  <div
                    className="icon d-flex align-items-center justify-content-center mx-auto mb-4"
                    style={{
                      backgroundColor: "#fff5eb",
                      borderRadius: "50%",
                      width: "80px",
                      height: "80px",
                    }}
                  >
                    <Icon name="telephone-fill" color="#fd7e14" size="2.5rem" />
                  </div>
                  <div className="content">
                    <h3 className="mb-2 fw-bold text-dark">
                      <a href="tel:+923073440223" style={{ color: "#fd7e14" }}>
                        +92 307 344 0223
                      </a>
                    </h3>
                    <p className="text-secondary mb-0">
                      Call us anytime for instant support, <br />
                      we are waiting for your call.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-us-section-2 bg-light pt-4 pb-4 fix">
        <div className="container">
          <div className="contact-us-wrapper bg-white shadow-sm border rounded-4 overflow-hidden">
            <div className="row g-0 align-items-stretch">
              <div className="col-lg-6 px-5">
                <div className="contact-us-contact">
                  <div className="section-title">
                    <span
                      className="sub-title wow fadeInUp"
                      style={{ color: "#fd7e14" }}
                    >
                      Contact us
                    </span>
                    <h2
                      className="text-dark fw-bold wow fadeInUp pt-1"
                      data-wow-delay=".2s"
                    >
                      Send Message Anytime
                    </h2>
                    <p className="text-secondary mt-3">
                      We&apos;d love to hear from you. Fill out the form below
                      and our team will get back to you immediately.
                    </p>
                  </div>
                  <div className="comment-form-wrap mt-4">
                    <form onSubmit={handleSubmit} id="contact-form">
                      <div className="row g-4">
                        <div className="col-lg-6">
                          <div className="form-clt">
                            <input
                              type="text"
                              name="name"
                              id="name"
                              className="form-control p-3 bg-white border shadow-none"
                              style={{
                                borderColor: "#ddd",
                                color: "#222",
                                opacity: 1,
                              }}
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
                              className="form-control p-3 bg-white border shadow-none"
                              style={{
                                borderColor: "#ddd",
                                color: "#222",
                                opacity: 1,
                              }}
                              placeholder="Your Email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-clt">
                            <input
                              type="tel"
                              name="phone"
                              id="phone"
                              className="form-control p-3 bg-white border shadow-none"
                              style={{
                                borderColor: "#ddd",
                                color: "#222",
                                opacity: 1,
                              }}
                              placeholder="Phone Number"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="form-clt">
                            <input
                              type="text"
                              name="subject"
                              id="subject"
                              className="form-control p-3 bg-white border shadow-none"
                              style={{
                                borderColor: "#ddd",
                                color: "#222",
                                opacity: 1,
                              }}
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
                              className="form-control p-3 bg-white border shadow-none"
                              style={{
                                borderColor: "#ddd",
                                color: "#222",
                                opacity: 1,
                              }}
                              placeholder="Your Message..."
                              rows={5}
                              value={formData.message}
                              onChange={handleInputChange}
                              required
                            ></textarea>
                          </div>
                        </div>
                        <div className="col-lg-12 mt-3">
                          <button
                            type="submit"
                            className="theme-btn w-100 py-3"
                            disabled={createContactMutation.isPending}
                            style={{
                              backgroundColor: "#fd7e14",
                              color: "white",
                              border: "none",
                              borderRadius: "8px",
                              fontWeight: "bold",
                            }}
                          >
                            {createContactMutation.isPending
                              ? "Sending Securely..."
                              : "Submit Message"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="map-area h-100 w-100">
                  <div className="google-map h-100 w-100">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106263.29267923702!2d72.98687275000001!3d33.61625095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbfd07891722f%3A0x6059515c3bdb02b6!2sIslamabad%2C%20Islamabad%20Capital%20Territory%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                      loading="lazy"
                      className="border-0 w-100 h-100"
                      style={{ minHeight: "100%", display: "block" }}
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
