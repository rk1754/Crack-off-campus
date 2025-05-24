import { Link } from "react-router-dom";
import { Calendar, MapPin, Lock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  ctc_stipend?: string;
  postedDate: string;
  jobType: string;
  jobUrl: string;
  jobSubscriptionType: string;
  userSubscriptionType?: string;
  onUnlockJob: () => void;
  passout_year?: string;
  experience?: "fresher" | "experienced";
  skills?: string[];
}

const subscriptionTiers: { [key: string]: number } = {
  regular: 0,
  gold: 1,
  gold_plus: 2,
  diamond: 3,
};

const JobCard = ({
  id,
  title,
  company,
  location,
  ctc_stipend,
  postedDate,
  jobType,
  jobUrl,
  jobSubscriptionType,
  userSubscriptionType,
  onUnlockJob,
  passout_year,
  experience,
  skills,
}: JobCardProps) => {
  console.log(`Job ${title} subscription type: ${jobSubscriptionType}`);
  const checkAccess = () => {
  if (jobSubscriptionType === "regular") {
    
    return true;
  } else {
    
    return (
      userSubscriptionType === "booster" ||
      userSubscriptionType === "job" ||
      userSubscriptionType === "standard" ||
      userSubscriptionType === "basic" ||
      userSubscriptionType === "premium"
    );
  }
};
  const getJobPremiumStatus = () => {
    if (jobSubscriptionType !== "regular") {
      return true;
    } else {
      return false;
    }
  };
 
  
  const canAccess = checkAccess();
  const isPremiumJob = getJobPremiumStatus();
  console.log("canAccess", canAccess);

  return (
    <div className="job-card relative border p-4 rounded-lg shadow-sm bg-white">
      {isPremiumJob && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-gray-800 px-3 py-1 rounded-bl-lg rounded-tr-lg font-medium text-xs flex items-center">
          <Crown size={14} className="mr-1" />
          Premium Job
        </div>
      )}

      <div>
        <div className="flex items-start">
          <div className="flex-grow">
            <Link
              to={canAccess ? `/jobs/${id}` : "#"}
              className={`${!canAccess ? "pointer-events-none" : ""}`}
            >
              <h3 className="text-lg font-medium text-foundit-blue hover:text-foundit-blue-light transition-colors">
                {title}
              </h3>
            </Link>
            <p className="text-gray-600 mb-1">{company}</p>

            <div className="flex flex-wrap items-center text-sm text-gray-500 mt-2 mb-3">
              <div className="flex items-center mr-4">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>{postedDate}</span>
              </div>
              {experience && (
                <div className="flex items-center mr-3 mb-1 sm:mb-0">
                  <span className="capitalize">{experience}</span>
                </div>
              )}
              {passout_year && (
                <div className="flex items-center mb-1 sm:mb-0">
                  <span>Batch: {passout_year}</span>
                </div>
              )}
            </div>

            {!canAccess && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mb-3">
                <p className="text-sm font-medium text-gray-700 flex items-center">
                  <Lock size={16} className="text-yellow-500 mr-2" />
                  This premium job is only available for premium members
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Upgrade your subscription to access this job.
                </p>
                <Button
                  onClick={onUnlockJob}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 h-auto mt-2"
                  size="sm"
                >
                  Upgrade to Premium
                </Button>
              </div>
            )}

            <div className="flex items-center justify-between mt-3">
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-foundit-blue rounded-full">
                  {jobType}
                </span>
                {ctc_stipend && (
                  <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                    {ctc_stipend}
                  </span>
                )}
              </div>
              {canAccess ? (
                <a
                  href={jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm text-foundit-orange hover:text-orange-700 font-medium flex items-center ${
                    !jobUrl ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  {isPremiumJob && <Crown size={14} className="mr-1" />}
                  Apply Now
                </a>
              ) : (
                <Button
                  size="sm"
                  onClick={onUnlockJob}
                  className="text-xs px-3 py-1 h-auto flex items-center"
                >
                  {/* <Crown size={14} className="mr-1" /> */}
                  Apply Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
