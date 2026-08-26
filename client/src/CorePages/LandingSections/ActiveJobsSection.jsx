import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPinIcon,
  BriefcaseIcon,
  ArrowRightIcon,
  SparklesIcon,
  BookmarkIcon,
  ClockIcon,
  IndianRupeeIcon,
  Building2Icon,
  GraduationCapIcon,
  CheckCircle2Icon,IndianRupee
} from 'lucide-react';
import { isJobSaved, saveJobToMemory, removeSavedJobFromMemory } from '../../Utils/memoryStore';
import { showSuccess } from '../../Utils/toast';
import { fetchAllJobs, formatBackendJob } from '../../Service/Operation/jobApi';

export default function ActiveJobsSection() {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // High quality sample job cards for rich visual demonstration
  const staticFallbackJobs = [
  ];

  useEffect(() => {
    // Sync memory saved state
    try {
      const stored = localStorage.getItem('savedJobs');
      setSavedJobs(stored ? JSON.parse(stored) : []);
    } catch (e) {
      setSavedJobs([]);
    }

    // Fetch jobs from backend API
    const loadJobs = async () => {
      try {
        const res = await fetchAllJobs();
        if (res.success && Array.isArray(res.jobs) && res.jobs.length > 0) {
          const formattedBackendJobs = res.jobs.map(formatBackendJob);
          const combined = [...formattedBackendJobs, ...staticFallbackJobs];
          const uniqueJobs = combined.filter((job, index, self) =>
            index === self.findIndex((j) => (j.id || j._id) === (job.id || job._id))
          );
          setActiveJobs(uniqueJobs.slice(0, 6));
        } else {
          setActiveJobs(staticFallbackJobs);
        }
      } catch (err) {
        console.error("Failed to load backend jobs for ActiveJobsSection:", err);
        setActiveJobs(staticFallbackJobs);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const toggleBookmark = (e, jobId, jobTitle) => {
    e.stopPropagation();
    if (savedJobs.includes(jobId)) {
      removeSavedJobFromMemory(jobId);
      const updated = savedJobs.filter(id => id !== jobId);
      setSavedJobs(updated);
      showSuccess(`Removed "${jobTitle}" from bookmarks`);
    } else {
      saveJobToMemory(jobId);
      setSavedJobs([...savedJobs, jobId]);
      showSuccess(`Saved "${jobTitle}" to bookmarks!`);
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-20 lg:py-24 relative">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-[#2B2A8C] px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-3">
            <SparklesIcon className="w-3.5 h-3.5 text-[#2B2A8C]" />
            Featured Roles
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Active Job Opportunities
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
            Explore verified openings from top companies actively hiring Business & Management, finance, and growth talent.
          </p>
        </div>

        <button
          onClick={() => navigate('/jobs')}
          className="group inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#2B2A8C] bg-white hover:bg-blue-50/80 border border-slate-200 hover:border-blue-200 px-6 py-3.5 rounded-2xl transition-all duration-300 shadow-2xs hover:shadow-md cursor-pointer"
        >
          Explore All Jobs
          <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      {/* Modern 3-Column Job Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3].map((skeleton) => (
            <div key={skeleton} className="bg-white rounded-3xl p-6 border border-slate-100 animate-pulse space-y-4 shadow-xs">
              <div className="h-12 bg-slate-100 rounded-2xl w-2/3" />
              <div className="h-6 bg-slate-100 rounded-lg w-full" />
              <div className="h-16 bg-slate-100 rounded-xl w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {activeJobs.map((job) => {
            const jobId = job.id || job._id;
            const isSaved = savedJobs.includes(jobId);

            return (
              <div
                key={jobId}
                onClick={() => navigate(`/jobs?jobId=${jobId}`)}
                className="group relative bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:-translate-y-1.5"
              >
                <div className="space-y-4">
                  {/* Company Header Row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Logo avatar with image fallback */}
                      <div
                        className={`w-13 h-13 rounded-2xl overflow-hidden bg-linear-to-br ${job.logoBg || "from-blue-600 to-indigo-700"} text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0 group-hover:scale-105 transition-transform border border-slate-100`}
                      >
                        {job.companyLogo ? (
                          <img
                            src={job.companyLogo}
                            alt={job.company}
                            className="w-full h-full object-cover bg-white"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : null}
                        {!job.companyLogo && (
                          <span>
                            {job.company
                              ? job.company.substring(0, 2).toUpperCase()
                              : "JP"}
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Building2Icon className="w-3.5 h-3.5 text-slate-400" />
                          {job.company}
                        </h4>
                        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mt-0.5">
                          <ClockIcon className="w-3 h-3 text-slate-300" />
                          {job.postedAgo || "Active Now"}
                        </span>
                      </div>
                    </div>

                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => toggleBookmark(e, jobId, job.title)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        isSaved
                          ? "bg-amber-50 border-amber-200 text-amber-500 shadow-xs"
                          : "border-slate-200/70 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                      }`}
                      title={isSaved ? "Remove Bookmark" : "Save Job"}
                    >
                      <BookmarkIcon
                        className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
                      />
                    </button>
                  </div>

                  {/* Title & Category Badge */}
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#2B2A8C] transition-colors leading-snug">
                      {job.title}
                    </h3>

                    {job.category && (
                      <span className="inline-block mt-2 px-2.5 py-0.5 bg-blue-50 text-[#2B2A8C] border border-blue-100 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
                        {job.category}
                      </span>
                    )}
                  </div>

                  {/* Location & Work Mode Chips */}
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600 border-t border-slate-100 pt-3">
                    <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      <MapPinIcon className="w-3.5 h-3.5 text-slate-400" />
                      {job.location ? job.location.split(",")[0] : "Remote"}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                      <BriefcaseIcon className="w-3.5 h-3.5 text-slate-400" />
                      {job.experience || job.experienceLevel}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] ${job.badgeColor || "bg-slate-50 text-slate-700 border-slate-200"}`}
                    >
                      {job.workMode || job.jobType}
                    </span>
                  </div>

                  {/* Skill Badges */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-0.5 bg-slate-100/90 text-slate-700 rounded-md text-[10px] font-bold border border-slate-200/60"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded-md text-[10px] font-bold">
                          +{job.skills.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer: Salary & Action CTA */}
                <div className="border-t border-slate-100 pt-4 mt-6 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Salary range
                    </span>
                    <div className="flex items-center gap-1 text-slate-700 font-semibold">
                      <IndianRupee className="w-4 h-4 text-slate-700" />
                      <span>{job.salary}</span>
                    </div>
                  </div>

                  {/* <span className="text-xs font-bold text-[#2B2A8C] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Apply Now <ArrowRightIcon className="w-4 h-4" />
                  </span> */}
                  <button
                    type="button"
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    className="
    inline-flex items-center justify-center gap-1.5
    px-4 py-2
    rounded-xl
    text-base 
    text-white
    border border-
    bg-[#2B2A8C]
    hover:bg-[#1E1D66]
    hover:text-white
    hover:border-[#2B2A8C]
    shadow-sm hover:shadow-md
    transition-all duration-200
    cursor-pointer
  "
                  >
                    Apply Now
                    <ArrowRightIcon className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
