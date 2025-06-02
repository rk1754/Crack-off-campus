import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface SearchBarProps {
  onSearch: (keyword: string, location: string) => void;
  initialKeyword?: string;
  initialLocation?: string;
}

const SearchBar = ({
  onSearch,
  initialKeyword = "",
  initialLocation = "",
}: SearchBarProps) => {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [location, setLocation] = useState(initialLocation);
  const isMobile = useMediaQuery("(max-width: 640px)");

  useEffect(() => {
    setKeyword(initialKeyword);
  }, [initialKeyword]);

  useEffect(() => {
    setLocation(initialLocation);
  }, [initialLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(keyword, location);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 p-3 bg-white rounded-lg shadow-lg border border-gray-200"
    >
      <div className="flex-1 relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder={
            isMobile ? "Job title or keyword" : "Job title, keyword, or company"
          }
          className="w-full p-2 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9b87f5]"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div className="flex-1 relative">
        <Search // Using Search icon for consistency, consider MapPin if preferred
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder={isMobile ? "Location" : "City, state, or remote"}
          className="w-full p-2 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9b87f5]"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="bg-[#9b87f5] hover:bg-[#8a74e8] text-white px-6 py-2 rounded-md font-semibold transition-colors w-full sm:w-auto"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
