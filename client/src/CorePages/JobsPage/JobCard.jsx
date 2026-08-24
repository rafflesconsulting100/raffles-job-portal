import React from 'react';
import {
  Building,
  Bookmark,
  Briefcase,
  IndianRupee,
  MapPin,
  Eye,
  Check,
  Share2,
  Clock,
  GraduationCap
} from 'lucide-react';
import { showSuccess } from '../../Utils/toast';

export default function JobCard({
  job,
  isSelected,
  isSaved,
  isApplied,
  onCardClick,
  onSaveClick,
  onApplyClick
}) {
  const jobId = job._id || job.id;

  // Format relative posted date text
  const getPostedText = () => {
    if (job.postedAgo) return job.postedAgo;
    if (!job.postedDate) return 'Recently';
    const date = new Date(job.postedDate);
    if (isNaN(date.getTime())) return 'Recently';
    const diffMs = Date.now() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1d ago';
    if (diffDays < 30) return `${diffDays}d ago`;
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths}mo ago`;
  };

  const postedText = getPostedText();

  // Share job handler
  const handleShareClick = (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/jobs?jobId=${jobId}`;

    if (navigator.share) {
      navigator.share({
        title: `${job.title} at ${job.company}`,
        text: `Check out this job posting for ${job.title} at ${job.company}!`,
        url: shareUrl
      }).catch((err) => {
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(shareUrl);
          showSuccess(`Job link copied to clipboard!`);
        }
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      showSuccess(`Job link copied to clipboard!`);
    }
  };

  return (
    <div
      onClick={() => onCardClick(job)}
      className={`group border rounded-2xl p-5 sm:p-6 bg-white cursor-pointer transition-all duration-300 relative hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between space-y-4 ${
        isSelected
          ? 'border-[#2B2A8C] ring-2 ring-[#2B2A8C]/15 shadow-md bg-blue-50/20'
          : 'border-gray-200/80 hover:border-blue-300'
      }`}
    >
      {/* Top Section */}
      <div className="space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Company Logo / Gradient Avatar */}
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-linear-to-br ${job.logoBg || 'from-blue-600 via-indigo-600 to-purple-700'} text-white flex items-center justify-center font-extrabold text-base sm:text-lg shadow-md shrink-0 group-hover:scale-105 transition-transform duration-300 border border-slate-100`}>
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-full h-full object-cover bg-white"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : null}
              {(!job.companyLogo) && (
                <span>{job.company ? job.company.substring(0, 2).toUpperCase() : 'JP'}</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="text-base sm:text-lg font-bold text-[#1e293b] group-hover:text-[#2B2A8C] transition-colors leading-tight truncate">
                {job.title}
              </h4>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-xs font-semibold text-gray-500">
                <span className="flex items-center gap-1 truncate text-gray-700 font-bold">
                  <Building className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  {job.company}
                </span>
                {job.category && (
                  <span className="bg-blue-50 text-[#2B2A8C] text-[11px] font-bold px-2.5 py-0.5 rounded-md border border-blue-100 shrink-0">
                    {job.category}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Share & Save Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleShareClick}
              className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:text-[#2B2A8C] hover:bg-gray-50 active:scale-95 transition cursor-pointer"
              title="Share Job Link"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSaveClick(jobId, job.title);
              }}
              className={`p-2 rounded-xl border transition active:scale-95 cursor-pointer ${
                isSaved
                  ? 'bg-amber-50 border-amber-200 text-amber-500 shadow-xs'
                  : 'border-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
              title={isSaved ? "Saved in bookmarks" : "Save Job"}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        {/* Metainfo chips grid */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-gray-600 border-t border-gray-100 pt-3">
          <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
            <Briefcase className="w-3.5 h-3.5 text-[#2B2A8C]" />
            {job.experience}
          </span>
          <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            {job.salary ? job.salary.split(' ')[0] : 'Competitive'}
          </span>
          <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            {job.location ? job.location.split(',')[0] : 'Remote'}
          </span>
          {job.minEducation && (
            <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
              {job.minEducation}
            </span>
          )}
          <span className="flex items-center gap-1 text-slate-400 font-medium sm:ml-auto text-[11px]">
            <Clock className="w-3 h-3 text-slate-400" />
            Posted {postedText}
          </span>
        </div>

        {/* Description snippet */}
        <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 leading-relaxed font-normal">
          {job.description}
        </p>
      </div>

      {/* Footer: Tags & Buttons */}
      <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 min-w-0 max-w-[55%]">
          {job.skills && job.skills.slice(0, 2).map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 bg-slate-100 text-gray-700 rounded-lg text-[10px] sm:text-[11px] font-bold truncate"
            >
              {skill}
            </span>
          ))}
          {job.skills && job.skills.length > 2 && (
            <span className="px-2 py-1 bg-slate-100 text-gray-400 rounded-lg text-[10px] font-bold">
              +{job.skills.length - 2}
            </span>
          )}
        </div>

        {/* Card End Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCardClick(job);
            }}
            className="px-3 py-1.5 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#2B2A8C]" />
            <span className="hidden xs:inline">Details</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onApplyClick(job);
            }}
            disabled={isApplied}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
              isApplied
                ? 'bg-emerald-600 text-white cursor-not-allowed'
                : 'bg-[#2B2A8C] hover:bg-[#1E1D66] text-white shadow-blue-900/10'
            }`}
          >
            {isApplied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Applied
              </>
            ) : (
              'Apply Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
