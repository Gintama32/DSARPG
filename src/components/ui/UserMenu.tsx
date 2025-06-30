import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useUserProgress } from '../../hooks/useUserProgress';
import { PixelButton } from './PixelButton';
import { PixelCard } from './PixelCard';

import { useButtonHoverSound } from '../../hooks/useButtonHoverSound';
import { chapters } from '../../data/chapters';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const { user, signOut } = useAuth();
  const { playButtonSound } = useButtonHoverSound();
  const { loading: progressLoading, stageProgress } = useUserProgress() as {
    loading: boolean;
    stageProgress: any[];
  };

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const handleViewProgress = () => {
    setShowProgress(true);
    setIsOpen(false);
  };

  const handleHover = () => {
    playButtonSound();
  };

  // Get user display name (email prefix)
  const displayName = user.email?.split('@')[0] || 'Chosen One';

  // Calculate total coding stages across all chapters
  const totalCodingStagesInGame = chapters.reduce((total, chapter) => {
    return total + chapter.lessons.reduce((lessonTotal, lesson) => {
      return lessonTotal + lesson.stages.filter(s => s.type === 'coding').length;
    }, 0);
  }, 0);

  // Count completed coding stages
  const completedStages = stageProgress ? stageProgress.filter((p: any) => p.completed).length : 0;

  // Prepare chapter progress data for ProgressLine (optional, can be removed if not used)
  // const chapterProgressItems = chapters.map((chapter, index) => {
  //   // You can implement chapter completion logic if needed
  //   return {
  //     id: `chapter-${index}`,
  //     label: `Ch. ${index + 1}`,
  //     isCompleted: false,
  //     isActive: false
  //   };
  // });

  return (
    <>
      <div className="relative">
        {/* User Avatar/Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={handleHover}
          className="flex items-center space-x-2 bg-gray-800/90 backdrop-blur-sm border border-purple-600 rounded-lg px-3 py-2 text-purple-400 hover:text-purple-300 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-pixel text-white">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-xs font-pixel hidden sm:block">
            {displayName}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            ▼
          </motion.div>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-48 bg-gray-800/95 backdrop-blur-sm border border-purple-600 rounded-lg shadow-lg z-50"
            >
              <div className="p-3">
                {/* User Info */}
                <div className="border-b border-gray-600 pb-3 mb-3">
                  <p className="text-xs font-pixel text-purple-400 mb-1">
                    Signed in as:
                  </p>
                  <p className="text-xs font-pixel text-gray-300 truncate">
                    {user.email}
                  </p>
                  {/* Quick Progress Summary */}
                  <div className="mt-2 text-xs font-pixel text-purple-300">
                    Progress: {completedStages}/{totalCodingStagesInGame} stages
                  </div>
                </div>

                {/* Menu Items */}
                <div className="space-y-2">
                  <button
                    onClick={handleViewProgress}
                    onMouseEnter={handleHover}
                    className="w-full text-left px-3 py-2 text-xs font-pixel text-gray-300 hover:text-purple-300 hover:bg-purple-900/20 rounded transition-colors"
                  >
                    📊 View Progress
                  </button>
                  
                  <button
                    onClick={() => setIsOpen(false)}
                    onMouseEnter={handleHover}
                    className="w-full text-left px-3 py-2 text-xs font-pixel text-gray-300 hover:text-purple-300 hover:bg-purple-900/20 rounded transition-colors"
                  >
                    ⚙️ Settings
                  </button>
                  
                  <hr className="border-gray-600" />
                  
                  <button
                    onClick={handleSignOut}
                    onMouseEnter={handleHover}
                    className="w-full text-left px-3 py-2 text-xs font-pixel text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Click outside to close */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>

      {/* Progress Modal */}
      <AnimatePresence>
        {showProgress && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProgress(false)}
            />

            {/* Modal Content */}
            <motion.div
              className="relative z-10 w-full max-w-2xl mx-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <PixelCard className="p-8" hoverable={false}>
                <div className="text-center mb-6">
                  {/* Title */}
                  <motion.h2 
                    className="text-xl font-pixel text-purple-400 mb-4 leading-relaxed"
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
                    Quest Progress
                  </motion.h2>

                  {/* Overall Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-lg font-pixel text-purple-300">
                        {completedStages}
                      </div>
                      <div className="text-xs font-pixel text-gray-400">
                        Stages Completed
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-pixel text-purple-300">
                        {totalCodingStagesInGame}
                      </div>
                      <div className="text-xs font-pixel text-gray-400">
                        Total Stages
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-pixel text-purple-300">
                        {Math.round((completedStages / totalCodingStagesInGame) * 100)}%
                      </div>
                      <div className="text-xs font-pixel text-gray-400">
                        Complete
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chapter Progress */}
                {progressLoading ? (
                  <div className="text-center py-8">
                    <div className="text-purple-300 text-sm font-pixel">
                      Loading progress...
                    </div>
                  </div>
                ) : null}

                {/* Close Button */}
                <div className="text-center">
                  <PixelButton
                    onClick={() => setShowProgress(false)}
                    variant="primary"
                    className="px-8"
                  >
                    Close
                  </PixelButton>
                </div>
              </PixelCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}