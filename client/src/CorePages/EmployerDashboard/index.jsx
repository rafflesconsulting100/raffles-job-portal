import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  fetchEmployerStats,
  fetchEmployerJobs,
  createEmployerJob,
  updateEmployerJob,
  deleteEmployerJob,
  fetchJobApplicants,
  updateCandidateStatus
} from "../../Service/Operation/employerApi";
import { showSuccess, showError } from "../../Utils/toast";

import AuthGuard from "./AuthGuard";
import HeaderBar from "./HeaderBar";
import NavigationTabs from "./NavigationTabs";
import OverviewTab from "./OverviewTab";
import JobListingsTab from "./JobListingsTab";
import JobFormTab from "./JobFormTab";
import ApplicantsTab from "./ApplicantsTab";
import CandidateModal from "./CandidateModal";
import DeleteJobModal from "./DeleteJobModal";

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab from query param or default 'overview'
  const currentTabParam = searchParams.get("tab") || "overview";
  const selectedJobIdParam = searchParams.get("jobId") || "";

  const [activeTab, setActiveTab] = useState(currentTabParam);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Stats state
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  });

  // Jobs state
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobSearch, setJobSearch] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState("all");

  // Job Editing State
  const [editingJob, setEditingJob] = useState(null);
  const [deletingJobId, setDeletingJobId] = useState(null);

  // Job Form state (for Post & Edit)
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    category: "Software Engineering",
    minEducation: "Bachelor's Degree",
    companyLogo: "",
    location: "",
    jobType: "Full-time",
    experienceLevel: "Mid Level (2-5 Yrs)",
    experienceYears: "1 - 3 Years",
    skills: "",
    salary: "",
    description: "",
    aboutCompany: "",
    requirements: "",
    benefits: "",
    screeningQuestions: "",
    status: "active"
  });

  const [formSubmitting, setFormSubmitting] = useState(false);

  // Applicants ATS state
  const [selectedJobId, setSelectedJobId] = useState(selectedJobIdParam);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [applicantStatusFilter, setApplicantStatusFilter] = useState("all");
  const [applicantSearch, setApplicantSearch] = useState("");
  const [updatingAppId, setUpdatingAppId] = useState(null);
  const [viewingApplicantModal, setViewingApplicantModal] = useState(null);

  // Sync tab with search params
  useEffect(() => {
    const tab = searchParams.get("tab") || "overview";
    setActiveTab(tab);
    const jId = searchParams.get("jobId") || "";
    if (jId) setSelectedJobId(jId);
  }, [searchParams]);

  // Handle user auth check
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);

        if (parsedUser.role === "Employer") {
          loadDashboardData(storedToken);
        }
      } catch (err) {
        console.error("Failed to parse user session", err);
      }
    }
    setLoading(false);
  }, []);

  // Load overall dashboard data
  const loadDashboardData = async (authToken) => {
    setJobsLoading(true);
    try {
      const statsRes = await fetchEmployerStats(authToken);
      if (statsRes.success) {
        setStats(statsRes.stats);
      }

      const jobsRes = await fetchEmployerJobs(authToken);
      if (jobsRes.success) {
        setJobs(jobsRes.jobs);
      }
    } catch (err) {
      showError(err.message || "Failed to load employer dashboard");
    } finally {
      setJobsLoading(false);
    }
  };

  // Load Applicants for ATS view
  const loadApplicantsForJob = async (jobId, authToken) => {
    if (!jobId) {
      setApplicants([]);
      return;
    }
    setApplicantsLoading(true);
    try {
      const res = await fetchJobApplicants(jobId, authToken || token);
      if (res.success) {
        setApplicants(res.applicants);
      }
    } catch (err) {
      showError(err.message || "Failed to load applicants for selected job");
      setApplicants([]);
    } finally {
      setApplicantsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "applicants" && token) {
      if (selectedJobId) {
        loadApplicantsForJob(selectedJobId, token);
      } else if (jobs.length > 0) {
        setSelectedJobId(jobs[0]._id);
        loadApplicantsForJob(jobs[0]._id, token);
      } else {
        setApplicants([]);
      }
    }
  }, [activeTab, selectedJobId, token, jobs]);

  const handleTabSwitch = (tab, jobId = "") => {
    setActiveTab(tab);
    if (jobId) {
      setSelectedJobId(jobId);
      setSearchParams({ tab, jobId });
    } else {
      setSearchParams({ tab });
    }
  };

  // Reset job form
  const resetForm = () => {
    setEditingJob(null);
    setJobForm({
      title: "",
      company: user?.username ? `${user.username} Inc` : "",
      category: "Software Engineering",
      minEducation: "Bachelor's Degree",
      companyLogo: "",
      location: "",
      jobType: "Full-time",
      experienceLevel: "Mid Level (2-5 Yrs)",
      experienceYears: "1 - 3 Years",
      skills: "",
      salary: "",
      description: "",
      aboutCompany: "",
      requirements: "",
      benefits: "",
      screeningQuestions: "",
      status: "active"
    });
  };

  // Populate form for Editing
  const startEditJob = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title || "",
      company: job.company || "",
      category: job.category || "Software Engineering",
      minEducation: job.minEducation || "Bachelor's Degree",
      companyLogo: job.companyLogo || "",
      location: job.location || "",
      jobType: job.jobType || "Full-time",
      experienceLevel: job.experienceLevel || "Mid Level (2-5 Yrs)",
      experienceYears: job.experienceYears || "1 - 3 Years",
      skills: Array.isArray(job.skills) ? job.skills.join(", ") : job.skills || "",
      salary: job.salary || "",
      description: job.description || "",
      aboutCompany: job.aboutCompany || "",
      requirements: Array.isArray(job.requirements) ? job.requirements.join("\n") : job.requirements || "",
      benefits: Array.isArray(job.benefits) ? job.benefits.join("\n") : job.benefits || "",
      screeningQuestions: Array.isArray(job.screeningQuestions) ? job.screeningQuestions.join("\n") : job.screeningQuestions || "",
      status: job.status || "active"
    });
    handleTabSwitch("post-job");
  };

  // Handle Form Submit (Create or Update)
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    if (!jobForm.title || !jobForm.company || !jobForm.location || !jobForm.description) {
      showError("Please fill in all required fields (Title, Company, Location, Description)");
      return;
    }

    setFormSubmitting(true);
    try {
      if (editingJob) {
        const res = await updateEmployerJob(editingJob._id, jobForm, token);
        if (res.success) {
          showSuccess("Job updated successfully!");
          resetForm();
          loadDashboardData(token);
          handleTabSwitch("my-jobs");
        }
      } else {
        const res = await createEmployerJob(jobForm, token);
        if (res.success) {
          showSuccess("Job posted successfully!");
          resetForm();
          loadDashboardData(token);
          handleTabSwitch("my-jobs");
        }
      }
    } catch (err) {
      showError(err.message || "Operation failed");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Toggle Job Status Quick Action (Active / Closed)
  const handleToggleJobStatus = async (job) => {
    const newStatus = job.status === "active" ? "closed" : "active";
    try {
      const res = await updateEmployerJob(job._id, { status: newStatus }, token);
      if (res.success) {
        showSuccess(`Job status updated to ${newStatus}`);
        setJobs(jobs.map((j) => (j._id === job._id ? { ...j, status: newStatus } : j)));
      }
    } catch (err) {
      showError(err.message || "Failed to update status");
    }
  };

  // Handle Job Deletion
  const handleDeleteJob = async (jobId) => {
    try {
      const res = await deleteEmployerJob(jobId, token);
      if (res.success) {
        showSuccess("Job posting deleted successfully");
        setDeletingJobId(null);
        setJobs(jobs.filter((j) => j._id !== jobId));
        loadDashboardData(token);
      }
    } catch (err) {
      showError(err.message || "Failed to delete job");
    }
  };

  // Handle Candidate Status Change (Accept / Reject)
  const handleUpdateStatus = async (applicationId, status) => {
    setUpdatingAppId(applicationId);
    try {
      const res = await updateCandidateStatus(applicationId, status, token);
      if (res.success) {
        showSuccess(`Candidate status updated to "${status}"`);
        setApplicants(
          applicants.map((app) => (app._id === applicationId ? { ...app, status } : app))
        );
        loadDashboardData(token);
      }
    } catch (err) {
      showError(err.message || "Failed to update candidate status");
    } finally {
      setUpdatingAppId(null);
    }
  };

  // Filter Jobs list for My Jobs tab
  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.location.toLowerCase().includes(jobSearch.toLowerCase());
    const matchesStatus = jobStatusFilter === "all" || j.status === jobStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter Applicants list for ATS tab
  const filteredApplicants = applicants.filter((app) => {
    const candidateName = app.applicant?.username || "";
    const candidateEmail = app.applicant?.email || "";
    const matchesSearch =
      candidateName.toLowerCase().includes(applicantSearch.toLowerCase()) ||
      candidateEmail.toLowerCase().includes(applicantSearch.toLowerCase());
    const matchesStatus =
      applicantStatusFilter === "all" || app.status === applicantStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Auth Guard Screen if not logged in or not an Employer
  if (!loading && (!token || !user || user.role !== "Employer")) {
    return <AuthGuard navigate={navigate} />;
  }

  // Check if employer access is revoked or suspended by Admin
  const isEmployerRestricted =
    user?.employerAccess === false ||
    user?.isApproved === false ||
    user?.status === "Suspended";

  if (!loading && isEmployerRestricted) {
    return <AuthGuard navigate={navigate} isRestricted={true} />;
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 font-sans pt-20 lg:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER BAR */}
        <HeaderBar
          user={user}
          jobsLoading={jobsLoading}
          resetForm={resetForm}
          handleTabSwitch={handleTabSwitch}
          loadDashboardData={loadDashboardData}
          token={token}
        />

        {/* NAVIGATION TABS */}
        <NavigationTabs
          activeTab={activeTab}
          handleTabSwitch={handleTabSwitch}
          jobsCount={jobs.length}
          totalApplicants={stats.totalApplicants}
          editingJob={editingJob}
        />

        {/* TAB 1: OVERVIEW & STATS */}
        {activeTab === "overview" && (
          <OverviewTab
            stats={stats}
            jobs={jobs}
            handleTabSwitch={handleTabSwitch}
            startEditJob={startEditJob}
            resetForm={resetForm}
          />
        )}

        {/* TAB 2: MY JOBS LISTINGS */}
        {activeTab === "my-jobs" && (
          <JobListingsTab
            jobs={jobs}
            filteredJobs={filteredJobs}
            jobsLoading={jobsLoading}
            jobSearch={jobSearch}
            setJobSearch={setJobSearch}
            jobStatusFilter={jobStatusFilter}
            setJobStatusFilter={setJobStatusFilter}
            handleTabSwitch={handleTabSwitch}
            handleToggleJobStatus={handleToggleJobStatus}
            startEditJob={startEditJob}
            setDeletingJobId={setDeletingJobId}
            resetForm={resetForm}
          />
        )}

        {/* TAB 3: POST / EDIT JOB */}
        {activeTab === "post-job" && (
          <JobFormTab
            editingJob={editingJob}
            jobForm={jobForm}
            setJobForm={setJobForm}
            handleJobSubmit={handleJobSubmit}
            formSubmitting={formSubmitting}
            resetForm={resetForm}
            handleTabSwitch={handleTabSwitch}
          />
        )}

        {/* TAB 4: APPLICANT ATS PIPELINE */}
        {activeTab === "applicants" && (
          <ApplicantsTab
            selectedJobId={selectedJobId}
            setSelectedJobId={setSelectedJobId}
            setSearchParams={setSearchParams}
            jobs={jobs}
            applicantSearch={applicantSearch}
            setApplicantSearch={setApplicantSearch}
            applicantStatusFilter={applicantStatusFilter}
            setApplicantStatusFilter={setApplicantStatusFilter}
            filteredApplicants={filteredApplicants}
            applicantsLoading={applicantsLoading}
            setViewingApplicantModal={setViewingApplicantModal}
            handleUpdateStatus={handleUpdateStatus}
            updatingAppId={updatingAppId}
          />
        )}
      </div>

      {/* MODAL: CANDIDATE DETAILS & SCREENING ANSWERS */}
      <CandidateModal
        viewingApplicantModal={viewingApplicantModal}
        setViewingApplicantModal={setViewingApplicantModal}
      />

      {/* MODAL: CONFIRM DELETE JOB */}
      <DeleteJobModal
        deletingJobId={deletingJobId}
        setDeletingJobId={setDeletingJobId}
        handleDeleteJob={handleDeleteJob}
      />
    </div>
  );
}
