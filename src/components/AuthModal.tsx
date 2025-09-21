import React, { useState } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const { signUp, signIn, signInWithGoogle, loading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMessage('');

    if (isSignUp) {
      const result = await signUp(formData);
      if (result.success) {
        if (result.message) {
          setSuccessMessage(result.message);
        } else {
          onClose();
          setFormData({ email: '', password: '', displayName: '' });
        }
      }
    } else {
      const result = await signIn(formData);
      if (result.success) {
        onClose();
        setFormData({ email: '', password: '', displayName: '' });
      }
    }
  };

  const handleGoogleSignIn = async () => {
    clearError();
    setSuccessMessage('');
    const result = await signInWithGoogle();
    if (result.success) {
      // OAuth redirect will handle closing the modal
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    clearError();
    setSuccessMessage('');
    setFormData({ email: '', password: '', displayName: '' });
  };

  const handleClose = () => {
    onClose();
    setSuccessMessage('');
    clearError();
    setFormData({ email: '', password: '', displayName: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-8 w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {isSignUp ? 'JOIN HUD FEED' : 'ACCESS HUD FEED'}
            </h2>
          </div>
          <p className="text-gray-400 text-sm font-mono">
            {isSignUp ? 'Create your neural interface account' : 'Connect to your neural interface'}
          </p>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="mb-6 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
            {successMessage}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full mb-6 flex items-center justify-center gap-3 p-3 bg-white/10 border border-gray-600/30 rounded-lg hover:border-gray-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span className="text-white font-medium">
            {loading ? 'Connecting...' : `Continue with Google`}
          </span>
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600/30"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900/90 text-gray-400 font-mono">OR</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display Name (Sign Up only) */}
          {isSignUp && (
            <div>
              <label className="block text-xs text-cyan-400 mb-2 font-mono uppercase tracking-wider">
                <User className="inline w-3 h-3 mr-1" />
                Display Name
              </label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder="Enter your display name"
                className="w-full cyber-input"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs text-cyan-400 mb-2 font-mono uppercase tracking-wider">
              <Mail className="inline w-3 h-3 mr-1" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              className="w-full cyber-input"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs text-cyan-400 mb-2 font-mono uppercase tracking-wider">
              <Lock className="inline w-3 h-3 mr-1" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                minLength={6}
                className="w-full cyber-input pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {isSignUp && (
              <p className="text-xs text-gray-500 mt-1">
                Minimum 6 characters required
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full cyber-button py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {isSignUp ? 'Creating Account...' : 'Signing In...'}
              </>
            ) : (
              <>
                {isSignUp ? 'Create Account' : 'Sign In'}
              </>
            )}
          </button>
        </form>

        {/* Toggle mode */}
        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-sm text-gray-400 hover:text-cyan-400 transition-colors font-mono"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-700/50 text-center">
          <p className="text-xs text-gray-500 font-mono">
            SECURE NEURAL CONNECTION • ENCRYPTED DATA STREAM
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;