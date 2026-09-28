import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

import LandingPage from "./CorePages/LandingPage";
import Navbar from "./CorePages/Navbar";
import Footer from "./CorePages/Footer";

// Code-split route components to keep the main initial bundle lightweight
const RoleSelectionPage = lazy(() => import("./CorePages/RoleSelectionPage"));
const RegisterPage = lazy(() => import("./CorePages/RegisterPage"));
const LoginPage = lazy(() => import("./CorePages/LoginPage"));
const OtpPage = lazy(() => import("./CorePages/OtpPage"));
const JobsPage = lazy(() => import("./CorePages/JobsPage"));
const JobSlugPage = lazy(() => import("./CorePages/JobSlugPage"));
const AboutPage = lazy(() => import("./CorePages/AboutPage"));
const ContactPage = lazy(() => import("./CorePages/ContactPage"));
const PrivacyPage = lazy(() => import("./CorePages/PrivacyPage"));
const PricingPage = lazy(() => import("./CorePages/PricingPage"));
const NotFoundPage = lazy(() => import("./CorePages/NotFoundPage"));

// Dashboards are code-split private routes marked noindex
const EmployerDashboard = lazy(() => import("./CorePages/EmployerDashboard"));
const JobSeekerDashboard = lazy(() => import("./CorePages/JobSeekerDashboard"));
const AdminDashboard = lazy(() => import("./CorePages/AdminDashboard"));

function DashboardFallback() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center pt-20">
      <div className="h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  // Pages that render their own header/footer chrome.
  const isStandalonePage =
    location.pathname === "/verify-otp" ||
    location.pathname === "/get-started";

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {!isStandalonePage && <Navbar />}
      <Suspense fallback={<DashboardFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* Legacy landing URL kept for old links; canonical points to / */}
          <Route path="/home" element={<LandingPage />} />
          {/* Role picker moved off the homepage */}
          <Route path="/get-started" element={<RoleSelectionPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:slug" element={<JobSlugPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/jobseeker-dashboard" element={<JobSeekerDashboard />} />
          <Route path="/job-seeker-dashboard" element={<JobSeekerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-otp" element={<OtpPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      {!isStandalonePage && <Footer />}
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
