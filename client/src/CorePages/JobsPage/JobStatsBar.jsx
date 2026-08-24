import React from 'react';
import { Filter, LayoutGrid, List, SlidersHorizontal } from 'lucide-react';

export default function JobStatsBar({
  totalJobs,
  jobsLoading,
  setMobileFiltersOpen,
  sortBy,
  setSortBy,
  viewMode = 'grid',
  setViewMode
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm mb-6">
      <div className="flex items-center justify-between sm:justify-start gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#1e293b] tracking-tight">
            Job Openings
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Showing <span className="font-extrabold text-[#2B2A8C]">{totalJobs}</span> matching job{totalJobs !== 1 ? 's' : ''}
            {jobsLoading && (
              <span className="ml-2 text-amber-600 font-semibold animate-pulse">
                (Syncing live jobs...)
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap sm:flex-nowrap pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
        {/* Mobile Filter Toggle */}
        <button
          className="lg:hidden flex items-center gap-2 px-3.5 py-2 border border-gray-200 bg-gray-50/80 hover:bg-gray-100 rounded-xl text-xs font-bold text-[#1e293b] active:scale-95 transition cursor-pointer"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#2B2A8C]" />
          Filters
        </button>

        {/* View Mode Switcher (Grid vs List) */}
        {setViewMode && (
          <div className="hidden sm:flex items-center bg-gray-100/80 p-1 rounded-xl border border-gray-200/60">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-[#2B2A8C] shadow-xs font-bold'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
              title="Grid View (2 Columns)"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-[#2B2A8C] shadow-xs font-bold'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
              title="List View (Full Width)"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap hidden sm:inline">
            Sort by:
          </span>
          <select
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-[#1e293b] focus:outline-none focus:border-[#2B2A8C] focus:bg-white transition cursor-pointer"
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
