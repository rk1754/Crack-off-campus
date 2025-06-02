"use client";
import Slider from "react-slick";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Keeping the original company data exactly as provided
const companies = [
  { id: 1, name: "Google", logo: "/lovable-uploads/logos/Google.png" },
  { id: 2, name: "Microsoft", logo: "/lovable-uploads/logos/Microsoft.png" },
  { id: 3, name: "Amazon", logo: "/lovable-uploads/logos/Amazon.png" },
  { id: 4, name: "Apple", logo: "/lovable-uploads/logos/Apple.png" },
  { id: 5, name: "Meta", logo: "/lovable-uploads/logos/Meta.png" },
  { id: 6, name: "Netflix", logo: "/lovable-uploads/logos/Netflix.png" },
  { id: 7, name: "Adobe", logo: "/lovable-uploads/logos/Adobe.png" },
  { id: 8, name: "IBM", logo: "/lovable-uploads/logos/Ibm.png" },
  { id: 9, name: "Oracle", logo: "/lovable-uploads/logos/Oracle.png" },
  { id: 10, name: "Salesforce", logo: "/lovable-uploads/logos/salesforce.png" },
  { id: 11, name: "Intel", logo: "/lovable-uploads/logos/Intel.png" },
  { id: 12, name: "Samsung", logo: "/lovable-uploads/logos/Samsung.png" },
  { id: 13, name: "Cisco", logo: "/lovable-uploads/logos/Cisco.png" },
  { id: 14, name: "Spotify", logo: "/lovable-uploads/logos/Spotify.png" },
  { id: 15, name: "Twitter", logo: "/lovable-uploads/logos/Twitter.png" },
  { id: 16, name: "LinkedIn", logo: "/lovable-uploads/logos/Linkedin.png" },
  { id: 17, name: "Tesla", logo: "/lovable-uploads/logos/Tesla.png" },
  { id: 18, name: "PayPal", logo: "/lovable-uploads/logos/Paypal.png" },
  { id: 19, name: "Zoom", logo: "/lovable-uploads/logos/Zoom.png" },
  { id: 20, name: "TCS", logo: "/lovable-uploads/logos/TCS.png" },
  { id: 21, name: "Infosys", logo: "/lovable-uploads/logos/Infosys.png" },
  { id: 22, name: "Wipro", logo: "/lovable-uploads/logos/Wipro.png" },
  { id: 23, name: "HCL", logo: "/lovable-uploads/logos/Hcl.png" },
  { id: 24, name: "Capgemini", logo: "/lovable-uploads/logos/Capgemini.png" },
  { id: 25, name: "Cognizant", logo: "/lovable-uploads/logos/Cogizent.png" },
  { id: 26, name: "Accenture", logo: "/lovable-uploads/logos/Accenture.jpg" },
  { id: 27, name: "Mindtree", logo: "/lovable-uploads/logos/Mindtree.png" },
  { id: 28, name: "Deloitte", logo: "/lovable-uploads/logos/Deloite.png" },
  { id: 29, name: "LTI", logo: "/lovable-uploads/logos/LTI.png" },
  { id: 30, name: "Persistent", logo: "/lovable-uploads/logos/Persistant.png" },
  { id: 31, name: "Zoho", logo: "/lovable-uploads/logos/zoho.png" },
  {
    id: 32,
    name: "Tech Mahindra",
    logo: "/lovable-uploads/logos/TechMahindra.png",
  },
];

interface ArrowProps {
  className?: string;
  onClick?: () => void;
}

const PrevArrow = ({ className, onClick }: ArrowProps) => (
  <div className={`${className} z-10 left-0`} onClick={onClick}>
    <FaArrowLeft className="text-gray-600 hover:text-black text-xl" />
  </div>
);

const NextArrow = ({ className, onClick }: ArrowProps) => (
  <div className={`${className} z-10 right-0`} onClick={onClick}>
    <FaArrowRight className="text-gray-600 hover:text-black text-xl" />
  </div>
);

const CompanyShowcase = () => {
  const settings = {
    dots: false, // Removed dots as requested
    infinite: true,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 2000, // Changed to 2 seconds as requested
    slidesToShow: 1,
    slidesToScroll: 1,
    rows: 2,
    slidesPerRow: 8,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesPerRow: 4,
          rows: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesPerRow: 3, // Improved for better mobile appearance
          rows: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesPerRow: 2, // Changed from 1 to 2 for better mobile appearance
          rows: 2,
        },
      },
    ],
  };

  return (
    <section className="py-8 sm:py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-2">
          Companies Hiring Now
        </h2>
        <p className="text-center text-gray-600 mb-6 sm:mb-8">
          Discover opportunities from leading companies
        </p>
        <div className="overflow-hidden">
          <Slider {...settings}>
            {companies.map((company) => (
              <div key={company.id} className="p-2 sm:p-4">
                <div className="flex items-center justify-center p-3 sm:p-4 border rounded-lg bg-white hover:shadow-md transition-shadow duration-200 h-20 sm:h-28">
                  <img
                    src={company.logo || "/placeholder.svg"}
                    alt={`${company.name} logo`}
                    className="max-h-10 sm:max-h-12 max-w-full object-contain transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default CompanyShowcase;
