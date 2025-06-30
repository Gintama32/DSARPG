import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { useButtonHoverSound } from '../../hooks/useButtonHoverSound';
import { useButtonClickSound } from '../../hooks/useButtonClickSound';

interface PixelButtonProps {
  children: ReactNode;
  onClick?: () => void;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
  skipClickSound?: boolean;
}

export function PixelButton({ 
  children, 
  onClick, 
  onPress,
  variant = 'primary',
  className = '',
  disabled = false,
  skipClickSound = false
}: PixelButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { playButtonSound } = useButtonHoverSound();
  const { playGeneralButtonSound } = useButtonClickSound();
  
  const baseClasses = "font-pixel text-xs py-3 px-6 rounded border-2 transition-colors";
  
  const variantClasses = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white border-purple-500",
    secondary: "bg-gray-700 hover:bg-gray-600 text-purple-300 border-gray-600"
  };

  const disabledClasses = (disabled || isAnimating) ? "opacity-50 cursor-not-allowed" : "";

  const handleHover = () => {
    if (!disabled && !isAnimating) {
      playButtonSound();
    }
  };

  const handleClick = () => {
    if (disabled || isAnimating) return;
    
    setIsAnimating(true);
    
    // Play general click sound if not skipped
    if (!skipClickSound) {
      playGeneralButtonSound();
    }
    
    onPress?.(); // Call onPress immediately for instant feedback (this handles special sounds)
    
    // Call onClick after a short delay for the animation
    setTimeout(() => {
      setIsAnimating(false);
      onClick?.();
    }, 400); // Increased delay to accommodate longer animation
  };

  return (
    <motion.button
      onClick={handleClick}
      onMouseEnter={handleHover}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      whileHover={(disabled || isAnimating) ? {} : { scale: 1.02 }}
      whileTap={(disabled || isAnimating) ? {} : { 
        backgroundColor: [
          variant === 'primary' ? '#8b5cf6' : '#4b5563', // Original color
          '#e5e7eb', // Softer white flash (gray-200)
          variant === 'primary' ? '#c084fc' : '#9ca3af', // Bright purple/gray
          '#e5e7eb', // Another softer white flash
          variant === 'primary' ? '#c084fc' : '#9ca3af', // Bright color again
          '#e5e7eb', // Final softer white flash
          variant === 'primary' ? '#8b5cf6' : '#4b5563'  // Back to original
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
          variant === 'primary' ? "0 0 0px rgba(168, 85, 247, 0)" : "0 0 0px rgba(156, 163, 175, 0)",
          "0 0 20px rgba(229, 231, 235, 0.8)", // Softer white glow
          variant === 'primary' ? "0 0 18px rgba(192, 132, 252, 0.8)" : "0 0 15px rgba(156, 163, 175, 0.6)",
          "0 0 25px rgba(229, 231, 235, 0.8)", // Another softer white glow
          variant === 'primary' ? "0 0 18px rgba(192, 132, 252, 0.8)" : "0 0 15px rgba(156, 163, 175, 0.6)",
          "0 0 30px rgba(229, 231, 235, 0.8)", // Final softer white glow
          variant === 'primary' ? "0 0 0px rgba(168, 85, 247, 0)" : "0 0 0px rgba(156, 163, 175, 0)"
        ],
        transition: { 
          duration: 0.4, // Longer duration for multiple blinks
          times: [0, 0.1, 0.2, 0.35, 0.5, 0.75, 1], // Timing for each keyframe
          ease: "easeInOut"
        }
      }}
      disabled={disabled || isAnimating}
    >
      {children}
    </motion.button>
  );
}