import React from "react";
import Layout from "../components/layout/Layout";

const TermsAndConditionsPage: React.FC = () => {
  return (
    <Layout>
      <section className="py-8 md:py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-10">
            <article className="prose dark:prose-invert prose-lg max-w-none">
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
                Terms and Conditions
              </h1>

              <p className="text-center text-gray-600 dark:text-gray-300 mb-10">
                Welcome to Crack Off Campus! By using our website and services, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully.
              </p>

              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    1. Acceptance of Terms
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    By accessing or using Crack Off Campus, you agree to these Terms and Conditions, our Privacy Policy, and all applicable laws. If you do not agree, please do not use our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    2. Services Provided
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Crack Off Campus offers job and internship listings, placement resources, and career support services. Some listings and resources are free, while others require payment.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    3. User Accounts
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    You may need to create an account to access some features. You agree to provide accurate information and keep your login credentials confidential. You are responsible for all activities under your account.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    4. Payment and Refunds
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Paid services and resources are non-refundable unless the service was not delivered as promised. Refund requests must be made within 7 days of purchase by contacting{" "}
                    <a
                      href="mailto:crackoffcampus63@gmail.com"
                      className="text-purple-600 hover:underline dark:text-purple-400"
                    >
                      crackoffcampus63@gmail.com
                    </a>.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    5. User Conduct
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    You agree not to misuse the platform, including but not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300 pl-4">
                    <li>Uploading unlawful, offensive, or infringing content</li>
                    <li>Attempting unauthorized access</li>
                    <li>Spamming or sending unsolicited communications</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    6. Intellectual Property
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    All content on Crack Off Campus, including text, graphics, and logos, is owned by or licensed to us. You may not reproduce or distribute any content without prior permission.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    7. Disclaimer
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    We strive to provide accurate and up-to-date information but do not guarantee completeness or results. Use the platform at your own risk.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    8. Limitation of Liability
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Crack Off Campus is not liable for any direct or indirect damages arising from use of the website or services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    9. Changes to Terms
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    We may update these Terms at any time. Changes will be posted here, and continued use means acceptance.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-3">
                    10. Contact Us
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    For any questions, please email us at{" "}
                    <a
                      href="mailto:crackoffcampus63@gmail.com"
                      className="text-purple-600 hover:underline dark:text-purple-400"
                    >
                      crackoffcampus63@gmail.com
                    </a>.
                  </p>
                </section>
              </div>
            </article>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsAndConditionsPage;