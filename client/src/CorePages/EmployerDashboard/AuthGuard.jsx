import React, { useState } from "react";
import { Lock, ChevronRight, ShieldAlert, Clock, Mail, RefreshCw, CheckCircle2, XCircle, Phone, Save, LogOut } from "lucide-react";

export default function AuthGuard({
  navigate,
  isPending,
  isRejected,
  isRestricted,
  requiresMobileNumber,
  isMobileSavedSuccess,
  onSaveMobile,
  onContinueToDashboard,
  onRefreshStatus,
  onLogout,
}) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [continuing, setContinuing] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleCheckStatus = async () => {
    if (onRefreshStatus) {
      setChecking(true);
      try {
        await onRefreshStatus();
      } finally {
        setChecking(false);
      }
    } else {
      window.location.reload();
    }
  };

  const handleContinue = async () => {
    setContinuing(true);
    try {
      if (onContinueToDashboard) {
        await onContinueToDashboard();
      } else if (onRefreshStatus) {
        await onRefreshStatus();
      } else {
        window.location.reload();
      }
    } finally {
      setContinuing(false);
    }
  };

  const handleSaveMobile = async (e) => {
    e.preventDefault();
    const cleaned = mobileNumber.replace(/\D/g, '');
    if (!cleaned || cleaned.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSaveMobile(cleaned);
    } catch (err) {
      setError(err.message || "Unable to save your mobile number. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (requiresMobileNumber) {
    if (isMobileSavedSuccess) {
      return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-6 pt-24 font-sans">
          <div className="max-w-md w-full bg-white border border-emerald-200 rounded-3xl p-8 text-center shadow-xl animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-6 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-3 inline-block">
              Verification in Progress
            </span>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Verification in Progress
            </h2>
            <p className="text-slate-800 text-sm font-semibold mb-2">
              Your mobile number has been added successfully.
            </p>
            <p className="text-slate-500 text-xs mb-6 leading-relaxed">
              Your employer profile is being updated. You can continue once verification is complete.
            </p>
            <button
              type="button"
              disabled={continuing}
              onClick={handleContinue}
              className="w-full bg-[#2B2A8C] hover:bg-[#1E1D66] text-white font-bold py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-75"
            >
              {continuing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying Account...
                </>
              ) : (
                <>
                  Continue to Employer Dashboard <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-6 pt-24 font-sans">
        <div className="max-w-md w-full bg-white border border-blue-200 rounded-3xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-6 shadow-sm">
            <Phone className="w-8 h-8" />
          </div>
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold uppercase tracking-wider mb-3 inline-block">
            Verification: Mobile Number Required
          </span>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Mobile Number Required
          </h2>
          <p className="text-slate-700 text-sm mb-2 font-medium">
            Your employer account has been approved, but your mobile number is not yet provided.
          </p>
          <p className="text-slate-500 text-xs mb-6 leading-relaxed">
            Please add your mobile number to complete verification and continue using the employer portal.
          </p>

          <form onSubmit={handleSaveMobile} className="space-y-4">
            <div className="text-left">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Mobile Number</label>
              <div className="flex items-center border border-slate-300 rounded-xl px-4 h-12 bg-white">
                <span className="text-slate-500 font-bold mr-2">+91</span>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full bg-transparent text-sm outline-none font-medium tracking-widest"
                  maxLength={10}
                  disabled={saving}
                  required
                />
              </div>
              {error && <p className="text-xs font-semibold text-red-500 mt-1.5">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#2B2A8C] hover:bg-[#1E1D66] disabled:bg-slate-300 text-white font-bold py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Add Mobile Number
                </>
              )}
            </button>
          </form>

          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={() => navigate("/contact")}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4" /> Contact Support
            </button>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-6 pt-24 font-sans">
        <div className="max-w-md w-full bg-white border border-amber-200 rounded-3xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-6 shadow-sm">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-3 inline-block">
            Verification in Progress
          </span>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Admin Approval Pending
          </h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Your employer account is pending Admin approval. Thank you for registering your organization!
            Your account is currently <strong>awaiting approval from the Raffles Administrator</strong>.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 text-left text-xs text-slate-600 space-y-2">
            <p className="font-bold text-slate-800">What happens next?</p>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 shrink-0" />
              <span>Admin reviews your organization credentials.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 size={14} className="text-emerald-600 mt-0.5 shrink-0" />
              <span>Upon approval, access to post jobs and search the student database will be unlocked automatically.</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              disabled={checking}
              onClick={handleCheckStatus}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${checking ? "animate-spin" : ""}`} />
              {checking ? "Checking Status..." : "Check Approval Status"}
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4" /> Contact Raffles Support
            </button>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-6 pt-24 font-sans">
        <div className="max-w-md w-full bg-white border border-rose-200 rounded-3xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center text-rose-600 mx-auto mb-6 shadow-sm">
            <XCircle className="w-8 h-8" />
          </div>
          <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold uppercase tracking-wider mb-3 inline-block">
            Registration Not Approved
          </span>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Employer Registration Rejected
          </h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Your employer account registration was not approved. Please reach out to RafflesJobs
            support if you believe this is a mistake or need further assistance.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/contact")}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Mail className="w-4 h-4" /> Contact RafflesJobs Support
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition text-sm cursor-pointer"
            >
              Return to Home Page
            </button>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isRestricted) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-6 pt-24 font-sans">
        <div className="max-w-md w-full bg-white border border-rose-200 rounded-3xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-center text-rose-600 mx-auto mb-6 shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Employer Access Revoked</h2>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Your employer access has been revoked. Please contact RafflesJobs support.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/contact")}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <Mail className="w-4 h-4" /> Contact Support Team
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition text-sm cursor-pointer"
            >
              Return to Home Page
            </button>
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold py-2.5 rounded-xl transition text-xs flex items-center justify-center gap-1.5 cursor-pointer mt-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-6 pt-24 font-sans">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 text-center shadow-xl">
        <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-[#2B2A8C] mx-auto mb-6 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Employer Access Only</h2>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          You must be logged in as a registered <strong>Employer</strong> account to access the recruiter dashboard and job management features.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-[#2B2A8C] hover:bg-[#1E1D66] text-white font-bold py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            Sign In as Employer <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition text-sm cursor-pointer"
          >
            Register Employer Account
          </button>
        </div>
      </div>
    </div>
  );
}

