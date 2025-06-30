import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import { useButtonHoverSound } from '../hooks/useButtonHoverSound';
import { useButtonClickSound } from '../hooks/useButtonClickSound';

interface AudioPlayerProps {
  src: string;
  autoPlay?: boolean;
  loop?: boolean;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
}

export interface AudioPlayerRef {
  setVolume: (volume: number) => void;
  getVolume: () => number;
  pause: () => void;
  play: () => void;
  isPlaying: () => boolean;
}

export const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>(({ 
  src, 
  autoPlay = true, 
  loop = true, 
  volume = 0.3,
  onVolumeChange
}, ref) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const { playButtonSound } = useButtonHoverSound();
  const { playGeneralButtonSound } = useButtonClickSound();

  useImperativeHandle(ref, () => ({
    setVolume: (newVolume: number) => {
      const audio = audioRef.current;
      if (audio) {
        audio.volume = newVolume;
        setCurrentVolume(newVolume);
        onVolumeChange?.(newVolume);
      }
    },
    getVolume: () => currentVolume,
    pause: () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        audio.pause();
      }
    },
    play: () => {
      const audio = audioRef.current;
      if (audio && audio.paused) {
        audio.play().catch(console.error);
      }
    },
    isPlaying: () => isPlaying
  }), [currentVolume, isPlaying, onVolumeChange]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = currentVolume;
    audio.loop = loop;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Auto-play with user interaction handling
    if (autoPlay) {
      const playAudio = async () => {
        try {
          await audio.play();
        } catch (error) {
          // Auto-play was prevented, user interaction required
          console.log('Auto-play prevented, user interaction required');
        }
      };
      playAudio();
    }

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [autoPlay, loop, currentVolume]);

  // Update volume when prop changes
  useEffect(() => {
    setCurrentVolume(volume);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    playGeneralButtonSound(); // Play click sound

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
    } catch (error) {
      console.error('Error toggling audio:', error);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    playGeneralButtonSound(); // Play click sound

    audio.muted = !audio.muted;
    setIsMuted(!isMuted);
  };

  const handleHover = () => {
    playButtonSound(); // Only play hover sound
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <audio ref={audioRef} src={src} preload="auto" />
      
      <div className="flex items-center space-x-2 bg-gray-800/90 backdrop-blur-sm border border-purple-600 rounded-lg p-2">
        <motion.button
          onClick={togglePlay}
          onMouseEnter={handleHover}
          className="text-purple-400 hover:text-purple-300 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? (
            <svg className="w-4 h-4\" fill="currentColor\" viewBox="0 0 20 20">
              <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
          )}
        </motion.button>

        <motion.button
          onClick={toggleMute}
          onMouseEnter={handleHover}
          className="text-purple-400 hover:text-purple-300 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg className="w-4 h-4\" fill="currentColor\" viewBox="0 0 20 20">
              <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-3.793A1 1 0 019.383 3.076zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.828 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.828l3.555-3.793A1 1 0 019.383 3.076zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" />
            </svg>
          )}
        </motion.button>

        <div className="text-purple-300 font-pixel text-[8px] hidden sm:block">
          Theme
        </div>
      </div>
    </div>
  );
});

AudioPlayer.displayName = 'AudioPlayer';