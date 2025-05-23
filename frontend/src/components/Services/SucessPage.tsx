"use client"

import { useParams, useNavigate, useLocation } from "react-router-dom"
import { CheckCircle, Calendar } from "lucide-react"
import Navbar from "../layout/Navbar"
import Footer from "../layout/Footer"
import {Button} from "../../components/ui/button"
import { useEffect, useState } from "react"
import axios from "axios"

interface Session {
  id: string;
  title: string;
  time: string;
}

export default function SuccessPage() {
  const navigate = useNavigate()
  const { serviceId } = useParams<{ serviceId: string }>()

  const location = useLocation()
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    // Try to get session from location state, else fetch from backend
    if (location.state && location.state.session) {
      setSession(location.state.session)
    } else if (serviceId) {
      axios.get(`/api/session/getById/${serviceId}`).then(res => {
        setSession(res.data.slot)
      })
    }
  }, [serviceId, location.state])

  const handleGoToHome = () => {
    navigate("/")
  }

  const handleViewBooking = () => {
    navigate("/dashboard/bookings")
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-md text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-6">
            {session
              ? `Your booking for ${session.title} has been successfully confirmed.`
              : "Your booking has been successfully confirmed."}
          </p>

          <div className="bg-gray-100 rounded-lg p-6 mb-8 max-w-md mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="h-5 w-5 mr-2 text-[rgb(150,130,209)]" />
              <span className="font-medium">
                {session
                  ? new Date(session.time).toLocaleString()
                  : "Slot details will be sent to your email"}
              </span>
            </div>

            <p className="text-sm text-gray-600">
              We've sent a confirmation email with all the details to your registered email address.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleViewBooking}
              variant="outline"
              className="border-[rgb(150,130,209)] text-[rgb(150,130,209)] hover:bg-[rgb(150,130,209)] hover:text-white"
            >
              View My Booking
            </Button>

            <Button onClick={handleGoToHome} className="bg-[rgb(150,130,209)] hover:bg-[rgb(160,140,220)] text-white">
              Return to Home
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
