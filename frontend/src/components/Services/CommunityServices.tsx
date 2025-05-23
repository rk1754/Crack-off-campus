import type React from "react";

interface ServiceCardProps {
  title: string;
  description: string;
  imageUrl: string;
  comingSoon?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  imageUrl,
  comingSoon = true,
}) => {
  return (
    <div className="bg-gray-100 rounded-xl p-6 shadow-md flex flex-col h-full">
      <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-xl font-bold text-Black-700 mb-2">{title}</h3>
      <p className="text-gray-700 mb-4 flex-grow">{description}</p>

      <button className="mt-4 w-full bg-[rgb(150,130,209)] hover:bg-[rgb(160,140,220)] text-white font-medium py-2 px-4 rounded-lg transition-colors">
        Comming Soon
      </button>
    </div>
  );
};

const CommunityServices: React.FC = () => {
  const services = [
    {
      title: "Events",
      description:
        "Connect with our community through exciting events and networking opportunities.",
      imageUrl: "/lovable-uploads/Events.jpg",
    },
    {
      title: "Hackathon & Challenges",
      description:
        "Participate in our coding competitions and problem-solving challenges.",
      imageUrl: "/lovable-uploads/Hackethon and challanges.png",
    },
    {
      title: "Blog",
      description:
        "Stay updated with the latest trends and insights from our community.",
      imageUrl: "/lovable-uploads/Blogs.jpg",
    },
  ];

  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Community
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              imageUrl={service.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityServices;
