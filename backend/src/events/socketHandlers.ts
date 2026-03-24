import { Server as SocketIOServer, Socket } from 'socket.io';
import { logger } from '../utils/logger';
import { insightService } from '../services/insightService';
import { gamificationService } from '../services/gamificationService';

export const registerSocketHandlers = (io: SocketIOServer): void => {
  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId as string;

    // Client requests a fresh dashboard snapshot
    socket.on('request-dashboard', async () => {
      try {
        const [dashboard, progression] = await Promise.all([
          insightService.getDashboard(userId),
          gamificationService.getProgression(userId),
        ]);
        socket.emit('dashboard-update', { dashboard, progression });
      } catch (err) {
        logger.error('Socket: dashboard request failed', { userId, error: err });
        socket.emit('error', { message: 'Failed to load dashboard' });
      }
    });

    // Client pings to check connection
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: new Date().toISOString() });
    });

    socket.on('error', (err) => {
      logger.error('Socket error', { socketId: socket.id, error: err.message });
    });
  });
};
