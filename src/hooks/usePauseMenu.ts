import { useState, useCallback } from 'react';

export function usePauseMenu() {
  const [isPaused, setIsPaused] = useState(false);

  const openPauseMenu = useCallback(() => {
    setIsPaused(true);
  }, []);

  const closePauseMenu = useCallback(() => {
    setIsPaused(false);
  }, []);

  const togglePauseMenu = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  return {
    isPaused,
    openPauseMenu,
    closePauseMenu,
    togglePauseMenu
  };
}