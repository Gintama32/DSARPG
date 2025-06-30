import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { chapters } from '../data/chapters';
import { ChapterLessonsContent } from '../components/ChapterLessonsContent';
import { Navigation } from '../components/ui/Navigation';
import { PixelButton } from '../components/ui/PixelButton';
import { PixelCard } from '../components/ui/PixelCard';
import { AudioPlayer, AudioPlayerRef } from '../components/AudioPlayer';
import { useButtonClickSound } from '../hooks/useButtonClickSound';

type ViewState = 'detail' | 'lessons';

export function ChapterDetail() {
  const { id } = useParams<{ id: string }>();
  const chapterIndex = parseInt(id || '0', 10);
  const chapter = chapters[chapterIndex];
  const [currentView, setCurrentView] = useState<ViewState>('detail');
  const { playBeginButtonSound } = useButtonClickSound();
  const audioPlayerRef = useRef<AudioPlayerRef>(null);

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-pixel text-purple-400 mb-4">Chapter Not Found</h1>
          <Navigation showBackToHome={true} />
        </div>
      </div>
    );
  }

  const handleBeginQuestPress = () => {
    playBeginButtonSound(); // Play sound immediately
  };

  const handleBeginQuest = () => {
    setCurrentView('lessons'); // Navigate after animation
  };

  const handleReturnToChapter = () => {
    setCurrentView('detail');
  };

  const renderDetailView = () => (
    <div className="min-h-screen py-12">
      {/* Chapter Detail Page BGM */}
      <AudioPlayer 
        ref={audioPlayerRef}
        src="/sounds/bgm/chaptersbgm.mp3"
        autoPlay={true}
        loop={true}
        volume={0.3}
      />

      <div className="container mx-auto px-4 max-w-4xl">
        {/* Navigation */}
        <Navigation 
          currentChapter={chapterIndex}
          totalChapters={chapters.length}
          showBackToHome={true}
        />

        {/* Chapter Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-2xl font-pixel text-purple-400 mb-4 leading-relaxed">
            {chapter.title}
          </h1>
          <p className="text-base font-pixel text-purple-300 leading-relaxed">
            {chapter.description}
          </p>
        </motion.div>

        {/* Chapter Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Chapter Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <PixelCard className="p-4" hoverable={false}>
              <img
                src={
                  chapterIndex === 0 ? chapter.imagePath
                  : chapterIndex === 1 ? '/linkwood.jpg'
                  : chapterIndex === 2 ? '/nexus.jpg'
                  : chapter.imagePath
                }
                alt={chapter.title}
                className="w-full h-80 object-cover rounded border border-purple-500 shadow-lg"
              />
            </PixelCard>
          </motion.div>

          {/* Chapter Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <PixelCard className="p-6" hoverable={false}>
              <h2 className="text-base font-pixel text-purple-400 mb-4 leading-relaxed">
                Quest Details
              </h2>
              <p className="text-xs font-pixel text-gray-200 leading-relaxed mb-6">
                {chapter.details}
              </p>
              
              {/* Action Buttons - Removed View Progress button */}
              <div className="space-y-4">
                {/* Begin Quest Button - No visual click effect */}
                <motion.button
                  onClick={() => {
                    handleBeginQuestPress();
                    setTimeout(() => {
                      handleBeginQuest();
                    }, 100);
                  }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-pixel text-xs py-3 px-6 rounded border-2 border-purple-500 transition-colors"
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 0 15px rgba(168, 85, 247, 0.6)"
                  }}
                  // No whileTap animation for this button
                >
                  Begin Quest
                </motion.button>
              </div>
            </PixelCard>
          </motion.div>
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence mode="wait">
      {currentView === 'lessons' && (
        <div key="lessons">
          <ChapterLessonsContent 
            chapter={chapter} 
            chapterIndex={chapterIndex}
            onReturnToChapter={handleReturnToChapter}
          />
        </div>
      )}
      {currentView === 'detail' && (
        <div key="detail">
          {renderDetailView()}
        </div>
      )}
    </AnimatePresence>
  );
}