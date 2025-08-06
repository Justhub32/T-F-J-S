import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioControllerProps {
  className?: string;
}

export function AudioController({ className = '' }: AudioControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  // Generate ocean wave sounds using Web Audio API
  const createOceanWaves = () => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    // Clear existing oscillators
    oscillatorsRef.current.forEach(osc => {
      osc.stop();
      osc.disconnect();
    });
    oscillatorsRef.current = [];

    const audioContext = audioContextRef.current;
    const masterGain = gainNodeRef.current;

    // Create multiple oscillators for layered ocean sound
    const frequencies = [60, 120, 180, 240, 300]; // Bass frequencies for wave sounds
    
    frequencies.forEach((baseFreq, index) => {
      // Main wave oscillator
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      // Configure oscillator
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
      
      // Add subtle frequency modulation for wave movement
      const lfo = audioContext.createOscillator();
      const lfoGain = audioContext.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.1 + index * 0.05, audioContext.currentTime);
      lfoGain.gain.setValueAtTime(5, audioContext.currentTime);
      
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      
      // Configure filter (low-pass for ocean sound)
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800 - index * 100, audioContext.currentTime);
      filter.Q.setValueAtTime(1, audioContext.currentTime);
      
      // Configure gain (volume)
      gain.gain.setValueAtTime(0.1 - index * 0.015, audioContext.currentTime);
      
      // Connect the chain
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);
      
      // Start oscillators
      osc.start();
      lfo.start();
      
      oscillatorsRef.current.push(osc);
      oscillatorsRef.current.push(lfo);
    });

    // Add white noise for wave texture
    const bufferSize = 4096;
    const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = audioContext.createBufferSource();
    const noiseGain = audioContext.createGain();
    const noiseFilter = audioContext.createBiquadFilter();
    
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(200, audioContext.currentTime);
    noiseFilter.Q.setValueAtTime(0.5, audioContext.currentTime);
    
    noiseGain.gain.setValueAtTime(0.05, audioContext.currentTime);
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);
    
    noiseSource.start();
    oscillatorsRef.current.push(noiseSource as any);
  };

  const initAudio = async () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gainNode = audioContext.createGain();
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.connect(audioContext.destination);
      
      audioContextRef.current = audioContext;
      gainNodeRef.current = gainNode;
      
      return true;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      return false;
    }
  };

  const startAudio = async () => {
    if (!audioContextRef.current) {
      const initialized = await initAudio();
      if (!initialized) return;
    }
    
    if (audioContextRef.current?.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    
    createOceanWaves();
    setIsPlaying(true);
  };

  const stopAudio = () => {
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (error) {
        // Oscillator might already be stopped
      }
    });
    oscillatorsRef.current = [];
    setIsPlaying(false);
  };

  const toggleAudio = async () => {
    if (isPlaying) {
      stopAudio();
    } else {
      await startAudio();
    }
  };

  const toggleMute = () => {
    if (gainNodeRef.current) {
      if (isMuted) {
        gainNodeRef.current.gain.setValueAtTime(0.3, audioContextRef.current!.currentTime);
        setIsMuted(false);
      } else {
        gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current!.currentTime);
        setIsMuted(true);
      }
    }
  };

  // Auto-start on component mount (with user interaction)
  useEffect(() => {
    const handleFirstInteraction = async () => {
      await startAudio();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    // Auto-start after user interaction
    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });

    return () => {
      stopAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex gap-2 ${className}`}>
      <Button
        onClick={toggleAudio}
        variant="secondary"
        size="icon"
        className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
        title={isPlaying ? 'Pause ocean sounds' : 'Play ocean sounds'}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 text-gray-700" />
        ) : (
          <Play className="h-4 w-4 text-gray-700" />
        )}
      </Button>
      
      <Button
        onClick={toggleMute}
        variant="secondary"
        size="icon"
        className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
        title={isMuted ? 'Unmute ocean sounds' : 'Mute ocean sounds'}
        disabled={!isPlaying}
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4 text-gray-700" />
        ) : (
          <Volume2 className="h-4 w-4 text-gray-700" />
        )}
      </Button>
    </div>
  );
}