import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useCardHoverSound } from '../../hooks/useCardHoverSound';

interface PixelCardProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
  index?: number;
  onClick?: () => void;
  hoverable?: boolean;
}

export function PixelCard({ 
  children, 
  className = '',
  animate = false,
  index = 0,
  onClick,
  hoverable = true
}: PixelCardProps) {
  const { playHoverSound } = useCardHoverSound();
  const baseClasses = "bg-gray-800/90 border-2 border-purple-600 rounded-lg backdrop-blur-sm";
  
  const handleHover = () => {
    if (hoverable) {
      playHoverSound();
    }
  };

  if (!animate) {
    return (
      <div 
        className={`${baseClasses} ${className} ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
        onMouseEnter={hoverable ? handleHover : undefined}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={`${baseClasses} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      onMouseEnter={hoverable ? handleHover : undefined}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.3, 
        duration: 0.6,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 10px 25px rgba(139, 92, 246, 0.3)",
        filter: "brightness(1.1)",
        transition: { duration: 0.15 }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
    >
      {children}
    </motion.div>
  );
}