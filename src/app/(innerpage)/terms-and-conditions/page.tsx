import React from "react";
import type { Metadata } from "next";
import BreadCrumb from "@/app/Components/Common/BreadCrumb";

export const metadata: Metadata = {
  title: "Terms and Conditions | Dazzling Tours",
  description:
    "Read our terms and conditions for booking tours and travels with Dazzling Tours.",
  alternates: {
    canonical: "/terms-and-conditions",
  },
};

const TermsAndConditionsPage = () => {
  return (
    <>
      <BreadCrumb
        bgImg="/assets/img/breadcrumb/aboutpage.png"
        Title="Terms & Conditions"
      />
      <section className="terms-section section-padding pt-5 pb-5">
        <div
          className="container"
          style={{
            backgroundColor: "#1e1e1e",
            padding: "40px",
            borderRadius: "10px",
            color: "#e0e0e0",
          }}
        >
          <div className="row">
            <div className="col-12">
              <h2 className="mb-4 text-white">Terms and Conditions</h2>
              <p>
                Welcome to Dazzling Tours. These terms and conditions outline
                the rules and regulations for the use of Dazzling Tours&apos;
                Website and Services.
              </p>

              <h4 className="mt-4 text-white">1. Acceptance of Terms</h4>
              <p>
                By accessing this website we assume you accept these terms and
                conditions. Do not continue to use Dazzling Tours if you do not
                agree to take all of the terms and conditions stated on this
                page.
              </p>

              <h4 className="mt-4 text-white">2. Booking and Payments</h4>
              <p>
                All bookings are subject to availability and confirmation. A
                deposit or full payment may be required at the time of booking
                depending on the tour package. We reserve the right to alter
                pricing before booking confirmation.
              </p>

              <h4 className="mt-4 text-white">3. Cancellations and Refunds</h4>
              <p>
                Cancellation policies vary depending on the tour booked.
                Generally, cancellations made within a certain window before the
                departure date may be subject to a cancellation fee. Please
                review the specific cancellation policy for your chosen tour.
              </p>

              <h4 className="mt-4 text-white">4. Travel Documents</h4>
              <p>
                It is the passenger&apos;s responsibility to ensure they have
                valid passports, visas, and necessary health requirements for
                their journey. Dazzling Tours is not liable for any issues
                arising from incorrect documentation.
              </p>

              <h4 className="mt-4 text-white">5. Liability</h4>
              <p>
                Dazzling Tours shall not be liable for any injury, damage, loss,
                accident, delay, or irregularity that may be caused to person or
                property in connection with any service provided.
              </p>

              <h4 className="mt-4 text-white">6. Changes to Terms</h4>
              <p>
                We reserve the right to make changes to these terms and
                conditions at any time. Your continued use of the website and
                our services following any changes indicates your acceptance of
                the new terms.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TermsAndConditionsPage;
