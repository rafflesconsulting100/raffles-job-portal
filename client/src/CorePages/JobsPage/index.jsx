import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { mockJobs } from '../../data/mockdata';
import { showSuccess, showError } from '../../Utils/toast';
import { fetchAllJobs, formatBackendJob, applyToJobBackend } from '../../Service/Operation/jobApi';
import {
  fetchSavedJobs,
  toggleSaveJobBackend,
  fetchCandidateApplications,
  fetchUserProfile
} from '../../Service/Operation/seekerApi';

import TopSearchBanner from './TopSearchBanner';
import JobStatsBar from './JobStatsBar';
import FilterSidebar from './FilterSidebar';
import MobileFilterDrawer from './MobileFilterDrawer';
import JobCard from './JobCard';
import JobDetailModal from './JobDetailModal';
import JobApplyModal from './JobApplyModal';

export default function JobsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlJobId = searchParams.get('jobId');

  // Auth & User State from localStorage
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  });
  const [userProfile, setUserProfile] = useState(null);

  // All jobs list & loading state
  const [allJobsList, setAllJobsList] = useState(mockJobs);
  const [jobsLoading, setJobsLoading] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('q') || searchParams.get('title') || searchParams.get('skill') || '');
  const [locationSearch, setLocationSearch] = useState(() => searchParams.get('location') || '');

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');
  const [selectedWorkModes, setSelectedWorkModes] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedDatePosted, setSelectedDatePosted] = useState('all');
  const [maxSalary, setMaxSalary] = useState(3500000); // 35 Lakhs default max

  // Selected job for detail view & saved/applied tracking
  const [selectedJobId, setSelectedJobId] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);

  // Full Details Modal state (when user clicks any job card)
  const [viewingJobDetails, setViewingJobDetails] = useState(null);

  // Mobile filters open/close
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sorting & Layout View Mode ('grid' or 'list')
  const [sortBy, setSortBy] = useState('recent'); // 'recent', 'salary_desc', 'salary_asc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (2 columns) or 'list' (1 column)

  // Application Modal state
  const [applyingJob, setApplyingJob] = useState(null);
  const [customResumeFile, setCustomResumeFile] = useState(null);
  const [useProfileResume, setUseProfileResume] = useState(true);
  const [screeningAnswers, setScreeningAnswers] = useState({});
  const [coverLetter, setCoverLetter] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);

  // Fetch live jobs from backend API on mount
  useEffect(() => {
    window.scrollTo(0, 0);

    const loadJobs = async () => {
      setJobsLoading(true);
      try {
        const res = await fetchAllJobs();
        let backendJobs = [];
        if (res && res.success && Array.isArray(res.jobs)) {
          backendJobs = res.jobs.map(formatBackendJob);
        }
        // Merge backend jobs first, then fallback to mockJobs ensuring unique IDs
        const combined = [...backendJobs, ...mockJobs];
        const uniqueJobs = combined.filter((job, index, self) =>
          index === self.findIndex((j) => (j.id || j._id) === (job.id || job._id))
        );
        setAllJobsList(uniqueJobs);
      } catch (err) {
        console.error("Error loading jobs for JobsPage:", err);
      } finally {
        setJobsLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Fetch Candidate Saved Jobs & Applications when logged in
  useEffect(() => {
    if (!token) return;

    const loadUserData = async () => {
      try {
        // Fetch saved jobs from backend
        const savedRes = await fetchSavedJobs(token);
        if (savedRes && savedRes.savedJobs && Array.isArray(savedRes.savedJobs)) {
          const savedIds = savedRes.savedJobs.map(item =>
            typeof item === 'object' ? item._id || item.id : item
          );
          setSavedJobs(savedIds);
        }

        // Fetch candidate applications from backend
        const appsRes = await fetchCandidateApplications(token);
        if (appsRes && appsRes.applications && Array.isArray(appsRes.applications)) {
          const appliedIds = appsRes.applications.map(app =>
            app.job ? (typeof app.job === 'object' ? app.job._id || app.job.id : app.job) : null
          ).filter(Boolean);
          setAppliedJobs(appliedIds);
        }

        // Fetch profile info for resume check
        const profileRes = await fetchUserProfile(token);
        if (profileRes && profileRes.user) {
          setUserProfile(profileRes.user);
        }
      } catch (err) {
        console.error("Error loading candidate user data:", err);
      }
    };

    loadUserData();
  }, [token]);

  // Sync selected job ID from URL query param if present
  useEffect(() => {
    if (urlJobId) {
      setSelectedJobId(urlJobId);
      const targetJob = allJobsList.find(j => (j.id || j._id) === urlJobId);
      if (targetJob) {
        setViewingJobDetails(targetJob);
      }
    }
  }, [urlJobId, allJobsList]);

  // Checkbox handlers
  const handleWorkModeChange = (mode) => {
    if (selectedWorkModes.includes(mode)) {
      setSelectedWorkModes(selectedWorkModes.filter(m => m !== mode));
    } else {
      setSelectedWorkModes([...selectedWorkModes, mode]);
    }
  };

  const handleJobTypeChange = (type) => {
    if (selectedJobTypes.includes(type)) {
      setSelectedJobTypes(selectedJobTypes.filter(t => t !== type));
    } else {
      setSelectedJobTypes([...selectedJobTypes, type]);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setLocationSearch('');
    setSelectedCategory('All');
    setSelectedExperience('All');
    setSelectedWorkModes([]);
    setSelectedJobTypes([]);
    setSelectedDatePosted('all');
    setMaxSalary(3500000);
    showSuccess('Filters reset successfully');
  };

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    searchTerm ||
    locationSearch ||
    selectedCategory !== 'All' ||
    selectedExperience !== 'All' ||
    selectedWorkModes.length > 0 ||
    selectedJobTypes.length > 0 ||
    selectedDatePosted !== 'all' ||
    maxSalary < 3500000
  );

  // Toggle Save / Bookmark Job via backend API
  const toggleSaveJob = async (jobId, jobTitle) => {
    if (!token) {
      showError('Please log in to save jobs.');
      navigate('/login');
      return;
    }

    try {
      const res = await toggleSaveJobBackend(jobId, token);
      if (res && res.success) {
        if (Array.isArray(res.savedJobs)) {
          const updatedSaved = res.savedJobs.map(j => (typeof j === 'object' ? j._id || j.id : j));
          setSavedJobs(updatedSaved);
        } else {
          if (savedJobs.includes(jobId)) {
            setSavedJobs(savedJobs.filter(id => id !== jobId));
          } else {
            setSavedJobs([...savedJobs, jobId]);
          }
        }
        showSuccess(res.message || `Saved "${jobTitle}" to bookmarks!`);
      } else {
        showError(res?.message || 'Failed to update saved status.');
      }
    } catch (err) {
      console.error("Toggle save job error:", err);
      showError(err.message || 'Failed to update bookmark');
    }
  };

  // Open Full Job Details Modal when user clicks any job card
  const handleCardClick = (job) => {
    const jobId = job._id || job.id;
    setSelectedJobId(jobId);
    setViewingJobDetails(job);
  };

  // Trigger Apply Modal
  const handleApplyClick = (job) => {
    if (!token) {
      showError('Please log in to apply for job postings.');
      navigate('/login');
      return;
    }

    if (user && user.role === 'Employer') {
      showError('Employer accounts cannot apply for job postings.');
      return;
    }

    const jobId = job._id || job.id;
    if (appliedJobs.includes(jobId)) {
      showError(`You have already applied for "${job.title}".`);
      return;
    }

    // Close details modal if open and open apply modal
    setViewingJobDetails(null);
    setApplyingJob(job);
    setCustomResumeFile(null);
    setUseProfileResume(true);
    setCoverLetter('');

    const initialAnswers = {};
    if (Array.isArray(job.screeningQuestions)) {
      job.screeningQuestions.forEach((q, idx) => {
        initialAnswers[idx] = '';
      });
    }
    setScreeningAnswers(initialAnswers);
  };

  // Submit Application Form via backend API
  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!applyingJob) return;

    const jobId = applyingJob._id || applyingJob.id;
    const hasProfileResume = Boolean(userProfile?.resume || user?.resume);

    if (!useProfileResume && !customResumeFile) {
      showError('Please upload a resume file.');
      return;
    }
    if (useProfileResume && !hasProfileResume && !customResumeFile) {
      showError('No profile resume found. Please upload a resume file.');
      return;
    }

    setSubmittingApp(true);
    try {
      const formData = new FormData();

      if (!useProfileResume && customResumeFile) {
        formData.append('resume', customResumeFile);
      } else if (customResumeFile && !hasProfileResume) {
        formData.append('resume', customResumeFile);
      }

      if (applyingJob.screeningQuestions && applyingJob.screeningQuestions.length > 0) {
        const answersArr = applyingJob.screeningQuestions.map((q, idx) => ({
          question: q,
          answer: screeningAnswers[idx] || ''
        }));
        formData.append('screeningAnswers', JSON.stringify(answersArr));
      }

      if (coverLetter.trim()) {
        formData.append('coverLetter', coverLetter.trim());
      }

      const res = await applyToJobBackend(jobId, formData, token);
      if (res && res.success) {
        showSuccess(`Successfully applied for "${applyingJob.title}"!`);
        setAppliedJobs(prev => [...prev, jobId]);
        setApplyingJob(null);
      } else {
        showError(res?.message || 'Failed to submit application.');
      }
    } catch (err) {
      console.error("Submit application error:", err);
      showError(err.message || 'Error submitting application.');
    } finally {
      setSubmittingApp(false);
    }
  };

  // Filter & Sort Logic
  const filteredJobs = useMemo(() => {
    return allJobsList
      .filter((job) => {
        // Search term filter (title, company, skills, category)
        const matchSearch =
          !searchTerm.trim() ||
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (job.category && job.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (job.skills && job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())));

        // Location filter
        const matchLocation =
          !locationSearch.trim() ||
          (job.location && job.location.toLowerCase().includes(locationSearch.trim().toLowerCase()));

        // Category filter
        const matchCategory =
          selectedCategory === 'All' || job.category === selectedCategory;

        // Experience level filter
        const matchExperience =
          selectedExperience === 'All' || job.experienceLevel === selectedExperience;

        // Work mode filter
        const matchWorkMode =
          selectedWorkModes.length === 0 || selectedWorkModes.includes(job.workMode);

        // Job type filter
        const matchJobType =
          selectedJobTypes.length === 0 || selectedJobTypes.includes(job.jobType);

        // Salary filter
        const matchSalary = job.salaryMin <= maxSalary;

        // Date Posted filter
        let matchDate = true;
        if (selectedDatePosted !== 'all') {
          const postedTime = new Date(job.postedDate).getTime();
          const daysAgo = parseInt(selectedDatePosted);
          const limitTime = Date.now() - daysAgo * 24 * 60 * 60 * 1000;
          matchDate = postedTime >= limitTime;
        }

        return (
          matchSearch &&
          matchLocation &&
          matchCategory &&
          matchExperience &&
          matchWorkMode &&
          matchJobType &&
          matchSalary &&
          matchDate
        );
      })
      .sort((a, b) => {
        if (sortBy === 'recent') {
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        }
        if (sortBy === 'salary_desc') {
          return b.salaryMax - a.salaryMax;
        }
        if (sortBy === 'salary_asc') {
          return a.salaryMin - b.salaryMin;
        }
        return 0;
      });
  }, [
    allJobsList,
    searchTerm,
    locationSearch,
    selectedCategory,
    selectedExperience,
    selectedWorkModes,
    selectedJobTypes,
    selectedDatePosted,
    maxSalary,
    sortBy
  ]);

  // Active job for side preview panel (desktop)
  const currentSelectedJob = useMemo(() => {
    const job = filteredJobs.find(j => (j.id || j._id) === selectedJobId);
    return job || filteredJobs[0] || null;
  }, [filteredJobs, selectedJobId]);

  // Extract unique locations dynamically for filter dropdowns & quick selection
  const availableLocations = useMemo(() => {
    const locSet = new Set();
    allJobsList.forEach(job => {
      if (job.location && typeof job.location === 'string') {
        const cleanLoc = job.location.trim();
        if (cleanLoc) locSet.add(cleanLoc);
      }
    });
    return Array.from(locSet).sort();
  }, [allJobsList]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1e293b] pt-20 pb-16">
      {/* 1. TOP SEARCH & LOCATION FILTER BANNER */}
      <TopSearchBanner
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        locationSearch={locationSearch}
        setLocationSearch={setLocationSearch}
        resetFilters={resetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* 2. MAIN JOBS CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Statistics & Sorting Bar */}
        <JobStatsBar
          totalJobs={filteredJobs.length}
          jobsLoading={jobsLoading}
          setMobileFiltersOpen={setMobileFiltersOpen}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {/* Master layout grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* A. SIDEBAR FILTERS (DESKTOP) */}
          <FilterSidebar
            locationSearch={locationSearch}
            setLocationSearch={setLocationSearch}
            availableLocations={availableLocations}
            allJobsCount={allJobsList.length}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedExperience={selectedExperience}
            setSelectedExperience={setSelectedExperience}
            selectedWorkModes={selectedWorkModes}
            handleWorkModeChange={handleWorkModeChange}
            selectedJobTypes={selectedJobTypes}
            handleJobTypeChange={handleJobTypeChange}
            maxSalary={maxSalary}
            setMaxSalary={setMaxSalary}
            selectedDatePosted={selectedDatePosted}
            setSelectedDatePosted={setSelectedDatePosted}
            resetFilters={resetFilters}
          />

          {/* B. JOB LIST & DETAIL PANELS */}
          {filteredJobs.length === 0 ? (
            <div className="lg:col-span-9 bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-xs flex flex-col items-center justify-center space-y-4">
              <AlertCircle className="w-12 h-12 text-gray-300" />
              <h3 className="text-lg font-bold text-[#1e293b]">No Matching Jobs Found</h3>
              <p className="text-sm text-gray-400 max-w-sm">
                We couldn't find any listings matching your search constraints. Try clearing some filters or expanding your keywords.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 bg-[#2B2A8C] hover:bg-[#1E1D66] text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div
              className={`lg:col-span-9 grid gap-5 items-stretch ${
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2'
                  : 'grid-cols-1'
              }`}
            >
              {filteredJobs.map((job) => {
                const jobId = job._id || job.id;
                const isSelected = currentSelectedJob && (currentSelectedJob._id || currentSelectedJob.id) === jobId;
                const isSaved = savedJobs.includes(jobId);
                const isApplied = appliedJobs.includes(jobId);

                return (
                  <JobCard
                    key={jobId}
                    job={job}
                    isSelected={isSelected}
                    isSaved={isSaved}
                    isApplied={isApplied}
                    onCardClick={handleCardClick}
                    onSaveClick={toggleSaveJob}
                    onApplyClick={handleApplyClick}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* 3. FULL JOB DETAILS POPUP MODAL (When clicking any job card) */}
      <JobDetailModal
        job={viewingJobDetails}
        onClose={() => setViewingJobDetails(null)}
        isSaved={viewingJobDetails ? savedJobs.includes(viewingJobDetails._id || viewingJobDetails.id) : false}
        isApplied={viewingJobDetails ? appliedJobs.includes(viewingJobDetails._id || viewingJobDetails.id) : false}
        onSaveClick={toggleSaveJob}
        onApplyClick={handleApplyClick}
      />

      {/* 4. MOBILE SLIDE-OVER FILTER SIDEBAR */}
      <MobileFilterDrawer
        isOpen={mobileFiltersOpen}
        setIsOpen={setMobileFiltersOpen}
        locationSearch={locationSearch}
        setLocationSearch={setLocationSearch}
        availableLocations={availableLocations}
        allJobsCount={allJobsList.length}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedExperience={selectedExperience}
        setSelectedExperience={setSelectedExperience}
        selectedWorkModes={selectedWorkModes}
        handleWorkModeChange={handleWorkModeChange}
        selectedJobTypes={selectedJobTypes}
        handleJobTypeChange={handleJobTypeChange}
        maxSalary={maxSalary}
        setMaxSalary={setMaxSalary}
        selectedDatePosted={selectedDatePosted}
        setSelectedDatePosted={setSelectedDatePosted}
        resetFilters={resetFilters}
      />

      {/* 5. APPLICATION SUBMISSION MODAL */}
      <JobApplyModal
        job={applyingJob}
        onClose={() => setApplyingJob(null)}
        userProfile={userProfile}
        user={user}
        customResumeFile={customResumeFile}
        setCustomResumeFile={setCustomResumeFile}
        useProfileResume={useProfileResume}
        setUseProfileResume={setUseProfileResume}
        screeningAnswers={screeningAnswers}
        setScreeningAnswers={setScreeningAnswers}
        coverLetter={coverLetter}
        setCoverLetter={setCoverLetter}
        submittingApp={submittingApp}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
