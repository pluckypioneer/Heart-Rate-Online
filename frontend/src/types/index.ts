/**
 * TypeScript type definitions
 */

export interface SystemStatus {
  status: string;
  camera_available: boolean;
  active_cameras: number[];
  version: string;
}

export interface CameraInfo {
  id: number;
  name: string;
  available: boolean;
}

export interface FFTData {
  freqs: number[];
  power: number[];
}

export interface FrameData {
  type: 'frame';
  image: string;
  bpm: number | null;
  fft_data: FFTData | null;
  raw_signal: number[] | null;
  timestamp: number;
  face_detected: boolean;
  signal_quality: number;
}

export interface SessionData {
  session_id: string;
  start_time: string;
  duration: number;
  avg_bpm: number;
  max_bpm: number;
  min_bpm: number;
}

export interface CurrentData {
  current_bpm: number;
  signal_quality: number;
  samples_count: number;
  timestamps: number[];
  raw_values: number[];
}

export interface WebSocketMessage {
  type: string;
  data?: any;
  message?: string;
}

export interface PulseState {
  isConnected: boolean;
  isStreaming: boolean;
  currentBpm: number | null;
  signalQuality: number;
  faceDetected: boolean;
  frameData: FrameData | null;
  sessionId: string | null;
  error: string | null;
}
