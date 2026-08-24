import React from 'react';
import { Filter } from 'lucide-react';

export default function JobStatsBar({
  totalJobs,
  jobsLoading,
  setMobileFiltersOpen,
  sortBy,
  setSortBy
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs mb-6">
      <div>
        <h3 className="text-base font-semibold text-[#1e293b]">
          Job Search Results
        </h3>
        <p className="text-xs text-gray-500">
          Showing <span className="font-bold text-[#2B2A8C]">{totalJobs}</span> active job listing{totalJobs !== 1 ? 's' : ''}
          {jobsLoading && <span className="ml-2 text-amber-600 font-medium">(Syncing live jobs...)</span>}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Mobile Filter Toggle */}
        <button
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 active:scale-95 transition cursor-pointer"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <Filter className="w-4 h-4 text-gray-500" />
          Filters
        </button>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Sort by:</span>
          <select
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-[#1e293b] focus:outline-none focus:border-[#2B2A8C] transition cursor-pointer"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="salary_desc">Salary: High to Low</option>
            <option value="salary_asc">Salary: Low to High</option>
          </select>
        </div>
      </div>
    </div>
  );
}
