/**
 * WebSocket service for real-time video streaming
 */
import type { FrameData, WebSocketMessage } from '@/types';

const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

type MessageHandler = (data: FrameData) => void;
type ErrorHandler = (error: string) => void;
type StatusHandler = (status: string) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private messageHandlers: Set<MessageHandler> = new Set();
  private errorHandlers: Set<ErrorHandler> = new Set();
  private statusHandlers: Set<StatusHandler> = new Set();
  private isManualClose = false;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.isManualClose = false;
        const wsUrl = `${WS_BASE_URL}/ws/pulse`;
        console.log('Connecting to WebSocket:', wsUrl);

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          this.notifyStatus('connected');
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.notifyError('WebSocket connection error');
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.notifyStatus('disconnected');

          if (!this.isManualClose && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnect();
          }
        };
      } catch (error) {
        console.error('Error creating WebSocket:', error);
        reject(error);
      }
    });
  }

  private reconnect() {
    this.reconnectAttempts++;
    console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);

    setTimeout(() => {
      this.connect().catch((error) => {
        console.error('Reconnect failed:', error);
      });
    }, this.reconnectDelay);
  }

  disconnect() {
    this.isManualClose = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(message: WebSocketMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }

  startStream(cameraId: number = 0) {
    this.send({
      type: 'start',
      data: { camera_id: cameraId },
    });
  }

  stopStream() {
    this.send({
      type: 'stop',
    });
  }

  toggleSearch() {
    this.send({
      type: 'toggle_search',
    });
  }

  ping() {
    this.send({
      type: 'ping',
    });
  }

  private handleMessage(message: WebSocketMessage) {
    switch (message.type) {
      case 'frame':
        this.messageHandlers.forEach((handler) => {
          handler(message as unknown as FrameData);
        });
        break;
      case 'error':
        this.notifyError(message.message || 'Unknown error');
        break;
      case 'status':
        this.notifyStatus(message.message || 'Status update');
        break;
      case 'pong':
        // Handle ping response
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  }

  private notifyError(error: string) {
    this.errorHandlers.forEach((handler) => {
      handler(error);
    });
  }

  private notifyStatus(status: string) {
    this.statusHandlers.forEach((handler) => {
      handler(status);
    });
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onError(handler: ErrorHandler) {
    this.errorHandlers.add(handler);
    return () => this.errorHandlers.delete(handler);
  }

  onStatus(handler: StatusHandler) {
    this.statusHandlers.add(handler);
    return () => this.statusHandlers.delete(handler);
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export const wsService = new WebSocketService();
export default wsService;
