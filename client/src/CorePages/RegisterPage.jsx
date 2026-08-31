import React, { useState,useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRightIcon, LockIcon, MailIcon, UserIcon } from 'lucide-react';
import { sendOtp } from '../Service/Operation/authApi';
import { showSuccess, showError } from '../Utils/toast';
import { AuthTemplate, RoleSelector, AuthInput } from '../Template';


export default function Register() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const [role, setRole] = useState('Job Seeker');
  
  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Input Changes
  const handleTextChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, agreeTerms: e.target.checked });
  };

  const handleContinue = async (e) => {
    e.preventDefault();

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
      const msg = 'You must agree to the Terms of Service and Privacy Guidelines.';
      setError(msg);
      showError(msg);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await sendOtp(formData.email);

      if (data.success) {
        showSuccess('OTP sent successfully!');
        // Redirect to separate verification page, passing the register form data in router state
        navigate('/verify-otp', {
          state: {
            username: formData.name,
            email: formData.email,
            password: formData.password,
            role: role
          }
        });
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
    <AuthTemplate role={role} onRoleChange={(newRole) => setRole(newRole)}>
      <div className="max-w-lg w-full mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1A1A1A]">Create Account</h2>
          <p className="text-sm text-gray-400 mt-1">Get started to search and unlock elite roles or hire top talent.</p>
        </div>

        {/* Dynamic Role Selector Component */}
        <RoleSelector 
          selectedRole={role} 
          onSelectRole={(newRole) => setRole(newRole)} 
        />

        {error && (
          <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-lg border border-red-100">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleContinue} className="space-y-4">
          {/* Input Interactive Fields */}
          <AuthInput
            label="Full Name"
            icon={UserIcon}
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleTextChange}
            required
          />

          <AuthInput
            label={role === 'Job Seeker' ? 'Personal Email' : 'Corporate Email ID'}
            icon={MailIcon}
            type="email"
            name="email"
            placeholder={role === 'Job Seeker' ? "name@gmail.com" : "name@company.com"}
            value={formData.email}
            onChange={handleTextChange}
            required
          />

          <AuthInput
            label="Password"
            icon={LockIcon}
            type="password"
            name="password"
            placeholder="Create a secure password"
            value={formData.password}
            onChange={handleTextChange}
            required
          />

          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium pt-2">
            <input 
              type="checkbox" 
              id="terms" 
              checked={formData.agreeTerms}
              onChange={handleCheckboxChange}
              className="rounded text-[#2B2A8C] focus:ring-[#2B2A8C] w-4 h-4" 
            />
            <label htmlFor="terms">I agree to the Terms of Service and Privacy Guidelines.</label>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#2B2A8C] hover:bg-[#1E1D66] disabled:bg-gray-300 text-white font-bold text-sm py-3.5 rounded-lg transition shadow-md flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            {loading ? 'Sending OTP...' : 'Continue Registration'} <ArrowRightIcon className="w-4 h-4" />
          </button>
        </form>

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