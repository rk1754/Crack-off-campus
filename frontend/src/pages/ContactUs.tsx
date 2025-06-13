"use client"

import { useState } from "react"
import { Mail, Phone, MessageSquare } from "lucide-react"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"

const Contact = () => {
  const [message, setMessage] = useState("")

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message || "Hi, I'm interested in your services.")
    window.open(`https://wa.me/918218498723?text=${encodedMessage}`, "_blank")
  }

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Navbar />

      <main className="flex-grow bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4 sm:py-12 sm:px-6 lg:px-8 w-full">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Get in Touch</h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Have questions about our services? We're here to help! Reach out to us directly through WhatsApp or Email.
            </p>
          </div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:scale-105">
              <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-5 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Contact Information</h2>
                <p className="text-purple-100 mt-1 sm:mt-2 text-sm sm:text-base">
                  Reach out to us through any of these channels for quick assistance
                </p>
              </div>

              <div className="p-5 sm:p-8">
                <div className="space-y-5 sm:space-y-6">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="bg-purple-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                      <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <a
                        href="mailto:crackoffcampus63@gmail.com"
                        className="text-base sm:text-lg font-semibold text-purple-600 hover:text-purple-500 break-all"
                      >
                        crackoffcampus63@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="bg-purple-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                      <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <a
                        href="tel:+918218498723"
                        className="text-base sm:text-lg font-semibold text-purple-600 hover:text-purple-500"
                      >
                        +91 82184 98723
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="bg-green-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                      <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">WhatsApp</p>
                      <a
                        href="https://wa.me/918218498723"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base sm:text-lg font-semibold text-green-600 hover:text-green-500"
                      >
                        Chat with us
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <h3 className="text-xs sm:text-sm font-medium text-purple-900 mb-1 sm:mb-2">Quick Response</h3>
                  <p className="text-xs sm:text-sm text-purple-700">
                    We typically respond to all inquiries within 24 hours. For urgent matters, please contact us
                    directly via WhatsApp for faster assistance.
                  </p>
                </div>
              </div>
            </div>

            {/* WhatsApp Message Card */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-5 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Send us on WhatsApp</h2>
                <p className="text-green-100 mt-1 sm:mt-2 text-sm sm:text-base">
                  Type your message below and send it directly to our WhatsApp
                </p>
              </div>

              <div className="p-5 sm:p-8">
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none text-sm sm:text-base"
                      placeholder="Type your message here..."
                    />
                  </div>

                  <button
                    onClick={handleWhatsAppClick}
                    className="w-full bg-green-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Send via WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="mt-8 sm:mt-12 bg-white rounded-2xl shadow-xl p-5 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">Our Services</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl text-center transform transition-all hover:scale-105">
                <div className="bg-white rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
                  <span className="text-xl sm:text-2xl">📄</span>
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">Resume Review</h4>
                <p className="text-sm text-gray-600 mt-1 sm:mt-2">
                  Professional resume analysis and improvement suggestions
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl text-center transform transition-all hover:scale-105">
                <div className="bg-white rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
                  <span className="text-xl sm:text-2xl">💼</span>
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">Career Services</h4>
                <p className="text-sm text-gray-600 mt-1 sm:mt-2">Interview preparation and career guidance</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl text-center transform transition-all hover:scale-105">
                <div className="bg-white rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
                  <span className="text-xl sm:text-2xl">🎯</span>
                </div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">Job Portal</h4>
                <p className="text-sm text-gray-600 mt-1 sm:mt-2">Access to exclusive off-campus job opportunities</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Contact
