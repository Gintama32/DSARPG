import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChapterCard } from '../components/ChapterCard';
import { AudioPlayer, AudioPlayerRef } from '../components/AudioPlayer';
import { UserMenu } from '../components/ui/UserMenu';
import { useAuth } from '../context/AuthContext';
import { chapters } from '../data/chapters';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export function HomePage() {
  const audioPlayerRef = useRef<AudioPlayerRef>(null);
  const { user, loading } = useAuth();
  const [musicPrompt, setMusicPrompt] = useState(false);

  useEffect(() => {
    // Try to play music on mount
    const tryPlay = async () => {
      try {
        await audioPlayerRef.current?.play();
      } catch {
        setMusicPrompt(true);
      }
    };
    tryPlay();
  }, []);

  const handleStartMusic = () => {
    audioPlayerRef.current?.play();
    setMusicPrompt(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  return (
    <div className="py-12 relative">
      {/* User Menu or Sign In Button - Top Left */}
      <div className="fixed top-4 left-4 z-50">
        {user ? (
          <UserMenu />
        ) : (
          <Link
            to="/login"
            className="bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-500 font-pixel text-xs py-2 px-4 rounded transition-colors"
          >
            Sign In / Register
          </Link>
        )}
      </div>

      {/* Background Theme Music */}
      <AudioPlayer 
        ref={audioPlayerRef}
        src="/sounds/bgm/theme.mp3"
        autoPlay={true}
        loop={true}
        volume={0.3}
      />
      {musicPrompt && (
        <button
          onClick={handleStartMusic}
          className="fixed top-4 right-1/2 bg-purple-600 text-white px-4 py-2 rounded z-50 shadow-lg border-2 border-purple-400 font-pixel animate-bounce"
        >
          ▶️ Click to enable music
        </button>
      )}

      {/* Welcome Message for Authenticated Users */}
      {user ? (
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-pixel text-purple-300 leading-relaxed">
            Welcome back, {user.email?.split('@')[0] || 'Chosen One'}! 
            Continue your quest to save Algorithmic.
          </p>
        </motion.div>
      ) : (
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-pixel text-purple-300 leading-relaxed mb-2">
            Welcome, Guest! You have full access. Want to save your progress?
          </p>
          <Link
            to="/login"
            className="text-xs font-pixel text-purple-400 hover:text-purple-300 underline transition-colors"
          >
            Sign In or Register
          </Link>
        </motion.div>
      )}

      {/* Title with Static Disco Ambient Glow Effect */}
      <div className="relative mx-auto w-fit mb-12">
        {/* Wide Ambient Background Glow - Outermost Layer */}
        <div
          className="absolute -inset-x-32 -inset-y-16"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 0, 255, 0.3) 20%, rgba(0, 255, 255, 0.4) 50%, rgba(255, 255, 0, 0.3) 80%, transparent 100%)',
            filter: 'blur(25px)',
            opacity: 0.8,
          }}
        />

        {/* Medium Ambient Glow - Middle Layer */}
        <div
          className="absolute -inset-x-24 -inset-y-12"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 0, 128, 0.4) 15%, rgba(128, 255, 0, 0.5) 50%, rgba(0, 128, 255, 0.4) 85%, transparent 100%)',
            filter: 'blur(20px)',
            opacity: 0.9,
          }}
        />

        {/* Inner Ambient Glow - Close Layer */}
        <div
          className="absolute -inset-x-16 -inset-y-8"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255, 64, 255, 0.5) 10%, rgba(64, 255, 255, 0.6) 50%, rgba(255, 255, 64, 0.5) 90%, transparent 100%)',
            filter: 'blur(15px)',
            opacity: 1.0,
          }}
        />

        {/* Subtle Text Glow Effect */}
        <div
          className="absolute inset-0 text-2xl font-pixel text-center leading-relaxed"
          style={{
            color: 'rgba(255, 128, 255, 0.8)',
            filter: 'blur(2px)',
            textShadow: '0 0 20px rgba(255, 128, 255, 1.0)',
            opacity: 0.7,
          }}
        >
          Code Quest: DSA Adventure
        </div>

        {/* Main Title Text */}
        <motion.h1 
          className="relative z-10 text-2xl font-pixel text-center text-purple-400 leading-relaxed"
          style={{
            textShadow: "0 0 8px rgba(168, 85, 247, 0.9), 0 0 16px rgba(168, 85, 247, 0.7), 0 0 24px rgba(168, 85, 247, 0.5), 0 0 32px rgba(168, 85, 247, 0.3)"
          }}
          animate={{ 
            y: [0, -8, 0, -4, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Code Quest: DSA Adventure
        </motion.h1>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {chapters.map((chapter, index) => {
            let imagePath = chapter.imagePath;
            if (index === 1) imagePath = '/linkwood.jpg';
            if (index === 2) imagePath = '/nexus.jpg';
            return (
              <ChapterCard
                key={index}
                index={index}
                title={chapter.title}
                description={chapter.description}
                imagePath={imagePath}
                details={chapter.details}
              />
            );
          })}
        </div>
      </div>

      {/* Fixed Badge in Bottom Right */}
      <a
        href="https://bolt.new"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-50"
        style={{ opacity: 0.95 }}
      >
        <img
          src="/badge.png"
          alt="bolt.new"
          className="drop-shadow-lg"
          style={{ width: '3.2rem', height: '3.2rem', maxWidth: '3.2rem', maxHeight: '3.2rem' }}
        />
      </a>
    </div>
  );
}