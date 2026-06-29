import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import { createRoom, getRoomByPlayer, joinRoom, normalizeCode, removePlayer, rooms } from './rooms.js';
import { addChat, doNightAction, endVote, goVoting, hunterShot, moderatorEndNight, moderatorNextStage, moderatorSkipHunterShot, moderatorSkipStage, publicStateFor, skipNightTurn, startGame, votePlayer } from './gameLogic.js';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const corsOrigin = process.env.CORS_ORIGIN || (isProduction ? null : 'http://localhost:5173');
if (corsOrigin) app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, rooms: rooms.size });
});

const httpServer = createServer(app);
const io = new Server(httpServer, corsOrigin ? {
  cors: { origin: corsOrigin, methods: ['GET', 'POST'] }
} : {});

io.on('connection', socket => {
  socket.on('create_room', ({ name }, cb) => {
    safe(cb, () => {
      const room = createRoom(socket.id, name);
      socket.join(room.code);
      emitRoom(room);
      return { ok: true, roomCode: room.code };
    });
  });

  socket.on('join_room', ({ roomCode, name }, cb) => {
    safe(cb, () => {
      const code = normalizeCode(roomCode);
      const room = joinRoom(code, socket.id, name);
      socket.join(room.code);
      emitRoom(room);
      return { ok: true, roomCode: room.code };
    });
  });

  socket.on('start_game', ({ roomCode }, cb) => {
    safe(cb, () => {
      const room = requireRoom(roomCode);
      requireModerator(room, socket.id);
      startGame(room);
      emitRoom(room);
      return { ok: true };
    });
  });

  socket.on('night_action', ({ roomCode, targetId, action }, cb) => {
    safe(cb, () => {
      const room = requireRoom(roomCode);
      const result = doNightAction(room, socket.id, targetId, action);
      if (result.type === 'seer') socket.emit('private_message', result.message);
      emitRoom(room);
      return { ok: true, message: result.message };
    });
  });

  socket.on('skip_night_turn', ({ roomCode }, cb) => {
    safe(cb, () => {
      const room = requireRoom(roomCode);
      const result = skipNightTurn(room, socket.id);
      emitRoom(room);
      return { ok: true, message: result.message };
    });
  });

  socket.on('moderator_next_stage', ({ roomCode }, cb) => {
    safe(cb, () => {
      const room = requireRoom(roomCode);
      const result = moderatorNextStage(room, socket.id);
      emitRoom(room);
      return { ok: true, message: result?.message };
    });
  });

  socket.on('moderator_skip_stage', ({ roomCode }, cb) => {
    safe(cb, () => {
      const room = requireRoom(roomCode);
      const result = moderatorSkipStage(room, socket.id);
      emitRoom(room);
      return { ok: true, message: result?.message };
    });
  });

  socket.on('end_night', ({ roomCode }, cb) => {
    safe(cb, () => {
      const room = requireRoom(roomCode);
      moderatorEndNight(room, socket.id);
      emitRoom(room);
      return { ok: true };
    });
  });

  socket.on('go_voting', ({ roomCode }, cb) => {
    safe(cb, () => {
      const room = requireRoom(roomCode);
      requireModerator(room, socket.id);
      goVoting(room);
      emitRoom(room);
      return { ok: true };
    });
  });

  socket.on('vote_player', ({ roomCode, targetId }, cb) => {
    safe(cb, () => {
      const room = requireRoom(roomCode);
      votePlayer(room, socket.id, targetId);
      emitRoom(room);
      return { ok: true };
    });
  });

  socket.on('end_vote', ({ roomCode }, cb) => {
    safe(cb, () => {
      const room = requireRoom(roomCode);
      requireModerator(room, socket.id);
      endVote(room);
      emitRoom(room);
      return { ok: true };
    });
  });

  socket.on('hunter_shot', ({ roomCode, targetId }, cb) => {
    safe(cb, () => {
      const room = requireRoom(roomCode);
      const result = hunterShot(room, socket.id, targetId);
      emitRoom(room);
      return { ok: true, message: result.message };
    });
  });

  socket.on('moderator_skip_hunter_shot', ({ roomCode }, cb) => {
    safe(cb, () => {
      const room = requireRoom(roomCode);
      const result = moderatorSkipHunterShot(room, socket.id);
      emitRoom(room);
      return { ok: true, message: result.message };
    });
  });

  socket.on('send_message', ({ roomCode, text }, cb) => {
    safe(cb, () => {
      const room = requireRoom(roomCode);
      addChat(room, socket.id, text);
      emitRoom(room);
      return { ok: true };
    });
  });

  socket.on('disconnect', () => {
    const room = removePlayer(socket.id);
    if (room) emitRoom(room);
  });
});

if (isProduction) {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const clientDist = path.resolve(currentDir, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

function requireRoom(roomCode) {
  const room = rooms.get(normalizeCode(roomCode));
  if (!room) throw new Error('Không tìm thấy phòng.');
  return room;
}

function requireModerator(room, socketId) {
  if (room.moderatorId !== socketId) throw new Error('Chỉ Người quản trò mới được điều khiển trận đấu.');
}

function emitRoom(room) {
  io.to(room.moderatorId).emit('game_state', publicStateFor(room, room.moderatorId));
  for (const player of room.players) {
    io.to(player.id).emit('game_state', publicStateFor(room, player.id));
  }
}

function safe(cb, fn) {
  try {
    const result = fn();
    cb?.(result);
  } catch (error) {
    cb?.({ ok: false, error: error.message || 'Có lỗi xảy ra.' });
  }
}

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`MaSoi server running at http://localhost:${PORT}`);
});
