import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

import { Chapter, Lesson } from '../data/chapters';
import { useCardHoverSound } from '../hooks/useCardHoverSound';
import { useUserProgress } from '../hooks/useUserProgress';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { PixelCard } from './ui/PixelCard';
import { ProgressLine } from './ui/ProgressLine';
import { AudioPlayer, AudioPlayerRef } from './AudioPlayer';
import { PauseMenu } from './PauseMenu';
import { usePauseMenu } from '../hooks/usePauseMenu';
import { LessonStageViewer } from './LessonStageViewer';

interface ChapterLessonsContentProps {
  chapter: Chapter;
  chapterIndex?: number;
  onReturnToChapter?: () => void;
}

interface SelectedLesson {
  lesson: Lesson;
  lessonIndex: number;
}

export function ChapterLessonsContent({ 
  chapter, 
  chapterIndex = 0,
  onReturnToChapter
}: ChapterLessonsContentProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<SelectedLesson | null>(null);
  const { playHoverSound } = useCardHoverSound();
  const audioPlayerRef = useRef<AudioPlayerRef>(null);
  const { isPaused, openPauseMenu, closePauseMenu } = usePauseMenu();
  const { isLessonCompleted, isLessonUnlocked, loading: progressLoading } = useUserProgress();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // ESC key handler - only for quest pages when no lesson is selected
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        // Only open pause menu if no lesson is selected
        if (!selectedLesson) {
          openPauseMenu();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [openPauseMenu, selectedLesson]);

  const handleLessonClick = (lesson: Lesson, lessonIndex: number) => {
    setSelectedLesson({ lesson, lessonIndex });
    playHoverSound();
  };

  const handleReturnToLessons = () => {
    setSelectedLesson(null);
  };

  const handleLessonHover = () => {
    playHoverSound();
  };

  const handleVolumeChange = (volume: number) => {
    audioPlayerRef.current?.setVolume(volume);
  };

  const getCurrentVolume = () => {
    return audioPlayerRef.current?.getVolume() || 0.3;
  };

  // Get the appropriate BGM based on chapter
  const getBGMSource = () => {
    switch (chapterIndex) {
      case 0:
        return "/sounds/bgm/arrayVille.mp3"; // Chapter 1: The Awakening of the Foundation
      case 1:
        return "/sounds/bgm/graphbgm.mp3"; // Chapter 2: The Labyrinth of Logic
      case 2:
        return "/sounds/bgm/finalchapterbgm.mp3"; // Chapter 3: The Nexus of Wisdom
      default:
        return "/sounds/bgm/chaptersbgm.mp3"; // Fallback
    }
  };

  // Get chapter-specific subtitle
  const getChapterSubtitle = () => {
    switch (chapterIndex) {
      case 0:
        return "Welcome to Arrayville, Chosen One. Your foundation journey begins here...";
      case 1:
        return "Enter the Labyrinth of Logic, where complex networks await your mastery...";
      case 2:
        return "You have reached the Nexus of Wisdom. Face the ultimate algorithmic challenges...";
      default:
        return "Prepare yourself, Chosen One. Your journey begins with these trials...";
    }
  };

  // Get chapter-specific loading message
  const getLoadingMessage = () => {
    switch (chapterIndex) {
      case 0:
        return "Entering the realm of Arrayville...";
      case 1:
        return "Navigating the Labyrinth of Logic...";
      case 2:
        return "Approaching the Nexus of Wisdom...";
      default:
        return "Initializing quest protocols...";
    }
  };

  // Prepare lesson progress data for ProgressLine
  const lessonProgressItems = chapter.lessons.map((lesson, index) => {
    const isCompleted = isLessonCompleted(chapterIndex, index);
    
    return {
      id: `lesson-${index}`,
      label: lesson.name.length > 12 ? lesson.name.substring(0, 12) + '...' : lesson.name,
      isCompleted,
      isActive: selectedLesson?.lessonIndex === index
    };
  });

  // If a lesson is selected, show the LessonStageViewer
  if (selectedLesson) {
    return (
      <LessonStageViewer 
        lesson={selectedLesson.lesson}
        chapterIndex={chapterIndex}
        lessonIndex={selectedLesson.lessonIndex}
        onReturn={handleReturnToLessons}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Pause Menu */}
      <PauseMenu 
        isOpen={isPaused}
        onClose={closePauseMenu}
        onVolumeChange={handleVolumeChange}
        currentVolume={getCurrentVolume()}
        onReturnToChapter={onReturnToChapter}
      />

      {/* Chapter-specific Background Music - Only play after loading */}
      {!isLoading && (
        <AudioPlayer 
          ref={audioPlayerRef}
          src={getBGMSource()}
          autoPlay={true}
          loop={true}
          volume={0.3}
        />
      )}

      {/* Animated Background - Only show during loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          {/* Chapter Image */}
          <div className="flex justify-center mb-6">
            <img
              src={
                chapterIndex === 0 ? '/Chapter1/arrayvilla.png'
                : chapterIndex === 1 ? '/linkwood.jpg'
                : chapterIndex === 2 ? '/nexus.jpg'
                : chapter.imagePath
              }
              alt={chapter.title}
              className="w-40 h-40 object-contain rounded-lg shadow-lg border-2 border-purple-700 bg-gray-900"
            />
          </div>

          {/* Chapter Title */}
          <motion.h1 
            className="text-3xl font-pixel text-purple-400 mb-6 leading-relaxed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {chapter.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-base font-pixel text-purple-300 leading-relaxed mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {getChapterSubtitle()}
          </motion.p>

          {/* ESC Pause Instruction - Only show when not loading and not paused */}
          {!isLoading && !isPaused && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <motion.p 
                className="text-xs font-pixel text-purple-300"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                Press ESC to pause
              </motion.p>
            </motion.div>
          )}
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.5 }}
          >
            <LoadingSpinner message={getLoadingMessage()} />
          </motion.div>
        )}

        {/* Lessons Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {chapter.lessons.map((lesson, index) => {
              const isCompleted = isLessonCompleted(chapterIndex, index);
              const isUnlocked = isLessonUnlocked(chapterIndex, index);
              return (
                <PixelCard
                  key={`${lesson.name}-${index}`}
                  className={`p-6 transition-colors ${
                    isCompleted 
                      ? 'border-green-500 hover:border-green-400' 
                      : isUnlocked
                        ? 'cursor-pointer hover:border-purple-500'
                        : 'opacity-50 cursor-not-allowed border-gray-700'
                  }`}
                  animate={true}
                  index={index}
                  onClick={isUnlocked ? () => handleLessonClick(lesson, index) : undefined}
                >
                  <div 
                    className="text-center"
                    onMouseEnter={isUnlocked ? handleLessonHover : undefined}
                  >
                    <motion.div 
                      className="text-4xl mb-4 relative"
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.5,
                      }}
                    >
                      {lesson.icon}
                      {/* Completion Badge */}
                      {isCompleted && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.3 + 0.5 }}
                        >
                          <span className="text-white text-xs">✓</span>
                        </motion.div>
                      )}
                      {/* Lock Badge */}
                      {!isUnlocked && (
                        <motion.div
                          className="absolute -top-1 -left-1 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.3 + 0.5 }}
                        >
                          <span className="text-white text-xs">🔒</span>
                        </motion.div>
                      )}
                    </motion.div>
                    <h3 className={`text-sm font-pixel mb-3 leading-relaxed ${
                      isCompleted ? 'text-green-400' : 'text-purple-400'
                    }`}>
                      {lesson.name}
                    </h3>
                    <p className="text-xs font-pixel text-gray-300 leading-relaxed mb-4">
                      {lesson.description}
                    </p>
                    {/* Stage Count Indicator */}
                    <div className={`text-xs font-pixel ${
                      isCompleted ? 'text-green-300' : 'text-purple-300'
                    }`}>
                      {lesson.stages.filter(s => s.type === 'coding').length} stage{lesson.stages.filter(s => s.type === 'coding').length !== 1 ? 's' : ''}
                      {isCompleted && ' ✓'}
                    </div>
                  </div>
                </PixelCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}