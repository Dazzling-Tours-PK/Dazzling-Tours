import React from "react";
import type { Metadata } from "next";
import BreadCrumb from "@/app/Components/Common/BreadCrumb";

export const metadata: Metadata = {
  title: "Privacy Policy | Dazzling Tours - Explore the nature",
  description: "Explore the nature",
  alternates: {
    canonical: "/privacy-policy",
  },
};

const PrivacyPolicyPage = () => {
  return (
    <>
      <BreadCrumb
        bgImg="/assets/img/breadcrumb/aboutpage.png"
        Title="Privacy Policy"
      />
      <section className="privacy-section section-padding pt-5 pb-5">
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
              <h2 className="mb-4 text-white">Privacy Policy</h2>
              <p>
                At Dazzling Tours, accessible from the website, one of our main
                priorities is the privacy of our visitors. This Privacy Policy
                document contains types of information that is collected and
                recorded by Dazzling Tours and how we use it.
              </p>

              <h4 className="mt-4 text-white">1. Information We Collect</h4>
              <p>
                The personal information that you are asked to provide, and the
                reasons why you are asked to provide it, will be made clear to
                you at the point we ask you to provide your personal
                information. If you contact us directly, we may receive
                additional information about you such as your name, email
                address, phone number, the contents of the message and/or
                attachments you may send us, and any other information you may
                choose to provide.
              </p>

              <h4 className="mt-4 text-white">
                2. How We Use Your Information
              </h4>
              <p>
                We use the information we collect in various ways, including to:
              </p>
              <ul>
                <li>Provide, operate, and maintain our website and services</li>
                <li>Improve, personalize, and expand our website</li>
                <li>Understand and analyze how you use our website</li>
                <li>
                  Develop new products, services, features, and functionality
                </li>
                <li>
                  Communicate with you, either directly or through one of our
                  partners, including for customer service, to provide you with
                  updates and other information relating to the website
                </li>
                <li>Send you emails related to your bookings and inquiries</li>
              </ul>

              <h4 className="mt-4 text-white">3. Log Files</h4>
              <p>
                Dazzling Tours follows a standard procedure of using log files.
                These files log visitors when they visit websites. The
                information collected by log files include internet protocol
                (IP) addresses, browser type, Internet Service Provider (ISP),
                date and time stamp, referring/exit pages, and possibly the
                number of clicks.
              </p>

              <h4 className="mt-4 text-white">4. Security</h4>
              <p>
                We value your trust in providing us your Personal Information,
                thus we are striving to use commercially acceptable means of
                protecting it. But remember that no method of transmission over
                the internet, or method of electronic storage is 100% secure and
                reliable, and we cannot guarantee its absolute security.
              </p>

              <h4 className="mt-4 text-white">
                5. Changes to This Privacy Policy
              </h4>
              <p>
                We may update our Privacy Policy from time to time. Thus, we
                advise you to review this page periodically for any changes. We
                will notify you of any changes by posting the new Privacy Policy
                on this page. These changes are effective immediately, after
                they are posted on this page.
              </p>

              <h4 className="mt-4 text-white">6. Contact Us</h4>
              <p>
                If you have any questions or suggestions about our Privacy
                Policy, do not hesitate to contact us at info@dazzlingtours.com.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicyPage;
