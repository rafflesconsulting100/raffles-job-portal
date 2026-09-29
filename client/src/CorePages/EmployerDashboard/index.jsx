import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  fetchEmployerStats,
  fetchEmployerJobs,
  createEmployerJob,
  updateEmployerJob,
  deleteEmployerJob,
  fetchJobApplicants,
  updateCandidateStatus,
  fetchStudentDatabase
} from "../../Service/Operation/employerApi";
import { getProfile } from "../../Service/Operation/authApi";
import { showSuccess, showError } from "../../Utils/toast";
import { getToken } from "../../Utils/memoryStore";

import AuthGuard from "./AuthGuard";
import HeaderBar from "./HeaderBar";
import NavigationTabs from "./NavigationTabs";
import OverviewTab from "./OverviewTab";
import JobListingsTab from "./JobListingsTab";
import JobFormTab from "./JobFormTab";
import ApplicantsTab from "./ApplicantsTab";
import CandidateModal from "./CandidateModal";
import DeleteJobModal from "./DeleteJobModal";
import StudentDatabaseTab from "./StudentDatabaseTab";

import useSeo from '../../Utils/useSeo';

export default function EmployerDashboard() {
  useSeo({ path: '/employer-dashboard' });
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab from query param or default 'overview'
  const activeTab = searchParams.get("tab") || "overview";
  const selectedJobIdParam = searchParams.get("jobId") || "";

  const [token] = useState(() => getToken());
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
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
    category: "BPO",
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
    status: "active",
    expiresAt: "",
    // Missing from this object before: the edit form rendered these two
    // fields empty, so every edit silently dropped the stored values.
    numberOfOpenings: "",
    preferredLanguages: []
  });

  const [formSubmitting, setFormSubmitting] = useState(false);
  // Drives the inline required-field errors in JobFormTab.
  const [validationAttempted, setValidationAttempted] = useState(false);

  // Applicants ATS state
  const [selectedJobId, setSelectedJobId] = useState(selectedJobIdParam);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);
  const [applicantStatusFilter, setApplicantStatusFilter] = useState("all");
  const [applicantSearch, setApplicantSearch] = useState("");
  const [updatingAppId, setUpdatingAppId] = useState(null);
  const [viewingApplicantModal, setViewingApplicantModal] = useState(null);

  // Student Database state
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentStats, setStudentStats] = useState(null);

  // Re-validate employer access with the server on mount so a freshly
  // approved/revoked account is reflected before any employer-only API call.
  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;
    getProfile(token)
      .then((res) => {
        if (cancelled || !res || !res.success || !res.user) return;
        localStorage.setItem("user", JSON.stringify(res.user));
        setUser(res.user);
        window.dispatchEvent(new Event("auth-change"));
      })
      .catch((err) => {
        console.error("Failed to refresh employer profile on mount:", err);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Handle user auth check on mount
  useEffect(() => {
    if (token && user) {
      const approval = (user.approvalStatus || "").toLowerCase();
      const isApprovedEmployer =
        (approval ? approval === "approved" : true) &&
        user.isApproved !== false &&
        user.employerAccess !== false &&
        user.status !== "Pending" &&
        user.status !== "Suspended" &&
        user.status !== "Rejected";

      // Restricted employers never call employer-only APIs (enforced by the backend too)
      if (user.role === "Employer" && isApprovedEmployer) {
        queueMicrotask(() => {
          loadDashboardData(token);
        });
      }
    }
    // Primitive deps only: `user` is replaced by a fresh object after a
    // profile refresh, which would re-run this effect (and refetch) for no
    // reason — the guard only reads these scalar fields.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    token,
    user?.role,
    user?.approvalStatus,
    user?.isApproved,
    user?.employerAccess,
    user?.status,
  ]);

  // Load Applicants for ATS view
  const loadApplicantsForJob = useCallback(async (jobId, authToken) => {
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
  }, [token]);

  useEffect(() => {
    if (activeTab === "applicants" && token) {
      if (selectedJobId) {
        queueMicrotask(() => {
          loadApplicantsForJob(selectedJobId, token);
        });
      } else if (jobs.length > 0) {
        const firstJobId = jobs[0]._id;
        queueMicrotask(() => {
          setSelectedJobId(firstJobId);
          loadApplicantsForJob(firstJobId, token);
        });
      } else {
        queueMicrotask(() => {
          setApplicants([]);
        });
      }
    }
  }, [activeTab, selectedJobId, token, jobs, loadApplicantsForJob]);

  // Load Student Database
  const loadStudentDatabase = useCallback(async (authToken) => {
    setStudentsLoading(true);
    try {
      const res = await fetchStudentDatabase(authToken || token);
      if (res.success) {
        setStudents(res.students);
        setStudentStats(res.stats);
      }
    } catch (err) {
      showError(err.message || "Failed to load student database");
      setStudents([]);
    } finally {
      setStudentsLoading(false);
    }
  }, [token]);

  const [studentsLoaded, setStudentsLoaded] = useState(false);

  useEffect(() => {
    if (activeTab === "student-database" && token && !studentsLoaded) {
      queueMicrotask(() => {
        loadStudentDatabase(token).finally(() => setStudentsLoaded(true));
      });
    }
  }, [activeTab, token, studentsLoaded, loadStudentDatabase]);

  const handleTabSwitch = (tab, jobId = "") => {
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
    setValidationAttempted(false);
    setJobForm({
      title: "",
      company: user?.companyName || user?.username || "",
      category: "BPO",
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
      status: "active",
      expiresAt: "",
      numberOfOpenings: "",
      preferredLanguages: []
    });
  };

  // Populate form for Editing
  const startEditJob = (job) => {
    setEditingJob(job);
    setJobForm({
      title: job.title || "",
      company: job.company || "",
      category: job.category || "Marketing",
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
      status: job.status || "active",
      expiresAt: job.expiresAt ? new Date(job.expiresAt).toISOString().split('T')[0] : "",
      numberOfOpenings: job.numberOfOpenings ?? "",
      preferredLanguages: Array.isArray(job.preferredLanguages) ? [...job.preferredLanguages] : []
    });
    handleTabSwitch("post-job");
  };

  // Handle Form Submit (Create or Update)
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    const missingRequired =
      !jobForm.title || !jobForm.company || !jobForm.location || !jobForm.description;
    const missingOpenings =
      jobForm.numberOfOpenings === "" ||
      jobForm.numberOfOpenings === null ||
      jobForm.numberOfOpenings === undefined;
    const missingLanguages =
      !Array.isArray(jobForm.preferredLanguages) || jobForm.preferredLanguages.length === 0;

    if (missingRequired || missingOpenings || missingLanguages) {
      // Flip the flag the form uses for its inline field errors — the language
      // error could never render before because nothing ever set it.
      setValidationAttempted(true);
      showError(
        missingRequired
          ? "Please fill in all required fields (Title, Company, Location, Description)"
          : missingOpenings
          ? "Please enter the number of openings."
          : "Please select at least one preferred language."
      );
      return;
    }
    setValidationAttempted(false);

    // The form advertises 100–150 words; previously neither limit was checked
    // and the textarea just stopped accepting input at 150 with no feedback.
    const descriptionWords = jobForm.description.trim()
      ? jobForm.description.trim().split(/\s+/).length
      : 0;
    if (descriptionWords > 150) {
      showError(`Job description is ${descriptionWords} words — the maximum is 150.`);
      return;
    }
    if (!editingJob && descriptionWords < 100) {
      showError("Job description must be at least 100 words.");
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

  const handleRefreshStatus = async () => {
    if (!token) return;
    try {
      const res = await getProfile(token);
      if (res.success && res.user) {
        localStorage.setItem("user", JSON.stringify(res.user));
        setUser(res.user);
        window.dispatchEvent(new Event("auth-change"));
        const appr = (res.user.approvalStatus || "").toLowerCase();
        const isApproved =
          (appr ? appr === "approved" : true) &&
          res.user.isApproved &&
          res.user.employerAccess &&
          res.user.status === "Active";
        if (isApproved) {
          showSuccess("Your account is approved! Loading your dashboard.");
          loadDashboardData(token);
        } else if (appr === "rejected" || res.user.status === "Rejected") {
          showError("Your employer account registration was not approved.");
        } else if (appr === "revoked" || res.user.status === "Suspended" || res.user.employerAccess === false) {
          showError("Your employer access has been revoked. Please contact RafflesJobs support.");
        } else {
          showError("Your employer account is pending Admin approval.");
        }
      }
    } catch (e) {
      showError("Could not verify status. Please try again later.");
    }
  };

  // Auth Guard Screen if not logged in or not an Employer
  if (!token || !user || user.role !== "Employer") {
    return <AuthGuard navigate={navigate} />;
  }

  const approval = (user?.approvalStatus || "").toLowerCase();

  // Check if the employer registration was rejected by Admin
  const isEmployerRejected = approval === "rejected" || user?.status === "Rejected";

  // Check if employer access is pending admin approval
  const isEmployerPending =
    !isEmployerRejected &&
    (approval === "pending" ||
      user?.status === "Pending" ||
      (user?.isApproved === false && user?.status !== "Suspended"));

  // Check if employer access is revoked or suspended by Admin
  const isEmployerRestricted =
    !isEmployerRejected &&
    !isEmployerPending &&
    (approval === "revoked" ||
      user?.employerAccess === false ||
      user?.status === "Suspended");

  if (isEmployerRejected) {
    return (
      <AuthGuard
        navigate={navigate}
        isRejected={true}
        onRefreshStatus={handleRefreshStatus}
      />
    );
  }

  if (isEmployerPending) {
    return (
      <AuthGuard
        navigate={navigate}
        isPending={true}
        onRefreshStatus={handleRefreshStatus}
      />
    );
  }

  if (isEmployerRestricted) {
    return (
      <AuthGuard
        navigate={navigate}
        isRestricted={true}
        onRefreshStatus={handleRefreshStatus}
      />
    );
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
            validationAttempted={validationAttempted}
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

        {/* TAB 5: STUDENT DATABASE */}
        {activeTab === "student-database" && (
          <StudentDatabaseTab
            students={students}
            studentsLoading={studentsLoading}
            studentStats={studentStats}
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
