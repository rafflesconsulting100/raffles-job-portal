import React from 'react';
import { Filter, MapPin, X } from 'lucide-react';
import { filterOptions } from '../../data/mockdata';

export default function MobileFilterDrawer({
  isOpen,
  setIsOpen,
  locationSearch,
  setLocationSearch,
  availableLocations,
  allJobsCount,
  selectedCategory,
  setSelectedCategory,
  selectedExperience,
  setSelectedExperience,
  selectedWorkModes,
  handleWorkModeChange,
  selectedJobTypes,
  handleJobTypeChange,
  maxSalary,
  setMaxSalary,
  selectedDatePosted,
  setSelectedDatePosted,
  resetFilters
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden" role="dialog" aria-modal="true">
      <div className="absolute inset-0 overflow-hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-gray-500/75 transition-opacity"
          onClick={() => setIsOpen(false)}
        />

        {/* Panel wrapper */}
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-xs transform transition duration-500 ease-in-out">
            <div className="flex h-full flex-col overflow-y-auto bg-white p-6 shadow-2xl space-y-6">

              {/* Close header */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-base font-bold text-[#1e293b] flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#2B2A8C]" />
                  Filters
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Location Filter */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2B2A8C]" />
                  Location Filter
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Enter city or location..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-sm text-[#1e293b] focus:outline-none focus:border-[#2B2A8C] transition"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                  />
                  {locationSearch && (
                    <button
                      onClick={() => setLocationSearch('')}
                      className="absolute right-2.5 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                {availableLocations.length > 0 && (
                  <select
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-[#1e293b] focus:outline-none focus:border-[#2B2A8C] transition cursor-pointer"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                  >
                    <option value="">All Locations ({allJobsCount})</option>
                    {availableLocations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Category Selection */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Category</label>
                <select
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#1e293b] focus:outline-none cursor-pointer"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {filterOptions.categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Experience Selector */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Experience Level</label>
                <select
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-[#1e293b] focus:outline-none cursor-pointer"
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                >
                  {filterOptions.experienceLevels.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl === 'All' ? 'All Experience Levels' : lvl}</option>
                  ))}
                </select>
              </div>

              {/* Work Modes */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Work Mode</label>
                <div className="space-y-2">
                  {filterOptions.workModes.filter(m => m !== 'All').map((mode) => (
                    <label key={mode} className="flex items-center text-sm font-semibold text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#2B2A8C] focus:ring-[#2B2A8C] mr-2.5 w-4 h-4 cursor-pointer"
                        checked={selectedWorkModes.includes(mode)}
                        onChange={() => handleWorkModeChange(mode)}
                      />
                      {mode}
                    </label>
                  ))}
                </div>
              </div>

              {/* Job Types */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Job Type</label>
                <div className="space-y-2">
                  {filterOptions.jobTypes.filter(t => t !== 'All').map((type) => (
                    <label key={type} className="flex items-center text-sm font-semibold text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-[#2B2A8C] focus:ring-[#2B2A8C] mr-2.5 w-4 h-4 cursor-pointer"
                        checked={selectedJobTypes.includes(type)}
                        onChange={() => handleJobTypeChange(type)}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Max Slider */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Max Salary</label>
                  <span className="text-xs font-bold text-[#2B2A8C]">
                    ₹{(maxSalary / 100000).toFixed(1)}L PA
                  </span>
                </div>
                <input
                  type="range"
                  min="400000"
                  max="3500000"
                  step="100000"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(Number(e.target.value))}
                  className="w-full accent-[#2B2A8C] cursor-pointer"
                />
              </div>

              {/* Date Posted selection */}
              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Date Posted</label>
                <div className="space-y-2">
                  {filterOptions.datePosted.map((opt) => (
                    <label key={opt.value} className="flex items-center text-sm font-semibold text-gray-600 cursor-pointer">
                      <input
                        type="radio"
                        name="mobileDatePosted"
                        className="text-[#2B2A8C] focus:ring-[#2B2A8C] mr-2.5 w-4 h-4 cursor-pointer"
                        checked={selectedDatePosted === opt.value}
                        onChange={() => setSelectedDatePosted(opt.value)}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Bottom Reset Actions */}
              <div className="pt-6 flex gap-4 border-t border-gray-100 mt-auto">
                <button
                  onClick={() => {
                    resetFilters();
                    setIsOpen(false);
                  }}
                  className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-[#1e293b] text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2.5 bg-[#2B2A8C] hover:bg-[#1E1D66] text-white text-xs font-bold rounded-xl transition shadow-md cursor-pointer"
                >
                  Apply
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
