import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRightIcon, ArrowLeftIcon } from 'lucide-react';
import { sendOtp, register } from '../Service/Operation/authApi';
import { showSuccess, showError } from '../Utils/toast';
import { AuthTemplate } from '../Template';

export default function OtpPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get registration data passed from RegisterPage
  const registrationData = location.state || {};
  const { username, email, password, role } = registrationData;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(59);
  const [resendStatus, setResendStatus] = useState('');
  
  // References for OTP inputs to handle auto-focus
  const inputRefs = useRef([]);

  // Auto-redirect if email is missing (direct access)
  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  // Resend Timer Countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Focus next input box if value entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Focus previous input box on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5].focus();
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setResendStatus('Sending...');
    try {
      const data = await sendOtp(email);
      
      if (data.success) {
        showSuccess('OTP resent successfully!');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      const msg = 'Please enter the full 6-digit OTP';
      setError(msg);
      showError(msg);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await register(username, email, password, role, otpCode);

      if (data.success) {
        // Success: Store token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('auth-change'));
        
        // Show success alert and navigate
        showSuccess('Verification & Registration Successful!');
        navigate('/');
      } else {
        setError(data.message || 'Verification failed. Please try again.');
        showError(data.message || 'Verification failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Connection error. Please try again later.');
      showError(err.message || 'Connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthTemplate>
      <div className="max-w-md w-full mx-auto space-y-6">
        <button 
          onClick={() => navigate('/register')} 
          className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-700 transition cursor-pointer"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5" /> Back to registration
        </button>

        <div className="text-left">
          <h2 className="text-2xl font-bold font-['Lato'] text-[#1A1A1A]">Verify Your Identity</h2>
          <p className="text-sm text-gray-400 mt-1">
            We have sent a 6-digit verification code to <span className="font-semibold text-gray-700">{email}</span>.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-lg border border-red-100 text-left">
            ⚠️ {error}
          </div>
        )}

        {resendStatus && (
          <div className="bg-green-50 text-green-600 text-xs font-semibold p-3 rounded-lg border border-green-100 text-left">
            ✅ {resendStatus}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 6 OTP Input Cells */}
          <div className="flex justify-between items-center gap-2 my-4" onPaste={handlePaste}>
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)}
                className="w-12 h-12 border border-gray-300 rounded-lg text-center text-lg font-bold bg-white focus:border-[#2B2A8C] focus:ring-1 focus:ring-[#2B2A8C] outline-none transition shadow-sm"
                value={data}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>

          <div className="text-xs font-medium text-left flex justify-between items-center">
            <span className="text-gray-400">Didn't receive the verification code?</span>
            {resendTimer > 0 ? (
              <span className="text-gray-400 font-bold">Resend in 00:{resendTimer < 10 ? `0${resendTimer}` : resendTimer}</span>
            ) : (
              <button 
                type="button" 
                onClick={handleResendOtp}
                className="text-[#2B2A8C] hover:text-[#1E1D66] font-bold hover:underline cursor-pointer"
              >
                Resend OTP
              </button>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#2B2A8C] hover:bg-[#1E1D66] disabled:bg-gray-300 text-white font-bold text-sm py-3.5 rounded-lg transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Verifying...' : 'Verify & Register'} <ArrowRightIcon className="w-4 h-4" />
          </button>
        </form>
      </div>
    </AuthTemplate>
  );
}
