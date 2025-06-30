import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { PixelButton } from './ui/PixelButton';
import { PixelCard } from './ui/PixelCard';
import { useButtonHoverSound } from '../hooks/useButtonHoverSound';

interface PauseMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onVolumeChange?: (volume: number) => void;
  currentVolume?: number;
  onReturnToChapter?: () => void;
}

export function PauseMenu({ 
  isOpen, 
  onClose, 
  onVolumeChange, 
  currentVolume = 0.3,
  onReturnToChapter
}: PauseMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [volume, setVolume] = useState(currentVolume);
  const { playButtonSound } = useButtonHoverSound();

  // Check if we're on a quest page (lessons content)
  const isOnQuestPage = location.pathname.includes('/chapter/') && location.search === '';

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Only handle ESC on quest pages
        if (isOnQuestPage) {
          event.preventDefault();
          if (isOpen) {
            onClose();
          }
        }
      }
    };

    if (isOnQuestPage) {
      document.addEventListener('keydown', handleKeyPress);
    }

    if (isOpen) {
      // Prevent scrolling when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isOnQuestPage]);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    onVolumeChange?.(newVolume);
  };

  const handleReturnToHome = () => {
    setTimeout(() => {
      navigate('/');
      onClose();
    }, 100);
  };

  const handleGoToChapterMenu = () => {
    setTimeout(() => {
      if (onReturnToChapter) {
        onReturnToChapter();
      }
      onClose();
    }, 100);
  };

  const handleResume = () => {
    setTimeout(() => {
      onClose();
    }, 100);
  };

  const handleHover = () => {
    playButtonSound();
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            onClick={onClose}
          />

          {/* Menu Content */}
          <motion.div
            className="relative z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <PixelCard className="p-8 w-80" hoverable={false}>
              <div className="text-center">
                {/* Title */}
                <motion.h2 
                  className="text-xl font-pixel text-purple-400 mb-6 leading-relaxed"
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
                  Game Paused
                </motion.h2>

                {/* Volume Control */}
                <div className="mb-6">
                  <label className="block text-sm font-pixel text-purple-300 mb-3">
                    Music Volume
                  </label>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-pixel text-gray-400">🔇</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      onMouseEnter={handleHover}
                      className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
                      }}
                    />
                    <span className="text-xs font-pixel text-gray-400">🔊</span>
                  </div>
                  <div className="text-xs font-pixel text-purple-200 mt-2">
                    {Math.round(volume * 100)}%
                  </div>
                </div>

                {/* Menu Buttons - Removed manual sound calls, let PixelButton handle sounds */}
                <div className="space-y-4">
                  <PixelButton
                    onClick={handleResume}
                    variant="primary"
                    className="w-full"
                  >
                    Resume Game
                  </PixelButton>

                  {/* Show "Go to Chapter Menu" only on quest pages */}
                  {isOnQuestPage && onReturnToChapter && (
                    <PixelButton
                      onClick={handleGoToChapterMenu}
                      variant="secondary"
                      className="w-full"
                    >
                      Return to Chapter Menu
                    </PixelButton>
                  )}

                  <PixelButton
                    onClick={handleReturnToHome}
                    variant="secondary"
                    className="w-full"
                  >
                    Return to Main Menu
                  </PixelButton>
                </div>

                {/* Instructions - Only show ESC instruction on quest pages */}
                {isOnQuestPage && (
                  <motion.div 
                    className="mt-6 text-center"
                    animate={{
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <p className="text-xs font-pixel text-purple-300">
                      Press ESC to close
                    </p>
                  </motion.div>
                )}
              </div>
            </PixelCard>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}