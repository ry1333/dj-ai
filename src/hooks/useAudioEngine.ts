/**
 * useAudioEngine - React hook for managing AudioEngine lifecycle
 */

import { useEffect, useRef } from 'react';
import { AudioEngine } from '../lib/audio/engine';

export function useAudioEngine() {
  const engineRef = useRef<AudioEngine | null>(null);

  // Initialize engine once
  if (!engineRef.current) {
    engineRef.current = new AudioEngine();
  }

  // Cleanup on unmount
  useEffect(() => {
    const engine = engineRef.current!;

    return () => {
      engine.dispose();
    };
  }, []);

  return engineRef.current;
}
