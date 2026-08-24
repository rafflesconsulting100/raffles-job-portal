import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  fetchCandidateApplications,
  withdrawCandidateApplication,
  fetchSavedJobs,
  toggleSaveJobBackend,
  fetchUserProfile,
  updateUserProfile,
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from "../../Service/Operation/seekerApi";
import { showSuccess, showError } from "../../Utils/toast";

import AuthGuard from "./AuthGuard";
import HeaderBar from "./HeaderBar";
import NavigationTabs from "./NavigationTabs";
import OverviewTab from "./OverviewTab";
import ApplicationsTab from "./ApplicationsTab";
import SavedJobsTab from "./SavedJobsTab";
import ProfileTab from "./ProfileTab";
import NotificationsTab from "./NotificationsTab";
import ApplicationDetailModal from "./ApplicationDetailModal";
import WithdrawModal from "./WithdrawModal";

export default function JobSeekerDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active tab from URL search param (default: 'overview')
  const currentTabParam = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(currentTabParam);

  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  // Core Data States
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Modals & Submitting States
  const [viewingApplicationModal, setViewingApplicationModal] = useState(null);
  const [withdrawingAppId, setWithdrawingAppId] = useState(null);
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);

  // Sync tab state with search params
  useEffect(() => {
    const tab = searchParams.get("tab") || "overview";
    setActiveTab(tab);
  }, [searchParams]);

  // Handle User Auth & Session initialization
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);

        if (parsedUser.role === "Job Seeker") {
          loadDashboardData(storedToken);
        }
      } catch (err) {
        console.error("Failed to parse user session", err);
      }
    }
    setAuthLoading(false);
  }, []);

  // Fetch all dashboard data from backend
  const loadDashboardData = async (authToken) => {
    const activeAuthToken = authToken || token;
    if (!activeAuthToken) return;

    setDataLoading(true);
    try {
      // Fetch Applications
      const appsRes = await fetchCandidateApplications(activeAuthToken);
      if (appsRes.success) {
        setApplications(appsRes.applications || []);
      }

      // Fetch Saved Jobs
      const savedRes = await fetchSavedJobs(activeAuthToken);
      if (savedRes.success) {
        setSavedJobs(savedRes.savedJobs || []);
      }

      // Fetch Notifications
      const notifRes = await fetchNotifications(activeAuthToken);
      if (notifRes.success) {
        setNotifications(notifRes.notifications || []);
      }

      // Fetch fresh profile data
      const profileRes = await fetchUserProfile(activeAuthToken);
      if (profileRes.success && profileRes.user) {
        setUser(profileRes.user);
        localStorage.setItem("user", JSON.stringify(profileRes.user));
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Withdraw Application
  const handleConfirmWithdraw = async (applicationId) => {
    setWithdrawSubmitting(true);
    try {
      const res = await withdrawCandidateApplication(applicationId, token);
      if (res.success) {
        showSuccess("Application withdrawn successfully");
        setApplications((prev) => prev.filter((app) => app._id !== applicationId));
        setWithdrawingAppId(null);
      }
    } catch (err) {
      showError(err.message || "Failed to withdraw application");
    } finally {
      setWithdrawSubmitting(false);
    }
  };

  // Toggle Save / Unsave Job
  const handleToggleSaveJob = async (jobId) => {
    try {
      const res = await toggleSaveJobBackend(jobId, token);
      if (res.success) {
        showSuccess(res.message);
        loadDashboardData(token);
      }
    } catch (err) {
      showError(err.message || "Failed to update saved jobs");
    }
  };

  // Profile Update Handler
  const handleProfileUpdated = async (formData) => {
    const res = await updateUserProfile(formData, token);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem("user", JSON.stringify(res.user));
      window.dispatchEvent(new Event("auth-change"));
      loadDashboardData(token);
    }
  };

  // Notification Handlers
  const handleMarkNotificationRead = async (notifId) => {
    try {
      const res = await markNotificationAsRead(notifId, token);
      if (res.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === notifId ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      const res = await markAllNotificationsAsRead(token);
      if (res.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        showSuccess("All notifications marked as read");
      }
    } catch (err) {
      showError(err.message || "Failed to mark all as read");
    }
  };

  // Compute Statistics
  const stats = {
    totalApplied: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
    savedCount: savedJobs.length,
  };

  // Compute Profile Completeness score
  const computeProfileCompletion = () => {
    if (!user) return 0;
    let score = 10; // Default base score
    if (user.username) score += 10;
    if (user.gender && user.dob) score += 10;
    if (user.bio) score += 10;
    if (user.location) score += 10;
    if (user.contactNumber) score += 10;
    if (Array.isArray(user.skills) && user.skills.length > 0) score += 10;
    if (Array.isArray(user.education) && user.education.length > 0) score += 10;
    if (Array.isArray(user.experience) && user.experience.length > 0) score += 10;
    if (Array.isArray(user.projects) && user.projects.length > 0) score += 5;
    if (Array.isArray(user.certifications) && user.certifications.length > 0) score += 5;
    if (user.resume) score += 10;
    return Math.min(score, 100);
  };

  const profileCompletion = computeProfileCompletion();
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  // Auth Guard: Restrict access if not logged in or not a Job Seeker
  if (!authLoading && (!token || !user || user.role !== "Job Seeker")) {
    return <AuthGuard navigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-800 font-sans pt-20 lg:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER BAR */}
        <HeaderBar
          user={user}
          loading={dataLoading}
          handleTabSwitch={handleTabSwitch}
          loadDashboardData={loadDashboardData}
          token={token}
          profileCompletion={profileCompletion}
        />

        {/* NAVIGATION TABS */}
        <NavigationTabs
          activeTab={activeTab}
          handleTabSwitch={handleTabSwitch}
          applicationsCount={applications.length}
          savedJobsCount={savedJobs.length}
          unreadNotificationsCount={unreadNotificationsCount}
        />

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <OverviewTab
            stats={stats}
            applications={applications}
            savedJobs={savedJobs}
            handleTabSwitch={handleTabSwitch}
            setViewingApplicationModal={setViewingApplicationModal}
            setWithdrawingAppId={setWithdrawingAppId}
            toggleSaveJob={handleToggleSaveJob}
            profileCompletion={profileCompletion}
          />
        )}

        {/* TAB 2: MY APPLICATIONS */}
        {activeTab === "applications" && (
          <ApplicationsTab
            applications={applications}
            loading={dataLoading}
            setViewingApplicationModal={setViewingApplicationModal}
            setWithdrawingAppId={setWithdrawingAppId}
          />
        )}

        {/* TAB 3: SAVED JOBS */}
        {activeTab === "saved-jobs" && (
          <SavedJobsTab
            savedJobs={savedJobs}
            loading={dataLoading}
            toggleSaveJob={handleToggleSaveJob}
            handleTabSwitch={handleTabSwitch}
          />
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === "profile" && (
          <ProfileTab
            user={user}
            token={token}
            onProfileUpdated={handleProfileUpdated}
          />
        )}

        {/* TAB 5: NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <NotificationsTab
            notifications={notifications}
            loading={dataLoading}
            markNotificationAsRead={handleMarkNotificationRead}
            markAllNotificationsAsRead={handleMarkAllNotificationsRead}
          />
        )}
      </div>

      {/* MODAL: APPLICATION DETAIL */}
      <ApplicationDetailModal
        application={viewingApplicationModal}
        onClose={() => setViewingApplicationModal(null)}
      />

      {/* MODAL: WITHDRAW CONFIRMATION */}
      <WithdrawModal
        withdrawingAppId={withdrawingAppId}
        onClose={() => setWithdrawingAppId(null)}
        onConfirmWithdraw={handleConfirmWithdraw}
        submitting={withdrawSubmitting}
      />
    </div>
  );
}
