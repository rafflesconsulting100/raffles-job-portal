import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  ShieldCheck,
  FileText,
  UploadCloud,
  ArrowRight,
  ArrowLeft,
  Mail,
  RefreshCw,
  X,
  FileCheck,
  Sparkles,
  AlertCircle,
  Building2,
  Briefcase
} from 'lucide-react';
import { sendOtp, register } from '../Service/Operation/authApi';
import { updateUserProfile } from '../Service/Operation/seekerApi';
import { showSuccess, showError } from '../Utils/toast';
import logo from '../assets/rafflelogo.png';

export default function OtpPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get registration data passed from RegisterPage
  const registrationData = location.state || {};
  const { username, email, password, role = 'Job Seeker' } = registrationData;

  // Flow Step: 2 = Email OTP Verification, 3 = Resume Upload (Job Seeker only)
  const [currentStep, setCurrentStep] = useState(2);

  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(59);
  const [resendStatus, setResendStatus] = useState('');
  const inputRefs = useRef([]);

  // Auth Session State (populated after OTP verification)
  const [authToken, setAuthToken] = useState('');
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  // Resume Upload State for Step 3
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Auto-redirect if email is missing (direct access without registration flow)
  useEffect(() => {
    if (!email && currentStep === 2) {
      navigate('/register');
    }
  }, [email, currentStep, navigate]);

  // Resend Timer Countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (currentStep === 2 && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [currentStep]);

  // Handle OTP digit changes
  const handleOtpChange = (value, index) => {
    // Only accept numbers
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue && value !== '') return;

    const newOtp = [...otp];
    newOtp[index] = cleanValue ? cleanValue.slice(-1) : '';
    setOtp(newOtp);
    setError('');

    // Auto-focus next input box
    if (cleanValue && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste full 6-digit OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/\D/g, '');
    if (pastedData.length > 0) {
      const digits = pastedData.slice(0, 6).split('');
      const newOtp = ['', '', '', '', '', ''];
      digits.forEach((digit, i) => {
        if (i < 6) newOtp[i] = digit;
      });
      setOtp(newOtp);
      const nextFocusIndex = Math.min(digits.length, 5);
      if (inputRefs.current[nextFocusIndex]) {
        inputRefs.current[nextFocusIndex].focus();
      }
    }
  };

  // Resend OTP code
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setResendStatus('Sending code...');
    try {
      const data = await sendOtp(email);

      if (data.success) {
        showSuccess('Verification code resent to your email!');
        setResendStatus('OTP Resent successfully!');
        setResendTimer(59);
        setError('');
      } else {
        showError(data.message || 'Failed to resend OTP');
        setError(data.message || 'Failed to resend OTP');
        setResendStatus('');
      }
    } catch (err) {
      showError(err.message || 'Connection error. Could not resend OTP.');
      setError(err.message || 'Connection error. Could not resend OTP.');
      setResendStatus('');
    }
  };

  // Step 2: Verify OTP & Register Account
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      const msg = 'Please enter the complete 6-digit verification code.';
      setError(msg);
      showError(msg);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await register(username, email, password, role, otpCode);

      if (data.success) {
        // Store authenticated session
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('auth-change'));

        setAuthToken(data.token);
        setAuthenticatedUser(data.user);

        showSuccess('Email verified & account created successfully!');

        // If user is a Job Seeker -> Move to Step 3 (Resume Upload Page)
        // If user is an Employer -> Go directly to Employer Dashboard
        if (role === 'Job Seeker' || role === 'job seeker') {
          setCurrentStep(3);
        } else {
          navigate('/employer-dashboard');
        }
      } else {
        setError(data.message || 'Invalid verification code. Please try again.');
        showError(data.message || 'Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code and try again.');
      showError(err.message || 'Verification failed. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Handle Resume File Selection & Drag-and-Drop
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    if (!file) return;

    // Validate format (.pdf, .doc, .docx)
    const validExtensions = ['pdf', 'doc', 'docx'];
    const fileExt = file.name.split('.').pop().toLowerCase();
    if (!validExtensions.includes(fileExt)) {
      showError('Please select a valid document (PDF, DOC, or DOCX).');
      return;
    }

    // Validate size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showError('File size exceeds 10MB limit. Please upload a smaller file.');
      return;
    }

    setResumeFile(file);
    setError('');
  };

  // Step 3: Upload Resume to Cloud & Complete Onboarding
  const handleUploadResume = async () => {
    if (!resumeFile) {
      showError('Please select a resume file or click "Skip for now".');
      return;
    }

    setUploadingResume(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);

      const token = authToken || localStorage.getItem('token');
      const res = await updateUserProfile(formData, token);

      if (res && res.success) {
        if (res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
          window.dispatchEvent(new Event('auth-change'));
        }

        showSuccess('Resume uploaded to your profile! Welcome aboard.');
        navigate('/jobseeker-dashboard');
      } else {
        showError(res.message || 'Failed to upload resume. You can try again from your dashboard.');
        navigate('/jobseeker-dashboard');
      }
    } catch (err) {
      showError(err.message || 'Upload failed. You can upload your resume anytime from your dashboard.');
      navigate('/jobseeker-dashboard');
    } finally {
      setUploadingResume(false);
    }
  };

  // Step 3: Skip Resume Step
  const handleSkipResume = () => {
    showSuccess('Welcome to Raffles Job Portal!');
    navigate('/jobseeker-dashboard');
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-white to-blue-50/40 text-[#1E293B] flex flex-col justify-between selection:bg-[#2563EB] selection:text-white font-sans py-8 px-4 sm:px-6 lg:px-8">
      
      {/* 1. TOP BRAND HEADER */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2 group">
          <img
            src={logo}
            alt="Raffles Consulting"
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="leading-none text-left">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#2B2A8C]">
              raffles
            </h1>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
              Job Portal
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <span>Need help?</span>
          <Link to="/contact" className="text-[#2563EB] hover:underline font-extrabold">
            Contact Support
          </Link>
        </div>
      </header>

      {/* 2. MAIN CONTAINER & 3-STEP TIMELINE */}
      <main className="flex-1 flex flex-col items-center justify-center my-8">
        <div className="max-w-xl w-full mx-auto space-y-8">
          
          {/* STEP PROGRESS TIMELINE */}
          <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between relative">
              
              {/* Timeline Connecting Line */}
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-100 z-0">
                <div
                  className="h-full bg-linear-to-r from-emerald-500 to-[#2563EB] transition-all duration-500"
                  style={{
                    width: currentStep === 2 ? '50%' : '100%',
                  }}
                />
              </div>

              {/* Step 1: Registration Complete */}
              <div className="flex flex-col items-center gap-1.5 relative z-10">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-500/25">
                  <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-emerald-700 text-center">
                  1. Registered
                </span>
              </div>

              {/* Step 2: Email Verification (OTP) */}
              <div className="flex flex-col items-center gap-1.5 relative z-10">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    currentStep > 2
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25'
                      : 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/30 ring-4 ring-blue-100'
                  }`}
                >
                  {currentStep > 2 ? (
                    <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <ShieldCheck className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`text-[11px] sm:text-xs font-bold text-center ${
                    currentStep === 2 ? 'text-[#2563EB] font-black' : 'text-emerald-700'
                  }`}
                >
                  2. Verify OTP
                </span>
              </div>

              {/* Step 3: Resume Setup */}
              <div className="flex flex-col items-center gap-1.5 relative z-10">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    currentStep === 3
                      ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-600/30 ring-4 ring-blue-100'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  <UploadCloud className="w-5 h-5" />
                </div>
                <span
                  className={`text-[11px] sm:text-xs font-bold text-center ${
                    currentStep === 3 ? 'text-[#2563EB] font-black' : 'text-slate-400'
                  }`}
                >
                  3. Resume Setup
                </span>
              </div>

            </div>
          </div>

          {/* ======================================================== */}
          {/* STEP 2 CONTENT: EMAIL OTP VERIFICATION FORM */}
          {/* ======================================================== */}
          {currentStep === 2 && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
              
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto mb-3 shadow-inner border border-blue-100">
                  <Mail className="w-6 h-6" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Verify Your Email Address
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  We've sent a 6-digit verification code to{' '}
                  <span className="font-extrabold text-slate-900">{email}</span>
                </p>
                <button
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline cursor-pointer pt-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Change email address
                </button>
              </div>

              {/* Error Alert Box */}
              {error && (
                <div className="bg-rose-50 text-rose-700 text-xs font-bold p-3.5 rounded-2xl border border-rose-200 text-left flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Resend Success Message */}
              {resendStatus && (
                <div className="bg-emerald-50 text-emerald-700 text-xs font-bold p-3.5 rounded-2xl border border-emerald-200 text-left flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{resendStatus}</span>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* 6 OTP Input Cells */}
                <div
                  className="flex justify-center items-center gap-2 sm:gap-3 my-4"
                  onPaste={handlePaste}
                >
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength="1"
                      ref={(el) => (inputRefs.current[index] = el)}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onFocus={(e) => e.target.select()}
                      className="w-11 h-13 sm:w-13 sm:h-15 border-2 border-slate-200 rounded-2xl text-center text-xl sm:text-2xl font-black bg-slate-50/60 text-slate-900 focus:bg-white focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-200 shadow-2xs"
                    />
                  ))}
                </div>

                {/* Resend Countdown & Trigger */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold text-slate-500 pt-1">
                  <span>Didn't receive the code?</span>
                  {resendTimer > 0 ? (
                    <span className="text-slate-500 font-extrabold bg-slate-100 px-3 py-1 rounded-full">
                      Resend in 00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-[#2563EB] hover:text-[#1D4ED8] font-black hover:underline cursor-pointer flex items-center gap-1.5 active:scale-95"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Resend Code Now
                    </button>
                  )}
                </div>

                {/* Submit Verification Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-linear-to-r from-[#2563EB] to-[#2B2A8C] hover:from-[#1D4ED8] hover:to-[#1E1D66] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold text-sm sm:text-base py-4 rounded-2xl transition-all duration-200 shadow-md shadow-blue-500/25 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Verifying & Registering...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Verify & Continue <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>
              </form>

              {/* Account Security Note */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-slate-400 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Encrypted & Secured Account Verification</span>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3 CONTENT: CANDIDATE RESUME UPLOAD PAGE */}
          {/* ======================================================== */}
          {currentStep === 3 && (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">
              
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner border border-emerald-100">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Upload Your Resume
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Candidates with a verified uploaded resume receive{' '}
                  <strong className="text-[#2563EB]">3x more interview calls</strong> from top recruiters.
                </p>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />

              {/* Drag & Drop Upload Container */}
              {!resumeFile ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 transition-all duration-200 flex flex-col items-center justify-center gap-3 cursor-pointer group ${
                    isDragOver
                      ? 'border-[#2563EB] bg-blue-50/50 scale-102'
                      : 'border-slate-300 hover:border-[#2563EB] hover:bg-slate-50/80 bg-slate-50/40'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-100/70 text-[#2563EB] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-7 h-7" />
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm sm:text-base font-extrabold text-slate-900">
                      Drag and drop your resume file here
                    </p>
                    <p className="text-xs font-bold text-slate-500">
                      or <span className="text-[#2563EB] underline">browse files</span> from your device
                    </p>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-400">
                    Supported formats: PDF, DOC, DOCX (Max size: 10MB)
                  </span>
                </div>
              ) : (
                /* Selected File Preview Box */
                <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 text-left">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-white border border-blue-200 text-[#2563EB] flex items-center justify-center shrink-0 shadow-xs">
                      <FileCheck className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-900 truncate">
                        {resumeFile.name}
                      </p>
                      <p className="text-xs text-slate-500 font-bold">
                        {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setResumeFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition cursor-pointer"
                    title="Remove file"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* Action Buttons: Upload vs Skip */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleUploadResume}
                  disabled={uploadingResume || !resumeFile}
                  className="w-full bg-linear-to-r from-[#2563EB] to-[#2B2A8C] hover:from-[#1D4ED8] hover:to-[#1E1D66] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-extrabold text-sm sm:text-base py-4 rounded-2xl transition-all duration-200 shadow-md shadow-blue-500/25 hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  {uploadingResume ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Uploading Resume to Cloud...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Upload Resume & Go to Dashboard <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSkipResume}
                  className="w-full py-3 text-xs sm:text-sm font-extrabold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                >
                  Skip for now, I'll upload later
                </button>
              </div>

              {/* Perks Highlights Footer */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-left text-xs font-bold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Free Cloud Hosting</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified Recruiter Access</span>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* 3. FOOTER */}
      <footer className="text-center text-xs text-slate-400 font-medium py-4">
        © 2026 Raffles Consulting. All Rights Reserved. • Powered by Raffles Job Portal
      </footer>

    </div>
  );
}
