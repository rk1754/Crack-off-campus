import React, { useState } from "react";
import { Check, ChevronDown } from "lucide-react";

const JobFilter = () => {
  const [experienceOpen, setExperienceOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [salaryOpen, setSalaryOpen] = useState(false);
  const [jobTypeOpen, setJobTypeOpen] = useState(false);

  // Filter states
  const [experienceFilter, setExperienceFilter] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState<string[]>([]);
  const [salaryFilter, setSalaryFilter] = useState<string[]>([]);
  const [jobTypeFilter, setJobTypeFilter] = useState<string[]>([]);

  // Toggle filters
  const toggleFilter = (
    filter: string,
    value: string,
    currentState: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (currentState.includes(value)) {
      setter(currentState.filter((item) => item !== value));
    } else {
      setter([...currentState, value]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-5 sticky top-20">
      <h3 className="text-lg font-semibold text-foundit-blue mb-4">
        Filter Jobs
      </h3>

      <div className="border-b pb-3 mb-3">
        <button
          className="flex items-center justify-between w-full text-left"
          onClick={() => setExperienceOpen(!experienceOpen)}
        >
          <span className="font-medium">Experience Level</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              experienceOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>

        {experienceOpen && (
          <div className="mt-2 space-y-1">
            {[
              "Entry Level",
              "Intermediate",
              "Mid-Level",
              "Senior",
              "Director",
              "Executive",
            ].map((exp) => (
              <label
                key={exp}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div
                  className={`w-4 h-4 border rounded ${
                    experienceFilter.includes(exp)
                      ? "bg-foundit-blue border-foundit-blue"
                      : "border-gray-300"
                  }`}
                  onClick={() =>
                    toggleFilter(
                      "experience",
                      exp,
                      experienceFilter,
                      setExperienceFilter
                    )
                  }
                >
                  {experienceFilter.includes(exp) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-sm">{exp}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-b pb-3 mb-3">
        <button
          className="flex items-center justify-between w-full text-left"
          onClick={() => setLocationOpen(!locationOpen)}
        >
          <span className="font-medium">Location</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              locationOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>

        {locationOpen && (
          <div className="mt-2 space-y-1">
            {[
              "Remote",
              "Bangalore",
              "Mumbai",
              "Delhi",
              "Hyderabad",
              "Chennai",
            ].map((loc) => (
              <label
                key={loc}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div
                  className={`w-4 h-4 border rounded ${
                    locationFilter.includes(loc)
                      ? "bg-foundit-blue border-foundit-blue"
                      : "border-gray-300"
                  }`}
                  onClick={() =>
                    toggleFilter(
                      "location",
                      loc,
                      locationFilter,
                      setLocationFilter
                    )
                  }
                >
                  {locationFilter.includes(loc) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-sm">{loc}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="border-b pb-3 mb-3">
        <button
          className="flex items-center justify-between w-full text-left"
          onClick={() => setSalaryOpen(!salaryOpen)}
        >
          <span className="font-medium">Salary Range</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              salaryOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>

        {salaryOpen && (
          <div className="mt-2 space-y-1">
            {[
              "0-3 LPA",
              "3-6 LPA",
              "6-10 LPA",
              "10-15 LPA",
              "15-25 LPA",
              "25+ LPA",
            ].map((salary) => (
              <label
                key={salary}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div
                  className={`w-4 h-4 border rounded ${
                    salaryFilter.includes(salary)
                      ? "bg-foundit-blue border-foundit-blue"
                      : "border-gray-300"
                  }`}
                  onClick={() =>
                    toggleFilter(
                      "salary",
                      salary,
                      salaryFilter,
                      setSalaryFilter
                    )
                  }
                >
                  {salaryFilter.includes(salary) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-sm">{salary}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div>
        <button
          className="flex items-center justify-between w-full text-left"
          onClick={() => setJobTypeOpen(!jobTypeOpen)}
        >
          <span className="font-medium">Job Type</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              jobTypeOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>

        {jobTypeOpen && (
          <div className="mt-2 space-y-1">
            {[
              "Full Time",
              "Part Time",
              "Contract",
              "Internship",
              "Temporary",
            ].map((type) => (
              <label
                key={type}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div
                  className={`w-4 h-4 border rounded ${
                    jobTypeFilter.includes(type)
                      ? "bg-foundit-blue border-foundit-blue"
                      : "border-gray-300"
                  }`}
                  onClick={() =>
                    toggleFilter(
                      "jobType",
                      type,
                      jobTypeFilter,
                      setJobTypeFilter
                    )
                  }
                >
                  {jobTypeFilter.includes(type) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <button className="btn-accent w-full mt-6">Apply Filters</button>
      <button className="w-full mt-2 py-2 text-gray-600 hover:text-foundit-blue text-sm">
        Clear All
      </button>
    </div>
  );
};

export default JobFilter;
