import { useRef, useCallback } from 'react';

export function useWinSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playWinSound = useCallback(() => {
    // Create audio instance if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio('/sounds/effects/win.mp3');
      audioRef.current.volume = 0.7;
      audioRef.current.preload = 'auto';
    }

    // Reset and play the sound
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(error => {
      console.log('Win audio play prevented:', error);
    });
  }, []);

  return { playWinSound };
}