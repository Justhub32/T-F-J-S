import { useEffect, useRef, useState } from 'react';

interface UseHomepageAudioReturn {
  isPlaying: boolean;
  toggle: () => void;
  setVolume: (volume: number) => void;
  volume: number;
}

export function useHomepageAudio(): UseHomepageAudioReturn {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.2); // Lower volume for background music

  // Create a "Sweetness" inspired instrumental track
  const createSweetnessInspiredAudio = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const duration = 180; // 3 minutes instrumental
    const numSamples = sampleRate * duration;
    
    // Create stereo buffer
    const buffer = audioContext.createBuffer(2, numSamples, sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      
      for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let sample = 0;
        
        // Song structure inspired by "Sweetness" - upbeat alternative rock
        const songPos = (t % duration) / duration;
        
        // Base drum pattern (kick and snare)
        const kickPattern = Math.sin(2 * Math.PI * 2.2 * t) * Math.exp(-((t % (60/140)) - 0) * 20); // 140 BPM
        const snarePattern = Math.sin(2 * Math.PI * 4.4 * t) * Math.exp(-((t % (60/140)) - 0.2) * 15);
        const hihatPattern = Math.sin(2 * Math.PI * 8.8 * t) * Math.exp(-((t % (60/140)) - 0.1) * 25) * 0.3;
        
        // Bass line (punchy alternative rock bass)
        const bassNote1 = Math.sin(2 * Math.PI * 82.41 * t); // E2
        const bassNote2 = Math.sin(2 * Math.PI * 98.00 * t); // G2
        const bassNote3 = Math.sin(2 * Math.PI * 110.00 * t); // A2
        const bassNote4 = Math.sin(2 * Math.PI * 146.83 * t); // D3
        
        const bassPattern = (songPos < 0.25) ? bassNote1 :
                           (songPos < 0.5) ? bassNote2 :
                           (songPos < 0.75) ? bassNote3 : bassNote4;
        
        // Guitar chords (power chords typical of alternative rock)
        const chord1 = Math.sin(2 * Math.PI * 164.81 * t) + Math.sin(2 * Math.PI * 196.00 * t); // E3-G3
        const chord2 = Math.sin(2 * Math.PI * 220.00 * t) + Math.sin(2 * Math.PI * 293.66 * t); // A3-D4
        const chord3 = Math.sin(2 * Math.PI * 246.94 * t) + Math.sin(2 * Math.PI * 329.63 * t); // B3-E4
        
        const chordPattern = (songPos < 0.33) ? chord1 :
                            (songPos < 0.66) ? chord2 : chord3;
        
        // Lead guitar melody (inspired by the energy of Sweetness)
        const leadFreq = 440 * Math.pow(2, Math.sin(t * 0.5) * 0.5); // Melodic variation
        const leadGuitar = Math.sin(2 * Math.PI * leadFreq * t) * Math.sin(t * 2) * 0.3;
        
        // Song dynamics (verse/chorus structure)
        let intensity = 0.6;
        if (songPos < 0.2 || (songPos > 0.4 && songPos < 0.6)) {
          intensity = 1.0; // Chorus sections
        }
        
        // Mix all elements
        const drums = (kickPattern * 0.4 + snarePattern * 0.3 + hihatPattern * 0.2) * intensity;
        const bass = bassPattern * 0.3 * intensity;
        const rhythm = chordPattern * 0.25 * intensity;
        const lead = leadGuitar * intensity;
        
        // Add some distortion for rock sound
        sample = (drums + bass + rhythm + lead) * 0.6;
        
        // Soft clipping for natural distortion
        if (sample > 0.7) sample = 0.7 + (sample - 0.7) * 0.3;
        if (sample < -0.7) sample = -0.7 + (sample + 0.7) * 0.3;
        
        // Slight stereo separation
        if (channel === 1) {
          sample *= 0.95;
          // Add slight delay for stereo width
          const delayedSample = channelData[Math.max(0, i-3)] || 0;
          sample = sample * 0.9 + delayedSample * 0.1;
        }
        
        // Apply gentle low-pass filtering
        const filtered = sample * 0.8 + (channelData[Math.max(0, i-1)] || 0) * 0.2;
        channelData[i] = Math.max(-0.9, Math.min(0.9, filtered));
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
      
      // Generate and set the Sweetness-inspired audio
      const sweetnessAudioUrl = createSweetnessInspiredAudio();
      audioRef.current.src = sweetnessAudioUrl;
    }
  };

  const startMusic = async () => {
    try {
      initializeAudio();
      if (audioRef.current) {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.warn('Could not start homepage music:', error);
      setIsPlaying(false);
    }
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const toggle = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      startMusic();
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