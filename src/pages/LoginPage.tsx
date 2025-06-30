import { useState, useRef, useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { PixelCard } from '../components/ui/PixelCard';
import { AudioPlayer, AudioPlayerRef } from '../components/AudioPlayer';
import { AnimatedBackground } from '../components/AnimatedBackground';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { signIn, user } = useAuth();
  const location = useLocation();
  const audioPlayerRef = useRef<AudioPlayerRef>(null);

  // Check for success message from registration
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Pre-fill email if provided
      if (location.state.email) {
        setEmail(location.state.email);
      }
    }
  }, [location.state]);

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage(''); // Clear success message when attempting login
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      const { error } = await signIn(email, password);
      if (error) {
        // Enhanced error handling
        let errorMessage = error.message;
        console.log('Supabase login error:', error); // Debug log
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.toLowerCase().includes('email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else {
          // Show the actual Supabase error message for any other case
          errorMessage = `Login failed: ${error.message}`;
        }
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Login error:', err);
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
                Welcome Back, Chosen One
              </h1>
              <p className="text-xs font-pixel text-purple-300 leading-relaxed">
                Continue your quest to save Algorithmic
              </p>
            </motion.div>

            {/* Success Message from Registration */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-green-900/40 border-2 border-green-500/60 rounded-lg mb-6"
              >
                <div className="flex items-start space-x-2">
                  <span className="text-green-400 text-sm">✅</span>
                  <div>
                    <p className="text-xs font-pixel text-green-300 font-bold mb-1">
                      Registration Successful!
                    </p>
                    <p className="text-xs font-pixel text-green-200 leading-relaxed">
                      {successMessage}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-pixel text-purple-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
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
                <label htmlFor="password" className="block text-sm font-pixel text-purple-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-purple-600 rounded font-pixel text-xs text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none transition-colors"
                  placeholder="Enter your password"
                  disabled={loading}
                />
              </div>

              {/* Error Message - Enhanced styling */}
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
                        Login Failed
                      </p>
                      <p className="text-xs font-pixel text-red-200 leading-relaxed">
                        {error}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500 font-pixel text-xs py-3 px-6 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? '⚙️ Logging In...' : '→ Enter the Realm'}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-xs font-pixel text-gray-400 mb-2">
                New to the realm?
              </p>
              <Link 
                to="/register"
                className="text-xs font-pixel text-purple-400 hover:text-purple-300 transition-colors"
              >
                Begin Your Journey →
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