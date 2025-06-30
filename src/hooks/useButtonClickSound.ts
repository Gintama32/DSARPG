import { useRef, useCallback } from 'react';

export function useButtonClickSound() {
  const enterButtonAudioRef = useRef<HTMLAudioElement | null>(null);
  const beginButtonAudioRef = useRef<HTMLAudioElement | null>(null);
  const generalButtonAudioRef = useRef<HTMLAudioElement | null>(null);

  const playEnterButtonSound = useCallback(() => {
    // Create audio instance if it doesn't exist
    if (!enterButtonAudioRef.current) {
      enterButtonAudioRef.current = new Audio('/sounds/effects/beginbutton.wav'); // "Enter the Chapter" buttons
      enterButtonAudioRef.current.volume = 0.5;
      enterButtonAudioRef.current.preload = 'auto';
    }

    // Reset and play the sound
    enterButtonAudioRef.current.currentTime = 0;
    enterButtonAudioRef.current.play().catch(error => {
      console.log('Enter button audio play prevented:', error);
    });
  }, []);

  const playBeginButtonSound = useCallback(() => {
    // Create audio instance if it doesn't exist
    if (!beginButtonAudioRef.current) {
      beginButtonAudioRef.current = new Audio('/sounds/effects/enterbutton.wav'); // "Begin Quest" buttons - USES ENTERBUTTON.WAV
      beginButtonAudioRef.current.volume = 0.5;
      beginButtonAudioRef.current.preload = 'auto';
    }

    // Reset and play the sound
    beginButtonAudioRef.current.currentTime = 0;
    beginButtonAudioRef.current.play().catch(error => {
      console.log('Begin button audio play prevented:', error);
    });
  }, []);

  const playGeneralButtonSound = useCallback(() => {
    // Create audio instance if it doesn't exist
    if (!generalButtonAudioRef.current) {
      generalButtonAudioRef.current = new Audio('/sounds/effects/beginbutton.wav'); // All other buttons
      generalButtonAudioRef.current.volume = 0.5;
      generalButtonAudioRef.current.preload = 'auto';
    }

    // Reset and play the sound
    generalButtonAudioRef.current.currentTime = 0;
    generalButtonAudioRef.current.play().catch(error => {
      console.log('General button audio play prevented:', error);
    });
  }, []);

  return { playEnterButtonSound, playBeginButtonSound, playGeneralButtonSound };
}