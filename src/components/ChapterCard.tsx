import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCardHoverSound } from '../hooks/useCardHoverSound';
import { useButtonHoverSound } from '../hooks/useButtonHoverSound';
import { useButtonClickSound } from '../hooks/useButtonClickSound';

interface ChapterCardProps {
  index: number;
  title: string;
  description: string;
  imagePath: string;
  details: string;
}

export function ChapterCard({ index, title, description, imagePath, details }: ChapterCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();
  const { playHoverSound } = useCardHoverSound();
  const { playButtonSound } = useButtonHoverSound();
  const { playEnterButtonSound } = useButtonClickSound();

  const handleCardClick = () => {
    setIsFlipped(prev => !prev);
    playHoverSound();
  };

  const handleBeginQuest = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip when clicking button
    
    // Play click sound and navigate
    playEnterButtonSound();
    
    // Small delay for visual feedback
    setTimeout(() => {
      navigate(`/chapter/${index}`);
    }, 400); // Increased delay to match new animation duration
  };

  const handleHover = () => {
    playHoverSound();
  };

  const handleButtonHover = () => {
    playButtonSound(); // Only play hover sound, don't trigger click
  };

  // Truncate details to make them shorter and more readable
  const truncatedDetails = details.length > 120 ? details.substring(0, 120) + '...' : details;

  return (
    <motion.div 
      className="pixel-card-container w-80 h-96"
      onClick={handleCardClick}
      onHoverStart={handleHover}
      animate={{
        y: [0, -4, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.5,
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
    >
      <div className={`pixel-card ${isFlipped ? 'flipped' : ''}`}>
        {/* Front of the card */}
        <div className="pixel-card-front">
          <motion.img 
            src={imagePath} 
            alt={title} 
            className="chapter-image"
            animate={{
              filter: [
                "brightness(1) contrast(1)",
                "brightness(1.02) contrast(1.01)",
                "brightness(1) contrast(1)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5,
            }}
          />
          <div className="pixel-card-title">
            <motion.h2 
              className="text-sm font-pixel text-purple-400 mb-2 leading-relaxed"
              animate={{
                textShadow: [
                  "0 0 8px rgba(168, 85, 247, 0.6)",
                  "0 0 10px rgba(168, 85, 247, 0.7)",
                  "0 0 8px rgba(168, 85, 247, 0.6)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5,
              }}
            >
              {title}
            </motion.h2>
            <p className="text-xs font-pixel text-purple-200 leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Back of the card */}
        <div className="pixel-card-back">
          <h3 className="text-sm font-pixel text-purple-400 mb-3 leading-relaxed">{title}</h3>
          <p className="text-[10px] font-pixel text-gray-200 leading-relaxed mb-4">{truncatedDetails}</p>
          
          {/* Enter the Chapter Button */}
          <motion.button
            onClick={handleBeginQuest}
            onMouseEnter={handleButtonHover}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-pixel text-[10px] py-3 px-4 rounded border-2 border-purple-500 transition-colors mb-4"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 15px rgba(168, 85, 247, 0.6)"
            }}
            whileTap={{ 
              backgroundColor: [
                '#8b5cf6', // Original purple
                '#e5e7eb', // Softer white flash (gray-200)
                '#c084fc', // Bright purple
                '#e5e7eb', // Another softer white flash
                '#c084fc', // Bright purple again
                '#e5e7eb', // Final softer white flash
                '#8b5cf6'  // Back to original
              ],
              color: [
                '#ffffff',
                '#374151', // Dark gray text on light flash (instead of black)
                '#ffffff',
                '#374151', // Dark gray text on light flash
                '#ffffff',
                '#374151', // Dark gray text on light flash
                '#ffffff'
              ],
              scale: [1, 1.06, 1.03, 1.06, 1.03, 1.06, 1], // Slightly reduced scaling
              boxShadow: [
                "0 0 15px rgba(168, 85, 247, 0.6)",
                "0 0 20px rgba(229, 231, 235, 0.8)", // Softer white glow
                "0 0 18px rgba(192, 132, 252, 0.8)",
                "0 0 25px rgba(229, 231, 235, 0.8)", // Another softer white glow
                "0 0 18px rgba(192, 132, 252, 0.8)",
                "0 0 30px rgba(229, 231, 235, 0.8)", // Final softer white glow
                "0 0 15px rgba(168, 85, 247, 0.6)"
              ],
              transition: { 
                duration: 0.4, // Longer duration for multiple blinks
                times: [0, 0.1, 0.2, 0.35, 0.5, 0.75, 1], // Timing for each keyframe
                ease: "easeInOut"
              }
            }}
          >
            Enter the Chapter
          </motion.button>
          
          <motion.div 
            className="text-purple-300 text-center font-pixel text-[8px]"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Click anywhere to flip back
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}