import React from "react";
import Layout from "../components/layout/Layout"; // Assuming Layout component for consistent structure

const RefundPolicyPage: React.FC = () => {
  return (
    <Layout>
      <section
        className="py-16 text-center relative"
        style={{ backgroundColor: "rgb(186, 175, 220)" }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
            Refund Policy
          </h1>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/10 dark:to-gray-900/30"></div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-10 transition-all duration-300">
            <article className="prose dark:prose-invert prose-lg max-w-none">
              <p>
                At <strong>Crack Off-Campus</strong>, we strive to provide the
                best services and resources to help you succeed. Please read
                our refund policy carefully before making a purchase.
              </p>

              <h2>1. Paid Services</h2>
              <p>
                All sales of paid services (such as CV reviews, mock
                interviews, referrals, mentorship, and placement resources) are
                final. We do not offer refunds or exchanges once a service has
                been purchased.
              </p>

              <h2>2. Service Delivery</h2>
              <p>
                Our services are delivered online. After your purchase, you
                will receive instructions via email on how to access and avail
                the service.
              </p>

              <h2>3. Refund Eligibility</h2>
              <p>
                If you are charged for a service but do not receive it due to a
                technical error or other issues caused by us, please contact us
                within 7 days of the transaction at:
              </p>
              <p>
                Email:{" "}
                <a href="mailto:crackoffcampus63@gmail.com">
                  crackoffcampus63@gmail.com
                </a>
              </p>
              <p>
                We will investigate your claim and, if found valid, issue a
                refund within 7 days.
              </p>

              <h2>4. How to Request a Refund</h2>
              <ul>
                <li>
                  Email us at{" "}
                  <a href="mailto:info@crackoffcampus.com">
                    info@crackoffcampus.com
                  </a>{" "}
                  with your order details and reason for refund.
                </li>
                <li>
                  Our team will review and respond within 3-5 business days.
                </li>
              </ul>

              <h2>5. No Refunds For:</h2>
              <ul>
                <li>Change of mind</li>
                <li>Failure to use the service after purchase</li>
                <li>Issues arising from user error or negligence</li>
              </ul>

              <h2>6. Contact Us</h2>
              <p>
                If you have any questions about this refund policy, please
                contact us at{" "}
                <a href="mailto:crackoffcampus63@gmail.com">
                  crackoffcampus63@gmail.com
                </a>
                .
              </p>
            </article>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default RefundPolicyPage;