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

  // Create large, powerful ocean wave crashes
  const createOceanWaveAudio = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 20; // 20 seconds for powerful wave cycle
    const numSamples = sampleRate * duration;
    
    // Create buffer for ocean wave sound
    const buffer = audioContext.createBuffer(2, numSamples, sampleRate); // Stereo for depth
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let sample = 0;
        
        // Large wave cycle: 12 seconds buildup, 4 seconds massive crash, 4 seconds powerful retreat
        const cyclePos = (t % duration) / duration;
        
        if (cyclePos < 0.6) { // Extended buildup phase (0-12 seconds)
          const buildupPos = cyclePos / 0.6;
          const intensity = Math.pow(buildupPos, 1.5); // Exponential buildup
          
          // Deep ocean swells building to massive size
          const deepSwell = Math.sin(2 * Math.PI * 0.04 * t) * 0.4 * intensity;
          const largeSwell = Math.sin(2 * Math.PI * 0.07 * t) * 0.3 * intensity;
          const mediumWaves = Math.sin(2 * Math.PI * 0.12 * t) * 0.25 * intensity;
          const surfaceChop = Math.sin(2 * Math.PI * 0.25 * t) * 0.15 * intensity;
          
          // Rumbling undertone for large waves
          const rumble = Math.sin(2 * Math.PI * 0.02 * t) * 0.2 * intensity;
          
          // Progressive water movement noise
          let noise = 0;
          for (let j = 0; j < 12; j++) {
            noise += (Math.random() * 2 - 1) / Math.pow(2, j + 1);
          }
          noise *= intensity * 0.08;
          
          sample = deepSwell + largeSwell + mediumWaves + surfaceChop + rumble + noise;
          
        } else if (cyclePos < 0.8) { // Massive crash phase (12-16 seconds)
          const crashPos = (cyclePos - 0.6) / 0.2;
          
          // Extremely intense wave crash - multiple impact stages
          let massiveCrashNoise = 0;
          for (let j = 0; j < 64; j++) {
            massiveCrashNoise += (Math.random() * 2 - 1) / Math.pow(1.3, j);
          }
          
          // Multi-stage crash envelope for large wave
          const mainImpact = Math.exp(-crashPos * 6) * Math.sin(crashPos * Math.PI * 2);
          const secondaryImpact = Math.exp(-(crashPos - 0.3) * 8) * Math.sin((crashPos - 0.3) * Math.PI * 3);
          const aftershock = Math.exp(-(crashPos - 0.6) * 10) * Math.sin((crashPos - 0.6) * Math.PI * 4);
          
          const totalImpactEnvelope = Math.max(0, mainImpact) + Math.max(0, secondaryImpact * 0.7) + Math.max(0, aftershock * 0.4);
          
          // Multiple frequency components for massive crash
          const lowCrash = Math.sin(2 * Math.PI * 25 * t) * totalImpactEnvelope * 0.5;
          const midCrash = Math.sin(2 * Math.PI * 60 * t) * totalImpactEnvelope * 0.4;
          const highCrash = Math.sin(2 * Math.PI * 120 * t) * totalImpactEnvelope * 0.3;
          const splashCrash = Math.sin(2 * Math.PI * 250 * t) * totalImpactEnvelope * 0.2;
          
          // Thunder-like rumble from large wave impact
          const thunderRumble = Math.sin(2 * Math.PI * 15 * t + Math.sin(3 * t)) * totalImpactEnvelope * 0.3;
          
          sample = (massiveCrashNoise * totalImpactEnvelope * 0.6) + lowCrash + midCrash + highCrash + splashCrash + thunderRumble;
          
        } else { // Powerful retreat phase (16-20 seconds)
          const retreatPos = (cyclePos - 0.8) / 0.2;
          const retreatIntensity = Math.exp(-retreatPos * 3); // Slower fade for large waves
          
          // Massive foam and turbulent water retreat
          let heavyFoamNoise = 0;
          for (let j = 0; j < 32; j++) {
            heavyFoamNoise += (Math.random() * 2 - 1) / Math.pow(1.8, j);
          }
          
          // Large bubbling and churning sounds
          const largeBubbles = Math.sin(2 * Math.PI * 12 * t + Math.sin(4 * t)) * retreatIntensity * 0.2;
          const mediumBubbles = Math.sin(2 * Math.PI * 28 * t + Math.sin(6 * t)) * retreatIntensity * 0.15;
          const smallBubbles = Math.sin(2 * Math.PI * 45 * t + Math.sin(8 * t)) * retreatIntensity * 0.1;
          
          // Powerful water drainage and undertow
          const heavyDrainage = Math.sin(2 * Math.PI * 0.3 * t) * retreatIntensity * 0.25;
          const undertow = Math.sin(2 * Math.PI * 0.8 * t) * retreatIntensity * 0.2;
          
          // Residual rumbling from large wave energy
          const residualRumble = Math.sin(2 * Math.PI * 0.15 * t) * retreatIntensity * 0.15;
          
          sample = (heavyFoamNoise * retreatIntensity * 0.4) + largeBubbles + mediumBubbles + smallBubbles + heavyDrainage + undertow + residualRumble;
        }
        
        // Enhanced stereo separation for dramatic effect
        if (channel === 1) {
          sample *= 0.9; // More pronounced stereo difference for large waves
          // Add slight delay for spatial depth
          const delayedSample = channelData[Math.max(0, i-5)] || 0;
          sample = sample * 0.85 + delayedSample * 0.15;
        }
        
        // Dynamic compression for powerful sound
        const compressed = sample > 0 ? Math.pow(Math.abs(sample), 0.8) * Math.sign(sample) : -Math.pow(Math.abs(sample), 0.8);
        
        // Apply filtering for natural large wave sound
        const filtered = compressed * 0.6 + (channelData[Math.max(0, i-1)] || 0) * 0.4;
        channelData[i] = Math.max(-0.95, Math.min(0.95, filtered));
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