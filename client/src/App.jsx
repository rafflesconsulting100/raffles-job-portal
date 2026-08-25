import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

import RoleSelectionPage from "./CorePages/RoleSelectionPage";
import LandingPage from "./CorePages/LandingPage";
import RegisterPage from "./CorePages/RegisterPage";
import LoginPage from "./CorePages/LoginPage";
import OtpPage from "./CorePages/OtpPage";
import JobsPage from "./CorePages/JobsPage";
import AboutPage from "./CorePages/AboutPage";
import ContactPage from "./CorePages/ContactPage";
import EmployerDashboard from "./CorePages/EmployerDashboard";
import JobSeekerDashboard from "./CorePages/JobSeekerDashboard";
import AdminDashboard from "./CorePages/AdminDashboard";
import Navbar from "./CorePages/Navbar";
import Footer from "./CorePages/Footer";

function AppContent() {
  const location = useLocation();
  const isRoleSelectionPage = location.pathname === "/";

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {!isRoleSelectionPage && <Navbar />}
      <Routes>
        <Route path="/" element={<RoleSelectionPage />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/employer-dashboard" element={<EmployerDashboard />} />
        <Route path="/jobseeker-dashboard" element={<JobSeekerDashboard />} />
        <Route path="/job-seeker-dashboard" element={<JobSeekerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<OtpPage />} />
      </Routes>
      {!isRoleSelectionPage && <Footer />}
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;