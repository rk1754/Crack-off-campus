import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  id: string;
  title: string;
  count: number;
  icon: string;
  color: string;
}

const categories: Category[] = [
  {
    id: "tech",
    title: "Technology",
    count: 1482,
    icon: "/placeholder.svg?height=64&width=64",
    color: "bg-blue-500",
  },
  {
    id: "marketing",
    title: "Marketing",
    count: 872,
    icon: "/placeholder.svg?height=64&width=64",
    color: "bg-green-500",
  },
  {
    id: "finance",
    title: "Finance",
    count: 645,
    icon: "/placeholder.svg?height=64&width=64",
    color: "bg-purple-500",
  },
  {
    id: "healthcare",
    title: "Healthcare",
    count: 753,
    icon: "/placeholder.svg?height=64&width=64",
    color: "bg-red-500",
  },
  {
    id: "education",
    title: "Education",
    count: 428,
    icon: "/placeholder.svg?height=64&width=64",
    color: "bg-yellow-500",
  },
  {
    id: "design",
    title: "Design",
    count: 539,
    icon: "/placeholder.svg?height=64&width=64",
    color: "bg-pink-500",
  },
  {
    id: "sales",
    title: "Sales",
    count: 621,
    icon: "/placeholder.svg?height=64&width=64",
    color: "bg-indigo-500",
  },
  {
    id: "admin",
    title: "Admin & Support",
    count: 382,
    icon: "/placeholder.svg?height=64&width=64",
    color: "bg-orange-500",
  },
];

const FeaturedCategories = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scrollAmount = 300;

  useEffect(() => {
    const checkScroll = () => {
      if (!sliderRef.current) return;

      setShowLeftArrow(sliderRef.current.scrollLeft > 0);

      const isAtEnd =
        sliderRef.current.scrollLeft + sliderRef.current.clientWidth >=
        sliderRef.current.scrollWidth - 10;

      setShowRightArrow(!isAtEnd);
    };

    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", checkScroll);
      checkScroll();
      setShowRightArrow(slider.scrollWidth > slider.clientWidth);
    }

    return () => {
      if (slider) {
        slider.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-12 bg-gray-50 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Popular Categories
        </h2>

        <div className="relative">
          {showLeftArrow && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
          )}

          <div
            ref={sliderRef}
            className="flex overflow-x-auto pb-5 scrollbar-hide snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex-none w-[250px] mx-2 snap-start first:ml-0 last:mr-0"
              >
                <Link
                  to={`/jobs/category/${category.id}`}
                  className="group border border-gray-200 bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden transform hover:scale-105 h-full"
                >
                  <div
                    className={`absolute bottom-0 left-0 w-full h-1 ${category.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                  ></div>
                  <img
                    src={category.icon || "/placeholder.svg"}
                    alt={category.title}
                    className="w-16 h-16 mb-3 object-contain"
                  />
                  <h3 className="text-lg font-medium text-gray-800">
                    {category.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {category.count} jobs available
                  </p>
                </Link>
              </div>
            ))}
          </div>

          {showRightArrow && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors duration-200"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          )}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/jobs/categories"
            className="inline-block px-6 py-3 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-300"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
