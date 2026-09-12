import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { signInWithGooglePopup } from '../config/firebase';
import { googleLogin, googleRegister } from '../Service/Operation/authApi';
import { showSuccess, showError } from '../Utils/toast';

export default function GoogleLoginButton({ mode = 'login' }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState('');

  const isRegister = mode === 'register';

  const handleGoogle = async () => {
    if (!acceptedTerms) {
      setTermsError('Please agree to the Terms & Conditions and Privacy Policy to continue.');
      return;
    }

    if (loading) return;
    setLoading(true);
    setTermsError('');

    try {
      const { user } = await signInWithGooglePopup();

      const data = isRegister
        ? await googleRegister(user.uid, user.email, user.displayName, user.photoURL, user.emailVerified)
        : await googleLogin(user.uid, user.email, user.displayName, user.photoURL, user.emailVerified);

      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('auth-change'));

        showSuccess(isRegister ? 'Account created with Google successfully!' : 'Signed in with Google successfully!');
        navigate('/jobseeker-dashboard');
      } else {
        showError(data.message || `Google ${isRegister ? 'Registration' : 'Login'} failed. Please try again.`);
      }
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        showError('Google sign-in was closed before completing.');
      } else if (error.code === 'auth/popup-blocked') {
        showError('Popup was blocked by your browser. Please allow popups for this site.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        showError('Google sign-in was cancelled.');
      } else if (error.code === 'auth/network-request-failed') {
        showError('Network error. Please check your connection and try again.');
      } else if (error.message) {
        showError(error.message);
      } else {
        showError(`Google ${isRegister ? 'Registration' : 'Login'} failed. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">or continue with</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
        <input
          type="checkbox"
          id="googleTerms"
          checked={acceptedTerms}
          onChange={(e) => {
            setAcceptedTerms(e.target.checked);
            if (e.target.checked) setTermsError('');
          }}
          className="rounded text-[#2B2A8C] focus:ring-[#2B2A8C] w-4 h-4"
        />
        <label htmlFor="googleTerms">
          I agree to the{' '}
          <span className="text-[#2B2A8C] font-bold hover:underline cursor-pointer">Terms &amp; Conditions</span>
          {' '}and{' '}
          <span className="text-[#2B2A8C] font-bold hover:underline cursor-pointer">Privacy Policy</span>
        </label>
      </div>

      {termsError && (
        <p className="text-xs text-red-500 text-center">{termsError}</p>
      )}

      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading || !acceptedTerms}
        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:border-gray-400 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 font-semibold text-sm py-3 rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
      >
        <FcGoogle className="w-5 h-5 shrink-0" />
        {loading
          ? (isRegister ? 'Creating account...' : 'Signing in...')
          : 'Continue with Google'}
      </button>
    </>
  );
}
