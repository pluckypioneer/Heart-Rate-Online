/**
 * API service for REST endpoints
 */
import axios, { AxiosInstance } from 'axios';
import type { SystemStatus, CameraInfo, SessionData, CurrentData } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_BASE_URL}/api/v1`,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  // System endpoints
  async getStatus(): Promise<SystemStatus> {
    return this.client.get('/status');
  }

  async getCameras(): Promise<{ cameras: CameraInfo[] }> {
    return this.client.get('/cameras');
  }

  async healthCheck(): Promise<{ status: string }> {
    return this.client.get('/health', {
      baseURL: `${API_BASE_URL}/api`,
    });
  }

  // Pulse detection endpoints
  async startDetection(cameraId: number = 0, bpmLimits: [number, number] = [50, 180]) {
    return this.client.post('/pulse/start', {
      camera_id: cameraId,
      bpm_limits: bpmLimits,
    });
  }

  async stopDetection(sessionId: string) {
    return this.client.post('/pulse/stop', {
      session_id: sessionId,
    });
  }

  async toggleSearch(sessionId: string) {
    return this.client.post('/pulse/toggle-search', {
      session_id: sessionId,
    });
  }

  async switchCamera(cameraId: number) {
    return this.client.post('/pulse/switch-camera', {
      camera_id: cameraId,
    });
  }

  // Data endpoints
  async exportData(sessionId: string, format: string = 'csv'): Promise<Blob> {
    const response = await this.client.get('/data/export', {
      params: { session_id: sessionId, format },
      responseType: 'blob',
    });
    return response as unknown as Blob;
  }

  async getHistory(limit: number = 10): Promise<{ sessions: SessionData[] }> {
    return this.client.get('/data/history', {
      params: { limit },
    });
  }

  async getCurrentData(sessionId: string): Promise<CurrentData> {
    return this.client.get('/data/current', {
      params: { session_id: sessionId },
    });
  }
}

export const apiService = new ApiService();
export default apiService;
