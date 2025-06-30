import { useRef, useCallback } from 'react';

export function useTestPassSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTestPassSound = useCallback(() => {
    // Create audio instance if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio('/sounds/effects/test_case_pass.mp3');
      audioRef.current.volume = 0.6;
      audioRef.current.preload = 'auto';
    }

    // Reset and play the sound
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(error => {
      console.log('Test pass audio play prevented:', error);
    });
  }, []);

  return { playTestPassSound };
}