import { useRef, useCallback } from 'react';

export function useCardHoverSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playHoverSound = useCallback(() => {
    // Create audio instance if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio('/sounds/effects/flip.mp3');
      audioRef.current.volume = 0.4; // Moderate volume for hover effect
      audioRef.current.preload = 'auto';
    }

    // Reset and play the sound
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(error => {
      // Silently handle any audio play errors (e.g., user hasn't interacted yet)
      console.log('Audio play prevented:', error);
    });
  }, []);

  return { playHoverSound };
}