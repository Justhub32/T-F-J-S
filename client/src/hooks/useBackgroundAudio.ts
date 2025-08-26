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

  // Create realistic beach wave audio with crashing and foam sounds
  const createOceanWaveAudio = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 15; // 15 seconds for complete wave cycle
    const numSamples = sampleRate * duration;
    
    // Create buffer for ocean wave sound
    const buffer = audioContext.createBuffer(2, numSamples, sampleRate); // Stereo for depth
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let sample = 0;
        
        // Wave cycle: 8 seconds buildup, 2 seconds crash, 5 seconds retreat
        const cyclePos = (t % duration) / duration;
        
        if (cyclePos < 0.53) { // Buildup phase (0-8 seconds)
          const buildupPos = cyclePos / 0.53;
          
          // Gradual ocean swell building up
          const deepSwell = Math.sin(2 * Math.PI * 0.08 * t) * 0.2 * buildupPos;
          const mediumWaves = Math.sin(2 * Math.PI * 0.15 * t) * 0.15 * buildupPos;
          const smallWaves = Math.sin(2 * Math.PI * 0.3 * t) * 0.1 * buildupPos;
          
          // Add filtered white noise for water movement
          let noise = 0;
          for (let j = 0; j < 8; j++) {
            noise += (Math.random() * 2 - 1) / Math.pow(2, j + 2);
          }
          noise *= buildupPos * 0.03;
          
          sample = deepSwell + mediumWaves + smallWaves + noise;
          
        } else if (cyclePos < 0.66) { // Crash phase (8-10 seconds)
          const crashPos = (cyclePos - 0.53) / 0.13;
          
          // Intense wave crash with white noise and harmonics
          let crashNoise = 0;
          for (let j = 0; j < 32; j++) {
            crashNoise += (Math.random() * 2 - 1) / Math.pow(1.5, j);
          }
          
          // Wave impact envelope - sharp attack, quick decay
          const impactEnvelope = Math.exp(-crashPos * 8) * Math.sin(crashPos * Math.PI);
          
          // Multiple frequency components for realistic crash
          const crash1 = Math.sin(2 * Math.PI * 40 * t) * impactEnvelope * 0.3;
          const crash2 = Math.sin(2 * Math.PI * 80 * t) * impactEnvelope * 0.2;
          const crash3 = Math.sin(2 * Math.PI * 160 * t) * impactEnvelope * 0.1;
          
          sample = (crashNoise * impactEnvelope * 0.4) + crash1 + crash2 + crash3;
          
        } else { // Retreat phase (10-15 seconds)
          const retreatPos = (cyclePos - 0.66) / 0.34;
          const retreatFade = 1 - retreatPos;
          
          // Gentle foam and water retreat
          let foamNoise = 0;
          for (let j = 0; j < 16; j++) {
            foamNoise += (Math.random() * 2 - 1) / Math.pow(2, j + 1);
          }
          
          // Bubbling and foam sounds
          const bubble1 = Math.sin(2 * Math.PI * 20 * t + Math.sin(5 * t)) * retreatFade * 0.1;
          const bubble2 = Math.sin(2 * Math.PI * 35 * t + Math.sin(3 * t)) * retreatFade * 0.08;
          
          // Water drainage sound
          const drainage = Math.sin(2 * Math.PI * 0.5 * t) * retreatFade * 0.15;
          
          sample = (foamNoise * retreatFade * 0.2) + bubble1 + bubble2 + drainage;
        }
        
        // Slight stereo separation for depth
        if (channel === 1) {
          sample *= 0.95; // Right channel slightly quieter
        }
        
        // Apply gentle low-pass filtering for natural sound
        const filtered = sample * 0.7 + (channelData[Math.max(0, i-1)] || 0) * 0.3;
        channelData[i] = Math.max(-1, Math.min(1, filtered));
      }
    }
    
    // Convert buffer to WAV data URL
    const wavData = audioBufferToWav(buffer);
    const blob = new Blob([wavData], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  };

  // Convert AudioBuffer to WAV format (stereo)
  const audioBufferToWav = (buffer: AudioBuffer) => {
    const length = buffer.length;
    const channels = buffer.numberOfChannels;
    const arrayBuffer = new ArrayBuffer(44 + length * channels * 2);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * channels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channels, true);
    view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * channels * 2, true);
    view.setUint16(32, channels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * channels * 2, true);
    
    // Convert float samples to 16-bit PCM (interleaved stereo)
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < channels; channel++) {
        const channelData = buffer.getChannelData(channel);
        const sample = Math.max(-1, Math.min(1, channelData[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
      }
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