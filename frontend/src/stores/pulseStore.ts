/**
 * Zustand store for pulse detection state
 */
import { create } from 'zustand';
import type { PulseState, FrameData } from '@/types';

interface PulseStore extends PulseState {
  setConnected: (connected: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  setBpm: (bpm: number | null) => void;
  setSignalQuality: (quality: number) => void;
  setFaceDetected: (detected: boolean) => void;
  setFrameData: (data: FrameData | null) => void;
  setSessionId: (id: string | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: PulseState = {
  isConnected: false,
  isStreaming: false,
  currentBpm: null,
  signalQuality: 0,
  faceDetected: false,
  frameData: null,
  sessionId: null,
  error: null,
};

export const usePulseStore = create<PulseStore>((set) => ({
  ...initialState,

  setConnected: (connected) => set({ isConnected: connected }),
  setStreaming: (streaming) => set({ isStreaming: streaming }),
  setBpm: (bpm) => set({ currentBpm: bpm }),
  setSignalQuality: (quality) => set({ signalQuality: quality }),
  setFaceDetected: (detected) => set({ faceDetected: detected }),
  setFrameData: (data) => set({ frameData: data }),
  setSessionId: (id) => set({ sessionId: id }),
  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));
