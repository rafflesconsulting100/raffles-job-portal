import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRightIcon, LockIcon, MailIcon, PhoneIcon, UserIcon, Building2 } from 'lucide-react';
import { sendOtp } from '../Service/Operation/authApi';
import { showSuccess, showError } from '../Utils/toast';
import { normalizeMobileNumber } from '../Utils/validation';
import { AuthTemplate, RoleSelector, AuthInput, GoogleLoginButton } from '../Template';

import useSeo from '../Utils/useSeo';

export default function Register() {
  useSeo({ path: '/register' });
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const [role, setRole] = useState('Job Seeker');
  const isEmployerRole = role === 'Employer';

  // Form States
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Handle Input Changes
  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (fieldErrors[e.target.name]) {
      setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    }
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, agreeTerms: e.target.checked });
    if (fieldErrors.agreeTerms) {
      setFieldErrors({ ...fieldErrors, agreeTerms: '' });
    }
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setFieldErrors({});
    setError('');
  };

  const handleContinue = async (e) => {
    e.preventDefault();

    if (isEmployerRole) {
      // Field-level validation for Employer registration
      const errs = {};

      if (!formData.companyName || !formData.companyName.trim()) {
        errs.companyName = 'Company name is required.';
      }

      if (!formData.name || !formData.name.trim()) {
        errs.name = 'Contact person name is required.';
      }

      if (!formData.mobileNumber || !formData.mobileNumber.trim()) {
        errs.mobileNumber = 'Mobile number is required.';
      } else if (!normalizeMobileNumber(formData.mobileNumber)) {
        errs.mobileNumber = 'Enter a valid 10-digit mobile number or +91XXXXXXXXXX.';
      }

      if (!formData.email || !formData.email.trim()) {
        errs.email = 'Email is required.';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        errs.email = 'Please enter a valid email address.';
      }

      if (!formData.password) {
        errs.password = 'Password is required.';
      } else if (formData.password.length < 6) {
        errs.password = 'Password must be at least 6 characters.';
      }

      if (!formData.confirmPassword) {
        errs.confirmPassword = 'Please confirm your password.';
      } else if (formData.confirmPassword !== formData.password) {
        errs.confirmPassword = 'Passwords do not match.';
      }

      if (!formData.agreeTerms) {
        errs.agreeTerms = 'You must agree to the Terms & Conditions and Privacy Policy.';
      }

      setFieldErrors(errs);

      if (Object.keys(errs).length > 0) {
        const firstMessage = Object.values(errs)[0];
        setError(firstMessage);
        showError(firstMessage);
        return;
      }

      setError('');
    } else {
      if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
        const msg = 'Please fill in all fields.';
        setError(msg);
        showError(msg);
        return;
      }

      if (formData.password.length < 6) {
        const msg = 'Password must be at least 6 characters.';
        setError(msg);
        showError(msg);
        return;
      }

      if (!formData.agreeTerms) {
        const msg = 'You must agree to the Terms & Conditions and Privacy Policy.';
        setError(msg);
        showError(msg);
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const data = await sendOtp(formData.email.trim());

      if (data.success) {
        showSuccess('OTP sent successfully!');
        // Redirect to separate verification page, passing the register form
        // data in router state. Router state is lost on a page refresh, so a
        // copy is kept in sessionStorage for the OTP page to fall back on.
        const companyNameVal = formData.companyName.trim() || formData.name.trim();
        const usernameVal = formData.name.trim() || formData.companyName.trim();
        const pendingRegistration = {
          username: usernameVal,
          companyName: companyNameVal,
          email: formData.email.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          mobileNumber: formData.mobileNumber.trim(),
          acceptedTerms: formData.agreeTerms,
          role: role,
        };
        sessionStorage.setItem(
          'raffles.pendingRegistration',
          JSON.stringify({ savedAt: Date.now(), data: pendingRegistration })
        );
        navigate('/verify-otp', { state: pendingRegistration });
      } else {
        setError(data.message || 'Could not send OTP. Please try again.');
        showError(data.message || 'Could not send OTP. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Connection error. Please check your backend server status.');
      showError(err.message || 'Connection error. Please check your backend server status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthTemplate role={role} onRoleChange={handleRoleChange}>
      <div className="max-w-lg w-full mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1A1A1A]">Create Account</h2>
          <p className="text-sm text-gray-400 mt-1">Get started to search and unlock elite roles or hire top talent.</p>
        </div>

        {/* Dynamic Role Selector Component */}
        <RoleSelector 
          selectedRole={role} 
          onSelectRole={handleRoleChange} 
        />

        {error && (
          <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-lg border border-red-100">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleContinue} className="space-y-4">
          {/* Input Interactive Fields */}
          {isEmployerRole ? (
            <>
              <AuthInput
                label="Company Name"
                icon={Building2}
                type="text"
                name="companyName"
                placeholder="Enter your company name"
                value={formData.companyName}
                onChange={handleTextChange}
                error={fieldErrors.companyName}
                required
              />

              <AuthInput
                label="Contact Person Name"
                icon={UserIcon}
                type="text"
                name="name"
                placeholder="Enter contact person name"
                value={formData.name}
                onChange={handleTextChange}
                error={fieldErrors.name}
                required
              />

              <AuthInput
                label="Mobile Number"
                icon={PhoneIcon}
                type="tel"
                name="mobileNumber"
                prefix="+91"
                placeholder="Enter mobile number"
                value={formData.mobileNumber}
                onChange={handleTextChange}
                error={fieldErrors.mobileNumber}
                required
              />

              <AuthInput
                label="Corporate Email ID"
                icon={MailIcon}
                type="email"
                name="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={handleTextChange}
                error={fieldErrors.email}
                required
              />
            </>
          ) : (
            <>
              <AuthInput
                label="Full Name"
                icon={UserIcon}
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleTextChange}
                error={fieldErrors.name}
                required
              />

              <AuthInput
                label="Personal Email"
                icon={MailIcon}
                type="email"
                name="email"
                placeholder="name@gmail.com"
                value={formData.email}
                onChange={handleTextChange}
                error={fieldErrors.email}
                required
              />
            </>
          )}

          <AuthInput
            label="Password"
            icon={LockIcon}
            type="password"
            name="password"
            placeholder="Create a secure password"
            value={formData.password}
            onChange={handleTextChange}
            error={fieldErrors.password}
            required
          />

          {isEmployerRole && (
            <AuthInput
              label="Confirm Password"
              icon={LockIcon}
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleTextChange}
              error={fieldErrors.confirmPassword}
              required
            />
          )}

          <div className="pt-2">
            <div className="flex items-start gap-2 text-xs text-gray-500 font-medium">
              <input 
                type="checkbox" 
                id="terms" 
                checked={formData.agreeTerms}
                onChange={handleCheckboxChange}
                className="rounded text-[#2B2A8C] focus:ring-[#2B2A8C] w-4 h-4 mt-0.5 cursor-pointer" 
              />
              <label htmlFor="terms" className="cursor-pointer">
                I agree to the Terms &amp; Conditions and Privacy Policy.
              </label>
            </div>
            {fieldErrors.agreeTerms && (
              <p className="text-xs font-semibold text-red-500 mt-1.5 ml-6">{fieldErrors.agreeTerms}</p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#2B2A8C] hover:bg-[#1E1D66] disabled:bg-gray-300 text-white font-bold text-sm py-3.5 rounded-lg transition shadow-md flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            {loading ? 'Sending OTP...' : (isEmployerRole ? 'Register' : 'Continue Registration')} <ArrowRightIcon className="w-4 h-4" />
          </button>
        </form>

        {role === 'Job Seeker' && <GoogleLoginButton mode="register" />}

        <div className="text-xs text-center text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-[#2B2A8C] font-bold hover:underline">
            Login here
          </Link>
        </div>
      </div>
    </AuthTemplate>
  );
}
