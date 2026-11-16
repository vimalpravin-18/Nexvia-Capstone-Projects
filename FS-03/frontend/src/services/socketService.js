/**
 * Real-time Socket.io WebRTC Signaling Client
 */
import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;
    socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected to signaling gateway:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected from signaling gateway:', reason);
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
