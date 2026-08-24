import React from 'react';
import { Search, MapPin, Briefcase, X } from 'lucide-react';

export default function TopSearchBanner({
  searchTerm,
  setSearchTerm,
  locationSearch,
  setLocationSearch,
  resetFilters,
  hasActiveFilters
}) {
  const popularLocations = ['All', 'Remote', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6">
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-[#1e293b] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#2B2A8C]" />
              Explore & Filter Jobs
            </h1>
            <p className="text-xs text-gray-500 font-medium">Search by job title, company, skill, or location</p>
          </div>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              Clear Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Keyword Search Input */}
          <div className="md:col-span-6 relative flex items-center">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search job title, company, or skills..."
              className="w-full pl-10 sm:pl-11 pr-9 py-2.5 bg-gray-50/80 border border-gray-200/80 rounded-xl text-xs sm:text-sm font-semibold text-[#1e293b] focus:outline-none focus:border-[#2B2A8C] focus:bg-white transition shadow-2xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location Filter Input */}
          <div className="md:col-span-6 relative flex items-center">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#2B2A8C] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              placeholder="Filter by location (e.g. Bangalore, Remote, Delhi)..."
              className="w-full pl-10 sm:pl-11 pr-9 py-2.5 bg-gray-50/80 border border-gray-200/80 rounded-xl text-xs sm:text-sm font-semibold text-[#1e293b] focus:outline-none focus:border-[#2B2A8C] focus:bg-white transition shadow-2xs"
            />
            {locationSearch && (
              <button
                onClick={() => setLocationSearch('')}
                className="absolute right-3 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                title="Clear location filter"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Location Pills - Horizontal Scroll on Mobile */}
        <div className="flex items-center gap-2 pt-1 border-t border-gray-100 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1 shrink-0 mr-1">
            <MapPin className="w-3.5 h-3.5 text-[#2B2A8C]" />
            Popular:
          </span>
          {popularLocations.map((loc) => {
            const isActive = (loc === 'All' && !locationSearch) || (locationSearch.toLowerCase() === loc.toLowerCase());
            return (
              <button
                key={loc}
                onClick={() => setLocationSearch(loc === 'All' ? '' : loc)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#2B2A8C] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {loc}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
