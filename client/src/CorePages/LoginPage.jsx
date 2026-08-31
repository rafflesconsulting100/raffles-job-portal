import React, { useState,useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MailIcon, LockIcon, ArrowRightIcon } from 'lucide-react';
import { login } from '../Service/Operation/authApi';
import { showSuccess, showError } from '../Utils/toast';
import { AuthTemplate, RoleSelector, AuthInput } from '../Template';

export default function SignIn() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const navigate = useNavigate();
  const [role, setRole] = useState('Job Seeker');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await login(formData.email, formData.password);

      if (data.success) {
        // Enforce role consistency
        if (data.user.role !== role) {
          const mismatchError = `Role Mismatch: This email is registered as a "${data.user.role}". Please switch roles above to log in.`;
          setError(mismatchError);
          showError(mismatchError);
          setLoading(false);
          return;
        }

        // Store Token & User Profile
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('auth-change'));

        showSuccess('Login Successful!');
        if (data.user.role === 'Employer') {
          navigate('/employer-dashboard');
        } else {
          navigate('/jobseeker-dashboard');
        }
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
        showError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Connection error. Please check your backend server status.');
      showError(err.message || 'Connection error. Please check your backend server status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthTemplate role={role} onRoleChange={(newRole) => { setRole(newRole); setError(''); }}>
      <form onSubmit={handleSubmit} className="max-w-lg w-full mx-auto space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-[#1A1A1A]">Welcome back</h2>
          <p className="text-sm text-gray-400 mt-1">Enter your credentials to access your portal.</p>
        </div>

        {/* Role Selector Tabs */}
        <RoleSelector
          selectedRole={role}
          onSelectRole={(newRole) => {
            setRole(newRole);
            setError('');
          }}
        />

        {error && (
          <div className="bg-red-50 text-red-600 text-xs font-semibold p-3 rounded-lg border border-red-100">
            ⚠️ {error}
          </div>
        )}

        {/* Text Inputs Panel */}
        <div className="space-y-4">
          <AuthInput
            label={role === 'Job Seeker' ? 'Email ID' : 'Corporate Email ID'}
            icon={MailIcon}
            type="email"
            name="email"
            placeholder={role === 'Job Seeker' ? "name@gmail.com" : "name@company.com"}
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <AuthInput
            label="Password"
            rightLabelAction={
              <span className="text-xs font-semibold text-[#2B2A8C] hover:underline cursor-pointer">
                Forgot password?
              </span>
            }
            icon={LockIcon}
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Quick Retention Options */}
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleInputChange}
            className="rounded text-[#2B2A8C] focus:ring-[#2B2A8C] w-4 h-4"
          />
          <label htmlFor="rememberMe">Keep me signed in for 30 days</label>
        </div>

        {/* Authentication Launch Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#2B2A8C] hover:bg-[#1E1D66] disabled:bg-gray-300 text-white font-bold text-sm py-3.5 rounded-lg transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? 'Logging in...' : 'Login to Portal'} <ArrowRightIcon className="w-4 h-4" />
        </button>

        <div className="text-xs text-center text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#2B2A8C] font-bold hover:underline">
            Register here
          </Link>
        </div>
      </form>
    </AuthTemplate>
  );
}