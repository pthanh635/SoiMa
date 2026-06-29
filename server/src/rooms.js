import { customAlphabet } from 'nanoid';

const makeCode = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 4);
export const rooms = new Map();

export function createRoom(moderatorSocketId, moderatorName) {
  let code = makeCode();
  while (rooms.has(code)) code = makeCode();

  const room = {
    code,
    moderatorId: moderatorSocketId,
    moderatorName: String(moderatorName || 'Người quản trò').trim().slice(0, 24),
    moderatorDisconnected: false,
    status: 'waiting',
    phase: 'lobby',
    round: 0,
    resultMessage: 'Đang chờ người chơi...',
    players: [],
    currentNightStage: null,
    currentNightStageIndex: -1,
    completedNightStages: [],
    activeNightStages: [],
    assignedRoleCounts: {},
    nightTurn: null,
    nightTurnIndex: -1,
    nightActions: emptyNightActions(),
    votes: {},
    chat: []
  };

  rooms.set(code, room);
  return room;
}

export function joinRoom(code, socketId, name) {
  const room = rooms.get(normalizeCode(code));
  if (!room) throw new Error('Không tìm thấy phòng.');
  if (room.status !== 'waiting') throw new Error('Phòng đã bắt đầu chơi.');
  if (room.moderatorId === socketId) throw new Error('Người quản trò không thể tham gia như người chơi.');
  if (room.players.some(p => p.id === socketId)) return room;
  if (room.players.length >= 24) throw new Error('Phòng tối đa 24 người.');

  room.players.push(makePlayer(socketId, name));
  room.resultMessage = `${name} đã vào phòng.`;
  return room;
}

export function removePlayer(socketId) {
  for (const room of rooms.values()) {
    if (room.moderatorId === socketId) {
      room.moderatorDisconnected = true;
      room.resultMessage = 'Người quản trò đã rời phòng.';
      return room;
    }

    const idx = room.players.findIndex(p => p.id === socketId);
    if (idx === -1) continue;

    const [left] = room.players.splice(idx, 1);
    room.resultMessage = `${left.name} đã rời phòng.`;

    return room;
  }

  return null;
}

export function getRoomByPlayer(socketId) {
  for (const room of rooms.values()) {
    if (room.moderatorId === socketId || room.players.some(p => p.id === socketId)) return room;
  }
  return null;
}

export function normalizeCode(code) {
  return String(code || '').trim().toUpperCase();
}

export function emptyNightActions() {
  return {
    werewolfTarget: null,
    seerTarget: null,
    guardTarget: null,
    witchHealTarget: null,
    witchPoisonTarget: null,
    acted: {}
  };
}

function makePlayer(id, name) {
  return {
    id,
    name: String(name || 'Người chơi').trim().slice(0, 24),
    role: null,
    team: null,
    alive: true,
    witchPotions: null
  };
}
