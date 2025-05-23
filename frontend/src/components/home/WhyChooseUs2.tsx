import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function WhyChooseUs2() {
  const navigate = useNavigate();

  const resources = [
    {
      title: "Resume Review",
      img: "/lovable-uploads/resume.png",
      color: "bg-blue-100",
    },
    {
      title: "Linkedin Review",
      img: "/lovable-uploads/linkedin.png",
      color: "bg-red-100",
    },
    {
      title: "Get a Refral",
      img: "/lovable-uploads/refral.png",
      color: "bg-emerald-100",
    },
    {
      title: "Mock Interviews",
      img: "/lovable-uploads/interview.png",
      color: "bg-amber-100",
    },
    {
      title: "Career Guidance",
      img: "/lovable-uploads/careerguidance.png",
      color: "bg-indigo-100",
    },
    {
      title: "Find Job and Internship Stategy",
      img: "/lovable-uploads/internshipstategy.png",
      color: "bg-purple-100",
    },
  ];

  const handleExploreServices = () => {
    navigate("/services");
  };

  return (
    <section
      style={{ backgroundColor: "rgb(186, 175, 220)" }}
      className="py-12 px-4 md:px-6 lg:px-8 text-black"
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text on the Left */}
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Connect With Experts
            </h2>
            <p className="text-gray-700">
              Get personalized and right guidance to help you stand out in a
              competitive job market.
            </p>
            <Button
              onClick={handleExploreServices}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white"
            >
              Explore all Services
            </Button>
          </div>

          {/* Cards on the Right */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {resources.map((resource, index) => (
              <Card
                key={index}
                className="bg-gray-100 text-gray-800 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className={`${resource.color} p-4 rounded-full mb-3`}>
                    <img
                      src={resource.img}
                      alt={resource.title}
                      className="h-12 w-12 object-contain"
                    />
                  </div>
                  <h3 className="font-medium text-sm">{resource.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
