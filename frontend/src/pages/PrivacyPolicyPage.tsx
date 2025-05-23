import type React from "react";
import Footer from "../components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="flex-grow">
        {/* Hero Section */}
        <Navbar></Navbar>
        <section
          className="py-16 text-center relative"
          style={{ backgroundColor: "rgb(186, 175, 220)" }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-800 dark:text-white">
              Privacy Policy
            </h1>
           
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/10 dark:to-gray-900/30"></div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-10 transition-all duration-300">
              <article className="prose dark:prose-invert prose-lg max-w-none">
                <p>
                  At <strong>Crack Off-Campus</strong>, we value your privacy
                  and are committed to protecting your personal information.
                  This Privacy Policy explains how we collect, use, and
                  safeguard your data when you use our website and services.
                </p>

                {/* Section 1 */}
                <h2>1. Information We Collect</h2>
                <h3>Personal Information</h3>
                <p>
                  When you register or use our services, we may collect your
                  name, email address, phone number, resume details, and other
                  relevant information.
                </p>
                <h3>Usage Data</h3>
                <p>
                  We collect information about how you use our website, such as
                  pages visited, time spent, IP address, browser type, and
                  device information.
                </p>
                <h3>Cookies</h3>
                <p>
                  We use cookies to enhance your experience, track usage
                  patterns, and provide personalized content.
                </p>

                {/* Section 2 */}
                <h2>2. How We Use Your Information</h2>
                <p>We use your data to:</p>
                <ul>
                  <li>Provide and improve our services</li>
                  <li>
                    Communicate with you about updates, offers, and support
                  </li>
                  <li>Process payments for paid services</li>
                  <li>Prevent fraud and ensure security</li>
                  <li>Comply with legal obligations</li>
                </ul>

                {/* Section 3 */}
                <h2>3. Sharing Your Information</h2>
                <p>
                  We do not sell or rent your personal data to third parties.
                  However, we may share your information with:
                </p>
                <ul>
                  <li>
                    Trusted service providers who help us operate the website
                    and services
                  </li>
                  <li>
                    Employers or companies when you apply for jobs/internships
                    through our platform (with your consent)
                  </li>
                  <li>Legal authorities if required by law</li>
                </ul>

                {/* Section 4 */}
                <h2>4. Your Choices</h2>
                <ul>
                  <li>
                    You can update or correct your account information anytime.
                  </li>
                  <li>
                    You can opt out of promotional emails by clicking the
                    unsubscribe link.
                  </li>
                  <li>You can delete your account.</li>
                </ul>

                {/* Section 5 */}
                <h2>5. Data Security</h2>
                <p>
                  We implement reasonable technical and organizational measures
                  to protect your data from unauthorized access, alteration, or
                  disclosure.
                </p>

                {/* Section 6 */}
                <h2>6. Children's Privacy</h2>
                <p>
                  Our services are not intended for children under 18. We do not
                  knowingly collect personal data from minors.
                </p>

                {/* Section 7 */}
                <h2>7. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy periodically. The latest
                  version will always be available on our website.
                </p>

                {/* Section 8 */}
                <h2>8. Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy, please
                  contact us at:
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:crackoffcampus63@gmail.com"
                    className="text-foundit-blue hover:underline dark:text-blue-400"
                  >
                    crackoffcampus63@gmail.com
                  </a>
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
