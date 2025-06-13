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
      // Hide premium warning only for basic, standard, booster, and job subscription types
      // Show premium warning for all other subscription types (including other_template)
      return (
        userSubscriptionType === "booster" ||
        userSubscriptionType === "job" ||
        userSubscriptionType === "standard" ||
        userSubscriptionType === "basic"
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

  const isPremiumJob = jobSubscriptionType !== "regular";

  const canAccess = checkAccess();
  console.log("canAccess", canAccess);

  // Helper to ensure protocol
  const getSafeUrl = (url: string) => {
    if (!url) return "#";
    if (/^https?:\/\//i.test(url)) return url;
    return "https://" + url.replace(/^\/+/, "");
  };

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
            {isPremiumJob ? (
              <Link to={`/jobs/${id}`} className="job-title-class">
                <h3 className="text-lg font-medium text-foundit-blue hover:text-foundit-blue-light transition-colors">
                  {title}
                </h3>
              </Link>
            ) : (
              <a
                href={getSafeUrl(jobUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="job-title-class"
              >
                <h3 className="text-lg font-medium text-foundit-blue hover:text-foundit-blue-light transition-colors">
                  {title}
                </h3>
              </a>
            )}
            <p className="text-gray-600 mb-1">{company}</p>

            <div className="flex flex-wrap items-center text-sm text-gray-500 mt-2 mb-3 gap-6">
              {location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{location}</span>
                </div>
              )}
              {postedDate && (
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{postedDate}</span>
                </div>
              )}
              {experience && <span className="capitalize">{experience}</span>}
              {passout_year && <span>Batch: {passout_year}</span>}
            </div>

            {!canAccess && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mb-3">
                <p className="text-sm font-medium text-gray-700 flex items-center">
                  <Lock size={16} className="text-yellow-500 mr-2" />
                  This premium job can be applied for either through referral or
                  via sending your resume directly to the recruiter email.
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
              </div>{" "}
              {canAccess ? (
                isPremiumJob ? (
                  <Link
                    to={`/jobs/${id}`}
                    className="text-sm text-foundit-orange hover:text-orange-700 font-medium flex items-center"
                  >
                    <Crown size={14} className="mr-1" />
                    Apply Now
                  </Link>
                ) : (
                  <a
                    href={getSafeUrl(jobUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foundit-orange hover:text-orange-700 font-medium flex items-center"
                  >
                    Apply Now
                  </a>
                )
              ) : isPremiumJob ? (
                <Button
                  size="sm"
                  onClick={onUnlockJob}
                  className="text-xs px-3 py-1 h-auto flex items-center bg-foundit-orange hover:bg-orange-600 text-white"
                >
                  <Crown size={14} className="mr-1" />
                  Apply Now
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={onUnlockJob}
                  className="text-xs px-3 py-1 h-auto flex items-center"
                >
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
