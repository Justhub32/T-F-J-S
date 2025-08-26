import { useEffect, useRef, useState } from 'react';

interface UseBackgroundAudioReturn {
  isPlaying: boolean;
  toggle: () => void;
  setVolume: (volume: number) => void;
  volume: number;
}

export function useBackgroundAudio(autoPlay: boolean = false): UseBackgroundAudioReturn {
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.3);

  // Generate ocean wave sounds using Web Audio API
  const createOceanSound = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const audioContext = audioContextRef.current;
    const bufferSize = audioContext.sampleRate * 60; // 60 seconds of audio
    const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);

    // Generate ocean wave sound using white noise and filtering
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      
      for (let i = 0; i < bufferSize; i++) {
        // Create brown noise (more natural ocean sound)
        let brownNoise = 0;
        for (let j = 0; j < 16; j++) {
          brownNoise += (Math.random() * 2 - 1) / Math.pow(2, j);
        }
        
        // Add wave-like modulation
        const waveModulation = Math.sin(i * 0.001) * 0.3;
        const deepWaveModulation = Math.sin(i * 0.0003) * 0.5;
        
        channelData[i] = (brownNoise * 0.4 + waveModulation + deepWaveModulation) * 0.15;
      }
    }

    return buffer;
  };

  const startOceanSound = async () => {
    try {
      if (!audioContextRef.current || audioContextRef.current.state === 'suspended') {
        if (audioContextRef.current) {
          await audioContextRef.current.resume();
        }
      }

      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
      }

      const audioContext = audioContextRef.current!;
      const buffer = await createOceanSound();
      
      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();
      
      source.buffer = buffer;
      source.loop = true;
      
      gainNode.gain.value = volume;
      
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      source.start();
      
      sourceNodeRef.current = source;
      gainNodeRef.current = gainNode;
      setIsPlaying(true);
    } catch (error) {
      console.warn('Could not start ocean sounds:', error);
    }
  };

  const stopOceanSound = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
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
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume;
    }
  };

  useEffect(() => {
    if (autoPlay) {
      // Add a small delay for user interaction requirement
      const timer = setTimeout(() => {
        startOceanSound();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay]);

  useEffect(() => {
    return () => {
      stopOceanSound();
      if (audioContextRef.current) {
        audioContextRef.current.close();
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