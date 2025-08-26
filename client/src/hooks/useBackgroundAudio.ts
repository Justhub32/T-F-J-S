import { useEffect, useRef, useState } from 'react';

interface UseBackgroundAudioReturn {
  isPlaying: boolean;
  toggle: () => void;
  setVolume: (volume: number) => void;
  volume: number;
}

export function useBackgroundAudio(): UseBackgroundAudioReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.3);

  // Create ocean wave audio using data URL (sine wave ocean simulation)
  const createOceanWaveAudio = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 10; // 10 seconds loop
    const numSamples = sampleRate * duration;
    
    // Create buffer for ocean wave sound
    const buffer = audioContext.createBuffer(1, numSamples, sampleRate);
    const channelData = buffer.getChannelData(0);
    
    // Generate ocean wave sound with multiple overlapping sine waves
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      
      // Multiple wave frequencies to simulate ocean
      const wave1 = Math.sin(2 * Math.PI * 0.05 * t) * 0.3; // Deep ocean swell
      const wave2 = Math.sin(2 * Math.PI * 0.1 * t) * 0.2;  // Medium waves
      const wave3 = Math.sin(2 * Math.PI * 0.2 * t) * 0.15; // Surface waves
      const wave4 = Math.sin(2 * Math.PI * 0.5 * t) * 0.1;  // Small waves
      
      // Add some white noise for foam/splash effect
      const noise = (Math.random() * 2 - 1) * 0.05;
      
      // Combine all waves with envelope for natural sound
      const envelope = Math.sin(Math.PI * t / duration); // Fade in/out
      channelData[i] = (wave1 + wave2 + wave3 + wave4 + noise) * envelope * 0.4;
    }
    
    // Convert buffer to WAV data URL
    const wavData = audioBufferToWav(buffer);
    const blob = new Blob([wavData], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  };

  // Convert AudioBuffer to WAV format
  const audioBufferToWav = (buffer: AudioBuffer) => {
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(arrayBuffer);
    const channelData = buffer.getChannelData(0);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);
    
    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
    
    return arrayBuffer;
  };

  const initializeAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      audioRef.current.preload = 'auto';
      
      // Generate and set ocean wave audio
      const oceanWaveUrl = createOceanWaveAudio();
      audioRef.current.src = oceanWaveUrl;
    }
  };

  const startOceanSound = async () => {
    try {
      initializeAudio();
      if (audioRef.current) {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.warn('Could not start ocean sounds:', error);
      setIsPlaying(false);
    }
  };

  const stopOceanSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const toggle = () => {
    if (isPlaying) {
      stopOceanSound();
    } else {
      startOceanSound();
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  return {
    isPlaying,
    toggle,
    setVolume,
    volume,
  };
}