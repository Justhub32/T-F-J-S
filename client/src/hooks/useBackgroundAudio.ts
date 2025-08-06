import { useEffect, useRef, useState } from 'react';

interface UseBackgroundAudioProps {
  src: string;
  volume?: number;
  autoPlay?: boolean;
}

export function useBackgroundAudio({ 
  src, 
  volume = 0.3, 
  autoPlay = true 
}: UseBackgroundAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Create audio element
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = volume;
    audio.preload = 'auto';
    
    audioRef.current = audio;

    // Handle play/pause state
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    // Auto-play if enabled (with user interaction requirement)
    if (autoPlay) {
      // Attempt to play, but handle the case where user interaction is required
      const attemptPlay = async () => {
        try {
          await audio.play();
        } catch (error) {
          // Browser requires user interaction before playing audio
          console.log('Audio autoplay blocked - user interaction required');
          
          // Add a one-time click listener to start audio
          const handleFirstInteraction = async () => {
            try {
              await audio.play();
              document.removeEventListener('click', handleFirstInteraction);
              document.removeEventListener('touchstart', handleFirstInteraction);
            } catch (err) {
              console.error('Failed to play audio:', err);
            }
          };

          document.addEventListener('click', handleFirstInteraction, { once: true });
          document.addEventListener('touchstart', handleFirstInteraction, { once: true });
        }
      };

      attemptPlay();
    }

    // Cleanup
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, [src, volume, autoPlay]);

  const play = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
      } catch (error) {
        console.error('Failed to play audio:', error);
      }
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const setVolume = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
    }
  };

  const mute = () => {
    if (audioRef.current) {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const unmute = () => {
    if (audioRef.current) {
      audioRef.current.muted = false;
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      unmute();
    } else {
      mute();
    }
  };

  return {
    isPlaying,
    isMuted,
    play,
    pause,
    toggle,
    setVolume,
    mute,
    unmute,
    toggleMute,
  };
}