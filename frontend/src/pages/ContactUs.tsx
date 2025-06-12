"use client"

import type React from "react"
import { useState, useRef } from "react"
import emailjs from "@emailjs/browser"
import { Mail, Phone, MessageSquare, Send, CheckCircle, AlertCircle } from "lucide-react"
import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"

interface FormData {
  name: string
  email: string
  contactNumber: string
  queryType: "enquiry" | "payment"
  message: string
}

interface FormStatus {
  type: "success" | "error" | null
  message: string
}

const Contact: React.FC = () => {
  const form = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    contactNumber: "",
    queryType: "enquiry",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<FormStatus>({ type: null, message: "" })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus({ type: null, message: "" })

    try {
      if (form.current) {
        const result = await emailjs.sendForm(
          "service_oaw0ekc", // Your service ID
          "template_dopujol", // You'll need to create this template in EmailJS
          form.current,
          "PkEK-jqv8myEbf6Hi", // Your public key
        )

        if (result.status === 200) {
          setStatus({
            type: "success",
            message: "Thank you for your message! We'll get back to you within 24 hours.",
          })
          setFormData({
            name: "",
            email: "",
            contactNumber: "",
            queryType: "enquiry",
            message: "",
          })
        }
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Failed to send message. Please try again or contact us directly.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      `Hi, I'm ${formData.name}. I have a ${formData.queryType} regarding your services. ${formData.message}`,
    )
    window.open(`https://wa.me/918218498723?text=${message}`, "_blank")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Have questions about our services or need support? We're here to help! Whether it's about resume reviews,
              career services, or payment issues, reach out to us.
            </p>
          </div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-6 w-6 text-indigo-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <a href="mailto:crackoffcampus63@gmail.com" className="text-indigo-600 hover:text-indigo-500">
                        crackoffcampus63@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="h-6 w-6 text-indigo-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <a href="tel:+918218498723" className="text-indigo-600 hover:text-indigo-500">
                        +91 82184 98723
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">WhatsApp</p>
                      <button onClick={handleWhatsAppClick} className="text-green-600 hover:text-green-500">
                        Chat with us
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
                  <h3 className="text-sm font-medium text-indigo-900 mb-2">Quick Response</h3>
                  <p className="text-sm text-indigo-700">
                    We typically respond to all inquiries within 24 hours. For urgent payment issues, please call us
                    directly or use WhatsApp for faster assistance.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>

                {status.type && (
                  <div
                    className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${status.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                  >
                    {status.type === "success" ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                    <span>{status.message}</span>
                  </div>
                )}

                <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Number *
                      </label>
                      <input
                        type="tel"
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter your contact number"
                      />
                    </div>

                    <div>
                      <label htmlFor="queryType" className="block text-sm font-medium text-gray-700 mb-2">
                        Query Type *
                      </label>
                      <select
                        id="queryType"
                        name="queryType"
                        value={formData.queryType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="enquiry">General Enquiry</option>
                        <option value="payment">Payment Issue</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Query *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 resize-vertical"
                      placeholder="Please describe your query in detail. If it's a payment issue, include your transaction ID and service details."
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 flex items-center justify-center"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleWhatsAppClick}
                      className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500 flex items-center justify-center"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span>WhatsApp Us</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📄</span>
                </div>
                <h4 className="font-medium text-gray-900">Resume Review</h4>
                <p className="text-sm text-gray-600 mt-1">Professional resume analysis and improvement suggestions</p>
              </div>

              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">💼</span>
                </div>
                <h4 className="font-medium text-gray-900">Career Services</h4>
                <p className="text-sm text-gray-600 mt-1">Interview preparation and career guidance</p>
              </div>

              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎯</span>
                </div>
                <h4 className="font-medium text-gray-900">Job Portal</h4>
                <p className="text-sm text-gray-600 mt-1">Access to exclusive off-campus job opportunities</p>
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
