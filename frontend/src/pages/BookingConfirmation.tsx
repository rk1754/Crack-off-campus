import React from "react";
import Layout from "../components/layout/Layout";
import { CheckCircle } from "lucide-react";

const BookingConfirmation: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 bg-gradient-to-br from-purple-50 to-white">
        <CheckCircle size={64} className="text-green-500 mb-6" />
        <h1 className="text-3xl font-bold text-purple-800 mb-4">Booking Successful!</h1>
        <p className="text-lg text-gray-700 mb-2 text-center max-w-xl">
          You have successfully booked the service. Please check your email for the joining link, which will be shared soon.
        </p>
      </div>
    </Layout>
  );
};

export default BookingConfirmation;
