// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft, Star } from "lucide-react";
// import Navbar from "../layout/Navbar";
// import Footer from "../layout/Footer";
// import { Button } from "../ui/button";

// interface ServiceDetails {
//   id: number;
//   title: string;
//   duration: string;
//   amount: number;
//   description: string;
//   includes: string[];
//   companies?: string[];
// }

// export default function ServiceDetailPage() {
//   const navigate = useNavigate();
//   const { serviceId } = useParams<{ serviceId: string }>();
//   const [service, setService] = useState<ServiceDetails | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // In a real app, fetch this data from an API
//     const id = Number.parseInt(serviceId || "0");

//     // Mock data based on service ID
//     const serviceData: Record<number, ServiceDetails> = {
//       1: {
//         id: 1,
//         title: "Resume / CV Review",
//         duration: "45 Mins",
//         amount: 199,
//         description: "Let's Switch for good company with good package offer!",
//         includes: [
//           "We work on your profile/resume to make it as per industry standard.",
//           "Once your profiling in done, we target few companies for referral and will build specific profile for that company.",
//           "Now, we'll proceed from the referral generation.",
//         ],
//         companies: ["Google", "Microsoft", "PayPal"],
//       },
//       2: {
//         id: 2,
//         title: "LinkedIn Review",
//         duration: "45 Mins",
//         amount: 199,
//         description: "Turn views into interviews with a standout profile.",
//         includes: [
//           "We optimize your LinkedIn profile to attract recruiters.",
//           "We'll help you build a network that matters for your career.",
//           "Learn how to engage with content to increase visibility.",
//         ],
//         companies: ["LinkedIn", "Adobe", "Salesforce"],
//       },
//       3: {
//         id: 3,
//         title: "Get a Referral",
//         duration: "45 Mins",
//         amount: 199,
//         description: "Land interviews faster with a real referral.",
//         includes: [
//           "We connect you with our network of hiring partners.",
//           "We prepare your profile specifically for target companies.",
//           "We guide you through the entire referral process.",
//         ],
//         companies: ["Amazon", "Meta", "Netflix"],
//       },
//       4: {
//         id: 4,
//         title: "Career Guidance",
//         duration: "45 Mins",
//         amount: 199,
//         description: "Align your goals with the right opportunities.",
//         includes: [
//           "We analyze your skills and career aspirations.",
//           "We provide a roadmap for your career growth.",
//           "We suggest skills to develop for your target roles.",
//         ],
//       },
//       5: {
//         id: 5,
//         title: "Quick Chat",
//         duration: "15 Mins",
//         amount: 19,
//         description: "One chat could change your placement game.",
//         includes: [
//           "Quick answers to your most pressing career questions.",
//           "Immediate feedback on your current approach.",
//           "Tips to improve your job search strategy.",
//         ],
//       },
//       6: {
//         id: 6,
//         title: "Find Job & Internship Strategy",
//         duration: "1 Hour",
//         amount: 299,
//         description: "Learn how to search — the smart way.",
//         includes: [
//           "We teach you effective job search techniques.",
//           "We help you identify the right platforms for your field.",
//           "We show you how to track and follow up on applications.",
//         ],
//       },
//       7: {
//         id: 7,
//         title: "Get Hired on LinkedIn",
//         duration: "45 Mins",
//         amount: 199,
//         description: "Master LinkedIn job hunting like a pro.",
//         includes: [
//           "Learn how to use LinkedIn's job search features effectively.",
//           "Understand how to engage with recruiters.",
//           "Discover how to leverage your network for job opportunities.",
//         ],
//       },
//     };

//     if (serviceData[id]) {
//       setService(serviceData[id]);
//     }
//     setLoading(false);
//   }, [serviceId]);

//   const handleGoBack = () => {
//     navigate("/services");
//   };

//   const handleBookNow = () => {
//     navigate(`/services/${serviceId}/booking`);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   if (!service) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Service not found
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900">
//       <Navbar />

//       <div className="max-w-4xl mx-auto px-6 py-12">
//         <button
//           onClick={handleGoBack}
//           className="flex items-center text-gray-500 hover:text-gray-900 mb-6"
//         >
//           <ArrowLeft className="h-4 w-4 mr-2" />
//           Go Back
//         </button>

//         <div className="flex items-center justify-between mb-8">
//           <h1 className="text-3xl font-bold">{service.title}</h1>
//           <div className="flex items-center">
//             <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
//             <span className="font-medium">4.7</span>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
//           <div className="md:col-span-2 space-y-6">
//             <div>
//               <h2 className="text-xl font-semibold mb-3">More Details</h2>
//               <p className="text-gray-600">{service.description}</p>
//             </div>

//             <div>
//               <h2 className="text-xl font-semibold mb-3">
//                 What this booking will include:
//               </h2>
//               <ol className="list-decimal pl-5 space-y-2">
//                 {service.includes.map((item, index) => (
//                   <li key={index}>{item}</li>
//                 ))}
//               </ol>
//             </div>

//             {service.companies && (
//               <div>
//                 <h2 className="text-xl font-semibold mb-3">
//                   We've Available Referrals from 250+ companies:
//                 </h2>
//                 <ol className="list-decimal pl-5 space-y-2">
//                   {service.companies.map((company, index) => (
//                     <li key={index}>{company}</li>
//                   ))}
//                 </ol>
//               </div>
//             )}
//           </div>

//           <div>
//             <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
//               <div className="space-y-4">
//                 <div>
//                   <p className="text-sm text-gray-500">Meeting Duration</p>
//                   <p className="font-semibold text-lg">{service.duration}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Amount</p>
//                   <div className="flex items-center gap-2">
//                     <span className="line-through text-gray-500 text-sm">
//                       ₹{service.amount + 100}
//                     </span>
//                     <span className="text-2xl font-bold">
//                       ₹{service.amount}
//                     </span>
//                   </div>
//                 </div>
//                 <Button
//                   onClick={handleBookNow}
//                   className="w-full bg-[rgb(150,130,209)] hover:bg-[rgb(160,140,220)] text-white"
//                 >
//                   Book Now
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }
