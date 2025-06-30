import { useState, useRef } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { PixelButton } from '../components/ui/PixelButton';
import { PixelCard } from '../components/ui/PixelCard';
import { AudioPlayer, AudioPlayerRef } from '../components/AudioPlayer';
import { AnimatedBackground } from '../components/AnimatedBackground';

export function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const audioPlayerRef = useRef<AudioPlayerRef>(null);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const { error } = await signUp(email, password);
      if (error) {
        // Enhanced error handling with more specific messages
        let errorMessage = error.message;
        
        if (error.message.includes('already registered') || 
            error.message.includes('User already registered')) {
          errorMessage = 'This email is already registered. Please try logging in instead.';
        } else if (error.message.includes('weak password')) {
          errorMessage = 'Password is too weak. Please use a stronger password with at least 6 characters.';
        } else if (error.message.includes('invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
        
        setError(errorMessage);
      } else {
        // Registration successful - redirect immediately to login page
        navigate('/login', { 
          state: { 
            message: 'Account created successfully! Please sign in to continue your quest.',
            email: email // Pre-fill email on login page
          }
        });
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 relative">
      <AnimatedBackground />
      
      {/* Background Music */}
      <AudioPlayer 
        ref={audioPlayerRef}
        src="/sounds/bgm/theme.mp3"
        autoPlay={true}
        loop={true}
        volume={0.2}
      />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <PixelCard className="p-8" hoverable={false}>
            {/* Title */}
            <motion.div 
              className="text-center mb-8"
              animate={{
                textShadow: [
                  "0 0 8px rgba(168, 85, 247, 0.6)",
                  "0 0 12px rgba(168, 85, 247, 0.8)",
                  "0 0 8px rgba(168, 85, 247, 0.6)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <h1 className="text-xl font-pixel text-purple-400 mb-2 leading-relaxed">
                Join the Quest
              </h1>
              <p className="text-xs font-pixel text-purple-300 leading-relaxed">
                Create your account to save Algorithmic
              </p>
            </motion.div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="reg-email" className="block text-sm font-pixel text-purple-300 mb-2">
                  Email
                </label>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-purple-600 rounded font-pixel text-xs text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="reg-password" className="block text-sm font-pixel text-purple-300 mb-2">
                  Password
                </label>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-purple-600 rounded font-pixel text-xs text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
                  placeholder="Create a password (min 6 characters)"
                  disabled={loading}
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-pixel text-purple-300 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-purple-600 rounded font-pixel text-xs text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
                  placeholder="Confirm your password"
                  disabled={loading}
                />
              </div>

              {/* Error Message - Enhanced with better styling and more prominent display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-900/40 border-2 border-red-500/60 rounded-lg"
                >
                  <div className="flex items-start space-x-2">
                    <span className="text-red-400 text-sm">⚠️</span>
                    <div>
                      <p className="text-xs font-pixel text-red-300 font-bold mb-1">
                        Registration Failed
                      </p>
                      <p className="text-xs font-pixel text-red-200 leading-relaxed">
                        {error}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <PixelButton
                variant="primary"
                className="w-full"
                disabled={loading}
              >
                {loading ? '⚙️ Creating Account...' : '🌟 Begin Your Journey'}
              </PixelButton>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-xs font-pixel text-gray-400 mb-2">
                Already have an account?
              </p>
              <Link 
                to="/login"
                className="text-xs font-pixel text-purple-400 hover:text-purple-300 transition-colors"
              >
                ← Return to Login
              </Link>
            </div>

            {/* Guest Access */}
            <div className="mt-4 text-center">
              <Link 
                to="/"
                className="text-xs font-pixel text-gray-500 hover:text-gray-400 transition-colors"
              >
                Continue as Guest (Limited Access)
              </Link>
            </div>
          </PixelCard>
        </motion.div>
      </div>
    </div>
  );
}