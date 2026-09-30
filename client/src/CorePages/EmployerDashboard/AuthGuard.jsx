import React, { useState } from "react";
import { Lock, ChevronRight, ShieldAlert, Clock, Mail, RefreshCw, CheckCircle2, XCircle, Phone, Save, LogOut } from "lucide-react";

function formatPhoneNumber(val) {
  if (!val) return "";
  const str = String(val).trim();
  if (str.startsWith("+91") && str.length === 13) {
    return `+91 ${str.slice(3, 8)} ${str.slice(8)}`;
  }
  if (str.length === 10) {
    return `+91 ${str.slice(0, 5)} ${str.slice(5)}`;
  }
  return str;
}

export default function AuthGuard({
  navigate,
  isPending,
  isRejected,
  isRestricted,
  requiresMobileNumber,
  hasMobile,
  userMobile,
  isMobileSavedSuccess,
  onSaveMobile,
  onContinueToDashboard,
  onRefreshStatus,
  onLogout,
}) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [isEditingMobile, setIsEditingMobile] = useState(false);
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
    if (e && e.preventDefault) e.preventDefault();
    const cleaned = mobileNumber.replace(/\D/g, '');
    if (!cleaned || cleaned.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return false;
    }
    setSaving(true);
    setError("");
    try {
      await onSaveMobile(cleaned);
      return true;
    } catch (err) {
      setError(err.message || "Unable to save your mobile number. Please try again.");
      return false;
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
              Mobile Number Added
            </span>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Mobile Number Added
            </h2>
            <p className="text-slate-800 text-sm font-semibold mb-2">
              Your mobile number has been added successfully.
            </p>
            <p className="text-slate-500 text-xs mb-6 leading-relaxed">
              Your employer profile has been completed. You can now proceed to your employer dashboard.
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
                  Loading Dashboard...
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
            Mobile Number Required
          </span>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            Mobile Number Required
          </h2>
          <p className="text-slate-700 text-sm mb-2 font-medium">
            Your employer account has been approved. Please add your mobile number to complete your profile.
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
                  onChange={(e) => {
                    setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                    if (error) setError("");
                  }}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full bg-transparent text-sm outline-none font-medium tracking-widest"
                  maxLength={10}
                  disabled={saving}
                  required
                />
              </div>
              {error && (
                <div className="mt-1.5 space-y-1">
                  <p className="text-xs font-semibold text-red-500">{error}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileNumber("");
                      setError("");
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 underline font-semibold cursor-pointer"
                  >
                    Use a Different Number
                  </button>
                </div>
              )}
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
    if (isMobileSavedSuccess) {
      return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-6 pt-24 font-sans">
          <div className="max-w-md w-full bg-white border border-emerald-200 rounded-3xl p-8 text-center shadow-xl animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-6 shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-3 inline-block">
              Awaiting Admin Approval
            </span>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Mobile Number Added
            </h2>
            <p className="text-slate-800 text-sm font-semibold mb-2">
              Your mobile number has been added successfully.
            </p>
            <p className="text-slate-500 text-xs mb-6 leading-relaxed">
              Your employer account is still awaiting Admin approval. Admin approval is required before portal access is granted.
            </p>

            {/* Account Details Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4 text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-500 font-medium block text-[11px]">Mobile:</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm mt-0.5">
                    <Phone size={13} className="text-emerald-600" />
                    {formatPhoneNumber(userMobile || mobileNumber)}
                  </span>
                </div>
                {!isEditingMobile && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingMobile(true);
                      setMobileNumber("");
                      setError("");
                    }}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    Change Mobile Number
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between border-t border-slate-200/60 pt-2">
                <span className="text-slate-500 font-medium">Status:</span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  AWAITING ADMIN APPROVAL
                </span>
              </div>
            </div>

            {/* Change Mobile Form when clicked */}
            {isEditingMobile && (
              <div className="border border-blue-200 bg-blue-50/50 rounded-2xl p-4 mb-6 text-left">
                <h4 className="text-xs font-bold text-slate-800 mb-1">Change Mobile Number</h4>
                <p className="text-[11px] text-slate-500 mb-3">Enter the new mobile number for your organization.</p>
                <form
                  onSubmit={async (e) => {
                    const ok = await handleSaveMobile(e);
                    if (ok) {
                      setIsEditingMobile(false);
                      setMobileNumber("");
                    }
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">New Mobile Number</label>
                    <div className="flex items-center border border-slate-300 rounded-xl px-3.5 h-11 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                      <span className="text-slate-500 font-bold mr-2 text-xs">+91</span>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => {
                          setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                          if (error) setError("");
                        }}
                        placeholder="Enter 10-digit mobile number"
                        className="w-full bg-transparent text-sm outline-none font-medium tracking-wider"
                        maxLength={10}
                        disabled={saving}
                        required
                        autoFocus
                      />
                    </div>
                    {error && (
                      <div className="mt-1.5 space-y-1">
                        <p className="text-xs font-semibold text-red-500">{error}</p>
                        <button
                          type="button"
                          onClick={() => {
                            setMobileNumber("");
                            setError("");
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 underline font-semibold cursor-pointer"
                        >
                          Use a Different Number
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-[#2B2A8C] hover:bg-[#1E1D66] disabled:bg-slate-300 text-white font-bold py-2.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-xs cursor-pointer"
                    >
                      {saving ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          Save New Number
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => {
                        setIsEditingMobile(false);
                        setError("");
                        setMobileNumber("");
                      }}
                      className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

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

    if (hasMobile) {
      return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-6 pt-24 font-sans">
          <div className="max-w-md w-full bg-white border border-amber-200 rounded-3xl p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-6 shadow-sm">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-3 inline-block">
              Awaiting Admin Approval
            </span>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Admin Approval Pending
            </h2>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              Your employer account is pending Admin approval. Thank you for registering your organization!
              Your account is currently <strong>awaiting approval from the Raffles Administrator</strong>.
            </p>

            {/* Mobile Already Saved Box */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 mb-4 text-left text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-600 font-medium block text-[11px]">Mobile:</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm mt-0.5">
                    <Phone size={13} className="text-emerald-600" />
                    {formatPhoneNumber(userMobile)}
                  </span>
                </div>
                {!isEditingMobile && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingMobile(true);
                      setMobileNumber("");
                      setError("");
                    }}
                    className="px-2.5 py-1.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    Change Mobile Number
                  </button>
                )}
              </div>
              <p className="text-emerald-800 text-[11px] font-medium pt-1 border-t border-emerald-200/60">
                Your mobile number has been added. Your account is still awaiting Admin approval.
              </p>
            </div>

            {/* Change Mobile Form when clicked */}
            {isEditingMobile && (
              <div className="border border-blue-200 bg-blue-50/50 rounded-2xl p-4 mb-4 text-left">
                <h4 className="text-xs font-bold text-slate-800 mb-1">Change Mobile Number</h4>
                <p className="text-[11px] text-slate-500 mb-3">Enter the new mobile number for your organization.</p>
                <form
                  onSubmit={async (e) => {
                    const ok = await handleSaveMobile(e);
                    if (ok) {
                      setIsEditingMobile(false);
                      setMobileNumber("");
                    }
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">New Mobile Number</label>
                    <div className="flex items-center border border-slate-300 rounded-xl px-3.5 h-11 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                      <span className="text-slate-500 font-bold mr-2 text-xs">+91</span>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => {
                          setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                          if (error) setError("");
                        }}
                        placeholder="Enter 10-digit mobile number"
                        className="w-full bg-transparent text-sm outline-none font-medium tracking-wider"
                        maxLength={10}
                        disabled={saving}
                        required
                        autoFocus
                      />
                    </div>
                    {error && (
                      <div className="mt-1.5 space-y-1">
                        <p className="text-xs font-semibold text-red-500">{error}</p>
                        <button
                          type="button"
                          onClick={() => {
                            setMobileNumber("");
                            setError("");
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 underline font-semibold cursor-pointer"
                        >
                          Use a Different Number
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-[#2B2A8C] hover:bg-[#1E1D66] disabled:bg-slate-300 text-white font-bold py-2.5 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-xs cursor-pointer"
                    >
                      {saving ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          Save New Number
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => {
                        setIsEditingMobile(false);
                        setError("");
                        setMobileNumber("");
                      }}
                      className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

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

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col items-center justify-center p-6 pt-24 font-sans">
        <div className="max-w-md w-full bg-white border border-amber-200 rounded-3xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center text-amber-600 mx-auto mb-6 shadow-sm">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider mb-3 inline-block">
            Awaiting Admin Approval
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
              <span>Upon approval, access to the employer portal will be unlocked.</span>
            </div>
          </div>

          {/* Section: Complete Your Employer Profile */}
          <div className="border border-blue-200 bg-blue-50/40 rounded-2xl p-5 mb-6 text-left">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Phone size={15} className="text-blue-600" />
              Complete Your Employer Profile
            </h3>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Your mobile number has not been provided yet. You can add your mobile number while your account is awaiting Admin approval.
            </p>

            <form onSubmit={handleSaveMobile} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile Number</label>
                <div className="flex items-center border border-slate-300 rounded-xl px-3.5 h-11 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <span className="text-slate-500 font-bold mr-2 text-xs">+91</span>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => {
                      setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
                      if (error) setError("");
                    }}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full bg-transparent text-sm outline-none font-medium tracking-wider"
                    maxLength={10}
                    disabled={saving}
                    required
                  />
                </div>
                {error && (
                  <div className="mt-1.5 space-y-1">
                    <p className="text-xs font-semibold text-red-500">{error}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setMobileNumber("");
                        setError("");
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 underline font-semibold cursor-pointer"
                    >
                      Use a Different Number
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#2B2A8C] hover:bg-[#1E1D66] disabled:bg-slate-300 text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 text-sm cursor-pointer"
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

            <p className="text-[11px] text-slate-500 mt-2.5 leading-normal">
              <strong>Note:</strong> Adding your mobile number does not approve your account. Admin approval is still required before portal access is granted.
            </p>
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

