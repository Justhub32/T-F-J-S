import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioControllerProps {
  className?: string;
}

export function AudioController({ className = '' }: AudioControllerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create ocean wave sounds using HTML5 Audio with data URI
  const createOceanWaveDataURI = () => {
    // Create a simple ocean wave sound using data URI with base64 encoded audio
    // This is a minimal WAV file with ocean-like white noise
    const sampleRate = 44100;
    const duration = 10; // 10 seconds, will loop
    const numSamples = sampleRate * duration;
    
    // Create WAV header
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);
    
    // Generate ocean wave sound data
    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      // Create ocean-like sound with multiple frequency components
      const t = i / sampleRate;
      
      // Base wave sound (low frequency)
      const wave1 = Math.sin(2 * Math.PI * 0.5 * t) * Math.sin(2 * Math.PI * 0.3 * t);
      
      // Higher frequency waves
      const wave2 = Math.sin(2 * Math.PI * 2 * t) * 0.3 * Math.sin(2 * Math.PI * 0.1 * t);
      
      // White noise for wave texture (filtered)
      const noise = (Math.random() * 2 - 1) * 0.1;
      
      // Combine and apply envelope
      const envelope = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.05 * t); // Slow amplitude modulation
      const sample = (wave1 * 0.4 + wave2 * 0.3 + noise) * envelope * 0.3;
      
      // Convert to 16-bit PCM
      const pcm = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, pcm * 0x7FFF, true);
      offset += 2;
    }
    
    // Convert to base64
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    
    return 'data:audio/wav;base64,' + btoa(binary);
  };

  const initAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    const audio = new Audio();
    audio.src = createOceanWaveDataURI();
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = 'auto';
    
    audioRef.current = audio;
    
    // Event listeners
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('ended', () => setIsPlaying(false));
    
    return audio;
  };

  const startAudio = async () => {
    try {
      if (!audioRef.current) {
        initAudio();
      }
      
      if (audioRef.current) {
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Failed to play ocean sounds:', error);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const toggleAudio = async () => {
    if (isPlaying) {
      stopAudio();
    } else {
      await startAudio();
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = 0.3;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // Initialize audio on component mount
  useEffect(() => {
    initAudio();
    
    // Auto-start after user interaction
    const handleFirstInteraction = async () => {
      await startAudio();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });
    document.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
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