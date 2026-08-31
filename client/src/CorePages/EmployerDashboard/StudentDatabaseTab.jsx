import React, { useState, useMemo } from "react";
import { Search, MapPin, RefreshCw, Users, FileText, CheckCircle2 } from "lucide-react";

export default function StudentDatabaseTab({
  students,
  studentsLoading,
  studentStats
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [appliedFilter, setAppliedFilter] = useState("all");

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    return students.filter(student => {
      const matchesSearch = 
        student.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        student.email?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const loc = student.location || "Not Specified";
      const matchesLocation = locationFilter === "all" || loc === locationFilter;
      
      const matchesApplied = 
        appliedFilter === "all" || 
        (appliedFilter === "applied" && student.hasAppliedToMe) ||
        (appliedFilter === "not_applied" && !student.hasAppliedToMe);

      return matchesSearch && matchesLocation && matchesApplied;
    });
  }, [students, searchTerm, locationFilter, appliedFilter]);

  const uniqueLocations = useMemo(() => {
    return Object.keys(studentStats?.locationCounts || {}).sort();
  }, [studentStats]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">Total Candidates</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{studentStats?.total || 0}</p>
        </div>
        <div className="bg-white border border-emerald-200/80 rounded-2xl p-5 shadow-xs">
          <p className="text-[11px] font-bold text-emerald-600 uppercase">Applied to Your Jobs</p>
          <p className="text-3xl font-black text-emerald-700 mt-1">{studentStats?.appliedToYou || 0}</p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">Not Applied Yet</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{studentStats?.notApplied || 0}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-4 flex-1">
          {/* Search */}
          <div className="w-full sm:w-64">
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Search Candidate
            </label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 h-11 focus-within:border-[#2B2A8C] focus-within:bg-white">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Location Filter */}
          <div className="w-full sm:w-48">
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Location
            </label>
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 h-11 focus-within:border-[#2B2A8C] focus-within:bg-white">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mr-2" />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-900 outline-none"
              >
                <option value="all">All Locations</option>
                {uniqueLocations.map(loc => (
                  <option key={loc} value={loc}>{loc} ({studentStats.locationCounts[loc]})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Applied Status Filter */}
          <div className="w-full sm:w-48">
            <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
              Application Status
            </label>
            <select
              value={appliedFilter}
              onChange={(e) => setAppliedFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl px-3 h-11 outline-none focus:border-[#2B2A8C] focus:bg-white"
            >
              <option value="all">All Candidates</option>
              <option value="applied">Applied to My Jobs</option>
              <option value="not_applied">Not Applied</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium self-end md:self-center">
          Showing: <strong className="text-slate-900">{filteredStudents.length}</strong> candidates
        </div>
      </div>

      {/* Database List */}
      {studentsLoading ? (
        <div className="text-center py-16">
          <RefreshCw className="w-8 h-8 text-[#2B2A8C] animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Fetching student database...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center shadow-xs">
          <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No Candidates Found</h3>
          <p className="text-slate-500 text-xs mt-1">
            Try adjusting your search or filters to find candidates.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredStudents.map((student) => (
            <div
              key={student._id}
              className="bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-6 transition shadow-xs hover:shadow-md flex flex-col md:flex-row justify-between gap-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2B2A8C] to-indigo-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                  {(student.username || "C").charAt(0).toUpperCase()}
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="text-lg font-bold text-slate-900">
                      {student.username || "Anonymous Candidate"}
                    </h4>
                    {student.hasAppliedToMe && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Applied to You
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-0.5">
                    <span>📧 {student.email}</span>
                    {student.contactNumber && <span>📞 {student.contactNumber}</span>}
                    <span>📍 {student.location || "Location not specified"}</span>
                  </div>

                  {/* Education & Experience Highlights */}
                  {(student.education?.length > 0 || student.experience?.length > 0) && (
                    <div className="text-xs text-slate-600 mt-2">
                      {student.education?.length > 0 && (
                        <p>🎓 <span className="font-semibold">{student.education[0].degree}</span> at {student.education[0].institution}</p>
                      )}
                      {student.experience?.length > 0 && (
                        <p className="mt-0.5">💼 <span className="font-semibold">{student.experience[0].title}</span> at {student.experience[0].company}</p>
                      )}
                    </div>
                  )}

                  {student.skills && student.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {student.skills.slice(0, 6).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {student.skills.length > 6 && (
                        <span className="text-[10px] text-slate-500 px-1 py-0.5">+{student.skills.length - 6} more</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-start self-start md:self-center shrink-0 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0 mt-2 md:mt-0">
                {student.resume && (
                  <a
                    href={student.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2B2A8C] text-xs font-bold border border-blue-100 transition flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" /> View Resume
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
