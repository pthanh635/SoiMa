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
    moderatorConnected: true,
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
    pendingHunterShot: null,
    lovers: null,
    wolfChildRevenge: emptyWolfChildRevenge(),
    moderatorNotes: [],
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

export function leaveRoom(room, socketId) {
  if (room.moderatorId === socketId) {
    room.moderatorConnected = false;
    room.moderatorDisconnected = true;
    room.resultMessage = 'Người quản trò đã rời phòng.';
    return { room, type: 'moderator' };
  }

  const index = room.players.findIndex(player => player.id === socketId);
  if (index === -1) throw new Error('Bạn không thuộc phòng này.');
  const player = room.players[index];

  if (room.status === 'waiting') {
    room.players.splice(index, 1);
  } else {
    player.connected = false;
    player.left = true;
    player.leftAt = Date.now();
  }
  room.resultMessage = `${player.name} đã rời phòng.`;
  return { room, type: 'player', player };
}

export function removePlayer(socketId) {
  for (const room of rooms.values()) {
    if (room.moderatorId === socketId && room.moderatorConnected !== false) {
      room.moderatorConnected = false;
      room.moderatorDisconnected = true;
      room.resultMessage = 'Người quản trò đã mất kết nối.';
      return room;
    }

    const idx = room.players.findIndex(p => p.id === socketId && !p.left);
    if (idx === -1) continue;

    const player = room.players[idx];
    if (room.status === 'waiting') {
      room.players.splice(idx, 1);
    } else {
      player.connected = false;
    }
    room.resultMessage = `${player.name} đã mất kết nối.`;

    return room;
  }

  return null;
}

export function getRoomByPlayer(socketId) {
  for (const room of rooms.values()) {
    if ((room.moderatorId === socketId && room.moderatorConnected !== false) || room.players.some(p => p.id === socketId && !p.left)) return room;
  }
  return null;
}

export function normalizeCode(code) {
  return String(code || '').trim().toUpperCase();
}

export function emptyNightActions() {
  return {
    werewolfTarget: null,
    werewolfTargets: [],
    werewolfVotes: {},
    seerTarget: null,
    guardTarget: null,
    witchHealTarget: null,
    witchPoisonTarget: null,
    witchHealDecision: null,
    witchPoisonDecision: null,
    acted: {}
  };
}

export function emptyWolfChildRevenge() {
  return {
    pending: false,
    active: false,
    used: false,
    triggeredById: null,
    triggeredByName: null,
    triggeredAtRound: null,
    activeRound: null
  };
}

function makePlayer(id, name) {
  return {
    id,
    name: String(name || 'Người chơi').trim().slice(0, 24),
    role: null,
    team: null,
    alive: true,
    connected: true,
    left: false,
    leftAt: null,
    hasUsedHunterShot: false,
    hasTriggeredWolfChildRevenge: false,
    elderLives: 1,
    originalRole: null,
    isConvertedWerewolf: false,
    convertedAtRound: null,
    isLover: false,
    loverPartnerId: null,
    witchPotions: null
  };
}
