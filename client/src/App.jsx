import React, { useEffect, useMemo, useState } from 'react';
import { socket } from './socket.js';

const PHASE_LABEL = {
  lobby: 'Sảnh chờ',
  night: 'Ban đêm',
  day: 'Ban ngày',
  voting: 'Biểu quyết',
  hunter_shot: 'Phát bắn Thợ săn',
  ended: 'Kết thúc'
};

const ROLE_HINT = {
  villager: 'Quan sát, thảo luận và tìm ra Ma sói trước khi ngôi làng bị chiếm.',
  werewolf: 'Ban đêm chọn một người để cắn. Ban ngày hãy che giấu thân phận của bạn.',
  wolf_child: 'Nếu bạn chết, đêm sau phe Sói được cắn 2 người.',
  seer: 'Mỗi đêm soi một người để biết họ thuộc phe Dân làng hay Ma sói.',
  guard: 'Mỗi đêm chọn một người để bảo vệ khỏi đòn cắn của Ma sói.',
  witch: 'Bạn có một bình cứu và một bình độc, mỗi bình chỉ dùng được một lần trong cả game.',
  hunter: 'Khi chết, bạn có một phát bắn cuối cùng để loại một người chơi còn sống.',
  cupid: 'Đêm đầu tiên chọn hai người chơi để trở thành Cặp đôi.',
  elder: 'Bạn có thể sống sót sau lần đầu bị Ma Sói cắn.',
  cursed_villager: 'Nếu bị Ma Sói cắn, bạn sẽ hóa thành Ma Sói thay vì chết.'
};

const NIGHT_INFO = {
  cupid: { title: 'Thần tình yêu đang thức dậy', instruction: 'Chọn đúng 2 người chơi để ghép thành Cặp đôi.' },
  werewolf: { title: 'Ma sói đang thức dậy', instruction: 'Chọn một người để cắn.' },
  guard: { title: 'Bảo vệ đang thức dậy', instruction: 'Chọn một người để bảo vệ.' },
  seer: { title: 'Tiên tri đang thức dậy', instruction: 'Chọn một người để soi phe.' },
  witch: { title: 'Phù thủy đang thức dậy', instruction: 'Cân nhắc sử dụng bình cứu hoặc chọn một người để dùng bình độc.' }
};

const BLANK_VOTE = '**blank**';

// Put new role artwork in client/public/roles/<filename>.png and add the mapping here.
// The UI uses public paths so future images do not need import changes.
const ROLE_IMAGES = {
  villager: '/roles/villager.png',
  guard: '/roles/guard.png',
  seer: '/roles/seer.png',
  witch: '/roles/witch.png',
  hunter: '/roles/hunter.png',
  cupid: '/roles/cupid.png',
  elder: '/roles/elder.png',
  cursed_villager: '/roles/cursed.png',
  werewolf: '/roles/werewolf.png',
  wolf_child: '/roles/wolfcub.png'
};

const ROLE_IMAGE_ALIASES = {
  cursed: 'cursed_villager',
  wolfcub: 'wolf_child',
  wolf_child: 'wolf_child',
  werewolf: 'werewolf',
  bodyguard: 'guard',
  protector: 'guard',
  fortune_teller: 'seer'
};

function getRoleImage(roleKey) {
  if (!roleKey) return null;
  const normalizedKey = ROLE_IMAGE_ALIASES[roleKey] || roleKey;
  return ROLE_IMAGES[normalizedKey] || null;
}

function RoleImage({ roleKey, label, size = 'large' }) {
  const src = getRoleImage(roleKey);
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [src, roleKey]);
  const fallbackLabel = (label || roleKey || '?').trim();
  const fallbackText = fallbackLabel.charAt(0).toUpperCase();
  if (!src || broken) {
    return (
      <div
        className={`role-image-placeholder ${size === 'thumb' ? 'role-image-thumb' : 'role-image-large'}`}
        aria-hidden="true"
        data-role-key={roleKey || ''}
        data-role-src={src || ''}
        title={`${roleKey || ''} -> ${src || 'no-src'}`}
      >
        <span>{fallbackText}</span>
      </div>
    );
  }
  return (
    <img
      className={size === 'thumb' ? 'role-image-thumb' : 'role-image-large'}
      src={src}
      alt={fallbackLabel}
      title={`${roleKey || ''} -> ${src || 'no-src'}`}
      data-role-key={roleKey || ''}
      data-role-src={src || ''}
      onError={() => {
        console.warn('Role image failed:', { roleKey, src });
        setBroken(true);
      }}
    />
  );
}

export default function App() {
  const [screen, setScreen] = useState('home');
  const [moderatorName, setModeratorName] = useState(localStorage.getItem('masoi_moderator_name') || '');
  const [playerName, setPlayerName] = useState(localStorage.getItem('masoi_player_name') || '');
  const [roomCode, setRoomCode] = useState('');
  const [state, setState] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [chatText, setChatText] = useState('');
  const [selectedTarget, setSelectedTarget] = useState('');
  const [selectedCupidTargets, setSelectedCupidTargets] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleState = nextState => {
      setState(nextState);
      setScreen(nextState?.phase === 'lobby' ? 'lobby' : 'game');
      setError('');
    };
    const handlePrivateMessage = message => setNotice(message);
    socket.on('game_state', handleState);
    socket.on('private_message', handlePrivateMessage);
    return () => {
      socket.off('game_state', handleState);
      socket.off('private_message', handlePrivateMessage);
    };
  }, []);

  useEffect(() => {
    setSelectedTarget('');
    setSelectedCupidTargets([]);
    if (state?.phase !== 'voting') setHasVoted(false);
  }, [state?.phase, state?.nightTurn, state?.round]);

  const players = state?.players || [];
  const alivePlayers = useMemo(() => players.filter(player => player.alive), [players]);
  const canActAtNight = Boolean(state?.phase === 'night' && state?.me?.alive && state?.isMyNightTurn);

  function emit(event, payload, success) {
    setError('');
    socket.emit(event, payload, response => {
      if (!response?.ok) {
        setError(response?.error || 'Có lỗi xảy ra. Vui lòng thử lại.');
        return;
      }
      success?.(response);
      if (response?.message) setNotice(response.message);
    });
  }

  function createRoom() {
    const cleanName = moderatorName.trim();
    if (!cleanName) return setError('Vui lòng nhập tên Quản trò.');
    localStorage.setItem('masoi_moderator_name', cleanName);
    emit('create_room', { name: cleanName });
  }

  function joinRoom() {
    const cleanName = playerName.trim();
    if (!cleanName) return setError('Vui lòng nhập tên người chơi.');
    const normalizedRoomCode = roomCode.trim().toUpperCase();
    if (!normalizedRoomCode) return setError('Vui lòng nhập mã phòng.');
    localStorage.setItem('masoi_player_name', cleanName);
    emit('join_room', { roomCode: normalizedRoomCode, name: cleanName });
  }

  function copyRoomCode() {
    if (!state?.code) return;
    navigator.clipboard?.writeText(state.code).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    }).catch(() => setError('Không thể sao chép tự động. Hãy chọn và sao chép mã phòng.'));
  }

  function sendMessage(event) {
    event.preventDefault();
    if (!chatText.trim() || !state?.code) return;
    emit('send_message', { roomCode: state.code, text: chatText }, () => setChatText(''));
  }

  function leaveCurrentRoom() {
    if (!state?.code || !window.confirm('Bạn có chắc muốn rời phòng không?')) return;
    emit('leave_room', { roomCode: state.code }, () => {
      localStorage.removeItem('masoi_room_code');
      localStorage.removeItem('masoi_last_room_code');
      setRoomCode('');
      setState(null);
      setNotice('');
      setError('');
      setScreen('home');
    });
  }

  if (screen === 'home') {
    return <HomeScreen moderatorName={moderatorName} setModeratorName={setModeratorName} playerName={playerName} setPlayerName={setPlayerName} roomCode={roomCode} setRoomCode={setRoomCode} onCreate={createRoom} onJoin={joinRoom} error={error} />;
  }

  if (!state) return <LoadingScreen />;

  const me = state.me;
  return (
    <main className="page game-page">
      <GameStatus state={state} onLeave={leaveCurrentRoom} />

      <div className="feedback-stack" aria-live="polite">
        {state.resultMessage && <section className="feedback result-message"><span>Thông báo</span>{state.resultMessage}</section>}
        {notice && <section className="feedback private-message"><span>Thông tin riêng</span>{notice}</section>}
        {error && <section className="feedback error-message"><span>Lỗi</span>{error}</section>}
      </div>

      {screen === 'lobby' ? (
        <Lobby state={state} onStart={() => emit('start_game', { roomCode: state.code })} onCopy={copyRoomCode} copied={copied} />
      ) : (
        <section className="game-layout">
          <aside className="left-stack">
            {state?.viewerType === 'player' ? <RolePanel state={state} /> : <ModeratorIdentity state={state} onLeave={leaveCurrentRoom} />}
            <PlayersPanel players={players} showRoleImages={Boolean(state?.isModerator)} />
          </aside>
          <div className="right-stack">
            {state.phase === 'night' && <NightPanel state={state} players={alivePlayers} canAct={canActAtNight} selectedTarget={selectedTarget} setSelectedTarget={setSelectedTarget} selectedCupidTargets={selectedCupidTargets} setSelectedCupidTargets={setSelectedCupidTargets} onAction={(target, action) => emit('night_action', Array.isArray(target) ? { roomCode: state.code, targetIds: target, action } : { roomCode: state.code, targetId: target, action })} onCupidAction={targetIds => emit('night_action', { roomCode: state.code, targetIds })} onSkip={() => emit('skip_night_turn', { roomCode: state.code })} onNextStage={() => emit('moderator_next_stage', { roomCode: state.code })} onSkipStage={() => emit('moderator_skip_stage', { roomCode: state.code })} onEndNight={() => emit('end_night', { roomCode: state.code })} />}
            {state.phase === 'day' && <DayPanel state={state} onGoVoting={() => emit('go_voting', { roomCode: state.code })} />}
            {state.phase === 'voting' && <VotingPanel state={state} players={alivePlayers} selectedTarget={selectedTarget} setSelectedTarget={setSelectedTarget} hasVoted={hasVoted} onVote={targetId => emit('vote_player', { roomCode: state.code, targetId }, () => setHasVoted(true))} onEndVote={() => emit('end_vote', { roomCode: state.code })} />}
            {state.phase === 'hunter_shot' && <HunterShotPanel state={state} players={alivePlayers} selectedTarget={selectedTarget} setSelectedTarget={setSelectedTarget} onShoot={targetId => emit('hunter_shot', { roomCode: state.code, targetId })} onSkip={() => emit('moderator_skip_hunter_shot', { roomCode: state.code })} />}
            {state.phase === 'ended' && <EndedPanel state={state} />}
            {state.phase !== 'ended' && <ChatBox state={state} chatText={chatText} setChatText={setChatText} onSend={sendMessage} />}
          </div>
        </section>
      )}
    </main>
  );
}

function HomeScreen({ moderatorName, setModeratorName, playerName, setPlayerName, roomCode, setRoomCode, onCreate, onJoin, error }) {
  const canCreate = Boolean(moderatorName.trim());
  const canJoin = Boolean(playerName.trim() && roomCode.trim());
  return (
    <main className="page home-page">
      <header className="home-hero">
        <p className="eyebrow">Trò chơi suy luận realtime</p>
        <h1>Ma Sói <span>Online</span></h1>
        <p>Tạo phòng, chia vai bí mật và chơi Ma Sói realtime cùng bạn bè.</p>
      </header>
      <section className="home-grid">
        <form className="panel entry-card" onSubmit={event => { event.preventDefault(); onCreate(); }}>
          <span className="step-number">01</span><h2>Tạo phòng làm Quản trò</h2>
          <p className="muted">Quản trò điều khiển ván chơi, gọi vai và quản lý các giai đoạn.</p>
          <label>Tên Quản trò<input value={moderatorName} onChange={event => setModeratorName(event.target.value)} placeholder="Ví dụ: Minh" maxLength="24" autoComplete="name" /></label>
          <button className="primary-btn" type="submit" disabled={!canCreate}>Tạo phòng</button>
        </form>
        <form className="panel entry-card" onSubmit={event => { event.preventDefault(); onJoin(); }}>
          <span className="step-number">02</span><h2>Vào phòng làm Người chơi</h2>
          <p className="muted">Nhập tên của bạn và mã phòng do Quản trò chia sẻ.</p>
          <label>Tên người chơi<input value={playerName} onChange={event => setPlayerName(event.target.value)} placeholder="Ví dụ: Lan" maxLength="24" autoComplete="name" /></label>
          <label>Mã phòng<input className="code-input" value={roomCode} onChange={event => setRoomCode(event.target.value.replace(/\s/g, '').toUpperCase())} placeholder="ABCD" maxLength="4" autoComplete="off" /></label>
          <button className="secondary-btn" type="submit" disabled={!canJoin}>Vào phòng</button>
        </form>
      </section>
      {error && <p className="home-error" role="alert">{error}</p>}
      <p className="home-hint">Mỗi người chơi nên mở game trên một tab hoặc thiết bị riêng.</p>
    </main>
  );
}

function LoadingScreen() {
  return <main className="page home-page"><section className="panel loading-card"><div className="moon-icon">◐</div><h1>Đang tải phòng…</h1></section></main>;
}

function GameStatus({ state, onLeave }) {
  const me = state?.me;
  return (
    <header className="topbar">
      <div className="brand-mark"><span>◐</span><div><small>MA SÓI ONLINE</small><strong>Phòng {state?.code || '—'}</strong></div></div>
      <div className="status-items">
        <div><small>Giai đoạn</small><strong>{PHASE_LABEL[state?.phase] || 'Đang chờ'}</strong></div>
        <div><small>Vòng</small><strong>{state?.round || '—'}</strong></div>
        {state?.phase === 'night' && <div><small>Lượt hiện tại</small><strong>{state?.nightTurnLabel || 'Đang xử lý'}</strong></div>}
        {state?.isModerator ? <span className="life-badge moderator-badge">Người quản trò</span> : <span className={`life-badge ${me?.alive ? 'alive' : 'dead'}`}>{me?.alive ? 'Bạn còn sống' : 'Bạn đã chết'}</span>}
        <button className="leave-btn" onClick={onLeave}>Rời phòng</button>
      </div>
    </header>
  );
}

function Lobby({ state, onStart, onCopy, copied }) {
  const players = state?.players || [];
  return (
    <section className="lobby-layout">
      <article className="panel lobby-intro">
        <p className="eyebrow">Mã phòng</p><div className="room-code">{state?.code || '—'}</div>
        <button className="copy-btn" onClick={onCopy}>{copied ? 'Đã sao chép' : 'Sao chép mã phòng'}</button>
        <div className="waiting-orb">◐</div><h2>Đang chờ người chơi khác…</h2>
        <p className={`viewer-identity ${state?.isModerator ? 'moderator' : ''}`}>{state?.isModerator ? 'Bạn là Người quản trò' : 'Bạn là Người chơi'}</p>
        <p className="muted">Cần ít nhất 4 người để bắt đầu. Bộ vai được đề xuất tự động theo số người trong phòng.</p>
        <PresetPreview state={state} />
        {state?.isModerator && <RoleLibrary roles={state?.roleLibrary || []} />}
        {state?.isModerator ? <button className="primary-btn start-btn" onClick={onStart}>Bắt đầu game</button> : <p className="host-note">Đang chờ Người quản trò bắt đầu game.</p>}
      </article>
      <PlayersPanel players={players} compact showRoleImages={Boolean(state?.isModerator)} />
    </section>
  );
}

function PresetPreview({ state }) {
  const items = state?.suggestedPresetItems || [];
  const alternatives = state?.suggestedPresetAlternatives || [];
  return (
    <div className="preset-preview">
      <div className="preset-heading"><div><p className="eyebrow">Gợi ý tự động</p><h3>Preset cho {state?.playerCount ?? 0} người</h3></div><span className="count-badge">{items.reduce((sum, item) => sum + (item?.count || 0), 0)} vai</span></div>
      <PresetItems items={items} />
      {state?.presetWarning && <div className="preset-warning"><strong>Có vai chưa triển khai</strong><span>{state.presetWarning}</span></div>}
      {alternatives.map(alternative => <div className="preset-alternative" key={alternative.key}><strong>{alternative.label}</strong><PresetItems items={alternative.items || []} /></div>)}
    </div>
  );
}

function PresetItems({ items = [] }) {
  return <div className="preset-items">{items.map(item => <div className="preset-role" key={item.role} title={item.description}><div><strong>{item.labelVi}</strong><span>×{item.count}</span></div><p>{item.shortDescription}</p><small className={item.isImplemented ? 'implemented' : 'unimplemented'}>{item.isImplemented ? 'Đã triển khai' : 'Chưa triển khai'}</small></div>)}</div>;
}

const FACTION_LABEL = { village: 'Phe Dân Làng', werewolf: 'Phe Ma Sói', solo: 'Phe Solo', lovers: 'Phe Cặp Đôi', special: 'Phe Đặc Biệt', random: 'Phe Đặc Biệt / Random' };

function RoleLibrary({ roles = [] }) {
  const factions = ['village', 'werewolf', 'solo', 'lovers', 'special', 'random'];
  return <details className="panel role-library"><summary>Danh sách vai trò <span>{roles.length} vai</span></summary><p className="muted">Thư viện mô tả công khai. Các vai chưa triển khai không được chia trong game.</p><div className="role-library-groups">{factions.map(faction => { const factionRoles = roles.filter(role => role.faction === faction); if (!factionRoles.length) return null; return <details key={faction}><summary>{FACTION_LABEL[faction]} <span>{factionRoles.length}</span></summary><div className="role-library-grid">{factionRoles.map(role => <article key={role.key} className="library-role" title={role.description}><RoleImage roleKey={role.key} label={role.labelVi} size="thumb" /><div><strong>{role.labelVi}</strong><small className={role.isImplemented ? 'implemented' : 'unimplemented'}>{role.isImplemented ? 'Đã triển khai' : 'Chưa triển khai'}</small></div><p>{role.shortDescription}</p><footer><span>{role.aura}</span><span>{role.group}</span>{role.isNightRole && <span>Vai đêm</span>}</footer></article>)}</div></details>; })}</div></details>;
}

function RolePanel({ state }) {
  const me = state?.me;
  const role = me?.role || 'unknown';
  const isWolfTeam = me?.team === 'werewolf' || me?.role === 'werewolf' || me?.isConvertedWerewolf;
  const status = me?.left ? 'Đã rời phòng' : !me?.connected ? 'Mất kết nối' : me?.alive ? 'Còn sống' : 'Đã chết';
  const currentAction = state?.isMyNightTurn ? NIGHT_INFO[state?.currentNightStage]?.instruction : null;
  return (
    <section className={`panel role-card role-${role}`}>
      <RoleImage roleKey={me?.role} label={me?.roleLabel || me?.role || 'Vai bí mật'} size="large" />
      <div className="panel-heading"><div><p className="eyebrow">Thông tin của bạn</p><h2>{me?.name || 'Người chơi'}</h2></div><span className={`life-badge ${me?.alive && me?.connected && !me?.left ? 'alive' : 'dead'}`}>{status}</span></div>
      <dl className="identity-grid"><div><dt>Vai trò</dt><dd>{me?.roleLabel || 'Chưa chia vai'}</dd></div><div><dt>Phe</dt><dd>{me?.teamLabel || 'Chưa xác định'}</dd></div><div><dt>Mã phòng</dt><dd>{state?.code || '—'}</dd></div><div><dt>Vòng</dt><dd>{state?.round || '—'}</dd></div><div><dt>Giai đoạn</dt><dd>{PHASE_LABEL[state?.phase] || 'Đang chờ'}</dd></div><div><dt>Trạng thái</dt><dd>{status}</dd></div></dl>
      {me?.role && <div className="role-description"><strong>Mô tả vai</strong><p>{ROLE_HINT[me.role]}</p></div>}
      {currentAction && <div className="current-action"><strong>Lượt hiện tại</strong><p>{currentAction}</p></div>}
      {me?.role === 'elder' && <ElderInfo me={me} />}
      {me?.role === 'cursed_villager' && <CursedInfo me={me} />}
      {isWolfTeam && <WerewolfTeammates teammates={me?.werewolfTeammates || []} />}
      {state?.loverInfo && <LoverInfo info={state.loverInfo} />}
      {me?.role === 'witch' && <div className="potion-row"><span className={me?.witchPotions?.heal ? 'available' : 'used'}>Bình cứu: {me?.witchPotions?.heal ? 'còn' : 'đã dùng'}</span><span className={me?.witchPotions?.poison ? 'available' : 'used'}>Bình độc: {me?.witchPotions?.poison ? 'còn' : 'đã dùng'}</span></div>}
      {!me?.alive && <p className="dead-warning">Bạn đã chết và không thể hành động, nhắn tin hoặc biểu quyết.</p>}
    </section>
  );
}

function WerewolfTeammates({ teammates = [] }) {
  return <div className="wolf-teammates"><strong>Đồng đội Ma Sói</strong>{teammates.length ? <ul>{teammates.map(teammate => <li key={teammate.id}><span>{teammate.name}</span><small>{teammate.left ? 'Đã rời phòng' : !teammate.connected ? 'Mất kết nối' : teammate.alive ? 'Còn sống' : 'Đã chết'}</small></li>)}</ul> : <p>Bạn là Ma Sói duy nhất trong ván.</p>}</div>;
}

function ElderInfo({ me }) {
  return <div className="elder-info"><strong>Già làng</strong><p>Bạn có thể sống sót sau lần đầu bị Ma Sói cắn.</p><small>Mạng chống Sói: {me?.elderLives ?? 1}/{me?.elderMaxLives || 2}</small></div>;
}

function CursedInfo({ me }) {
  return <div className={`cursed-info ${me?.isConvertedWerewolf ? 'converted' : ''}`}><strong>Kẻ bị nguyền</strong>{me?.isConvertedWerewolf ? <><p>Bạn đã hóa thành Ma Sói.</p><small>Biến đổi ở vòng {me?.convertedAtRound || '—'}</small></> : <p>Nếu bị Ma Sói cắn, bạn sẽ hóa thành Ma Sói thay vì chết.</p>}</div>;
}

function LoverInfo({ info }) {
  const status = info?.partnerLeft ? 'Đã rời phòng' : !info?.partnerConnected ? 'Mất kết nối' : info?.partnerAlive ? 'Còn sống' : 'Đã chết';
  return <div className="lover-info"><strong>Cặp đôi của bạn</strong><p>Bạn đang được ghép đôi với: <strong>{info?.partnerName}</strong></p><p>Nếu một người chết, người còn lại cũng chết theo.</p><small>{status}</small></div>;
}

function ModeratorIdentity({ state, onLeave }) {
  const moderator = state?.moderator;
  const lovers = moderator?.moderatorLoversInfo;
  return <section className="panel moderator-identity"><div className="panel-heading"><div><p className="eyebrow">Thông tin Quản trò</p><h2>{moderator?.name || 'Bạn'}</h2></div><span className={`life-badge ${moderator?.connected ? 'alive' : 'dead'}`}>{moderator?.connected ? 'Đang kết nối' : 'Mất kết nối'}</span></div><dl className="identity-grid"><div><dt>Mã phòng</dt><dd>{state?.code || '—'}</dd></div><div><dt>Số người chơi</dt><dd>{state?.playerCount || 0}</dd></div><div><dt>Giai đoạn</dt><dd>{PHASE_LABEL[state?.phase] || 'Đang chờ'}</dd></div><div><dt>Vòng</dt><dd>{state?.round || '—'}</dd></div></dl><p className="muted">Quản trò điều khiển trận đấu và không tham gia như một người chơi.</p>{lovers && <div className="lover-info"><strong>Cặp đôi</strong>{lovers.names.map((name, index) => <p key={lovers.playerIds[index]}>{name} · {lovers.roleLabels[index]} · {lovers.aliveStatuses[index]?.alive ? 'Còn sống' : 'Đã chết'}</p>)}<small>Khác phe: {lovers.mixedFaction ? 'Có' : 'Không'}</small></div>}{moderator?.moderatorNotes?.length > 0 && <div className="moderator-private-log"><strong>Ghi chú riêng</strong>{moderator.moderatorNotes.map(note => <p key={note.id}>Vòng {note.round}: {note.message}</p>)}</div>}<button className="leave-btn moderator-leave" onClick={onLeave}>Rời phòng</button></section>;
}

function PlayersPanel({ players = [], compact = false, showRoleImages = false }) {
  return (
    <section className={`panel players-panel ${compact ? 'compact-panel' : ''}`}>
      <div className="panel-heading"><div><p className="eyebrow">Ngôi làng</p><h2>Người chơi</h2></div><span className="count-badge">{players.length} người</span></div>
      <div className="player-list">
        {players.length === 0 && <p className="muted">Chưa có người chơi.</p>}
        {players.map(player => { const status = player.left ? 'Đã rời phòng' : !player.connected ? 'Mất kết nối' : player.alive ? 'Sống' : 'Đã chết'; return <div className={`player-card ${player.alive && !player.left ? '' : 'is-dead'} ${player.isMe ? 'is-me' : ''}`} key={player.id}>{showRoleImages && player.roleLabel ? <RoleImage roleKey={player.role} label={player.roleLabel} size="thumb" /> : <span className="player-avatar">{player.name?.charAt(0)?.toUpperCase() || '?'}</span>}<div className="player-info"><strong>{player.name}</strong><small>{player.roleLabel || 'Vai bí mật'}</small></div><div className="tags">{player.isMe && <span>Bạn</span>}<span className={player.alive && player.connected && !player.left ? 'alive-tag' : 'dead-tag'}>{status}</span></div></div>; })}
      </div>
    </section>
  );
}

function NightPanel({ state, players = [], canAct, selectedTarget, setSelectedTarget, selectedCupidTargets, setSelectedCupidTargets, onAction, onCupidAction, onSkip, onNextStage, onSkipStage, onEndNight }) {
  const me = state?.me;
  const current = NIGHT_INFO[state?.currentNightStage] || { title: `Quản trò đang gọi: ${state?.currentNightStageLabel || 'Vai khác'}`, instruction: 'Chờ Quản trò điều phối lượt đêm.' };
  const isWitch = me?.role === 'witch';
  const isWerewolf = me?.team === 'werewolf' || me?.role === 'werewolf' || me?.isConvertedWerewolf;
  const isCupidStage = state?.currentNightStage === 'cupid';
  const witchVictim = isWitch ? players.find(player => player.id === me?.witchVictim) : null;
  const witchVictims = isWitch ? (me?.witchVictims?.length ? me.witchVictims : witchVictim ? [witchVictim] : []) : [];
  const healTargetId = selectedTarget || (witchVictims.length === 1 ? witchVictims[0].id : '');
  const teammateIds = new Set((me?.werewolfTeammates || []).map(player => player.id));
  const targets = players.filter(player => me?.role === 'guard' || (player.id !== me?.id && (!isWerewolf || !teammateIds.has(player.id))));
  const wolfInfo = state?.werewolfNightInfo;
  const wolfMaxTargets = wolfInfo?.maxTargets || 1;
  const isWolfRevenge = isWerewolf && state?.currentNightStage === 'werewolf' && wolfMaxTargets > 1;
  const ownWolfVote = wolfInfo?.votes?.find(vote => vote.wolfId === me?.id);
  const ownWolfVoteIds = ownWolfVote?.targetIds?.length ? ownWolfVote.targetIds : ownWolfVote?.targetId ? [ownWolfVote.targetId] : [];
  const hasLocalSelection = Array.isArray(selectedTarget) ? selectedTarget.length > 0 : Boolean(selectedTarget);
  const effectiveSelectedTarget = isWerewolf ? (hasLocalSelection ? selectedTarget : isWolfRevenge ? ownWolfVoteIds : ownWolfVoteIds[0] || '') : selectedTarget;
  const selectedCount = Array.isArray(effectiveSelectedTarget) ? effectiveSelectedTarget.length : effectiveSelectedTarget ? 1 : 0;
  const title = isWolfRevenge ? 'Ma Sói nổi giận' : current.title;
  const instruction = isWolfRevenge ? 'Sói con đã chết. Phe Sói có thể thống nhất tối đa 2 mục tiêu để cắn.' : current.instruction;
  function toggleWolfTarget(playerId) {
    const currentIds = Array.isArray(effectiveSelectedTarget) ? effectiveSelectedTarget : effectiveSelectedTarget ? [effectiveSelectedTarget] : [];
    if (currentIds.includes(playerId)) return setSelectedTarget(currentIds.filter(id => id !== playerId));
    if (currentIds.length < wolfMaxTargets) setSelectedTarget([...currentIds, playerId]);
  }
  return (
    <section className={`panel action-panel night-panel turn-${state?.nightTurn || 'none'}`}>
      <p className="eyebrow">Đêm {state?.round || 1}</p><h1 className="phase-title">{title}</h1><p className="instruction">{instruction}</p>
      <NightOrder state={state} />
      {!canAct && !state?.isModerator && <div className="waiting-panel"><strong>{me?.alive ? `Quản trò đang gọi: ${state?.currentNightStageLabel || 'vai hiện tại'}` : 'Bạn đã bị loại nên không thể hành động.'}</strong><p>{me?.alive ? `Quản trò đang gọi: ${state?.currentNightStageLabel || 'vai hiện tại'}. Nếu không phải lượt của bạn, hãy chờ.` : 'Bạn chỉ có thể theo dõi diễn biến.'}</p></div>}
      {canAct && <div className="your-turn"><span>ĐẾN LƯỢT BẠN HÀNH ĐỘNG</span><strong>{instruction}</strong></div>}
      {isCupidStage && canAct && me?.role === 'cupid' && <CupidSelection players={players} selected={selectedCupidTargets} setSelected={setSelectedCupidTargets} onConfirm={onCupidAction} />}
      {isCupidStage && me?.role === 'cupid' && state?.cupidInfo?.completed && <div className="success-note">Bạn đã ghép đôi: {state.cupidInfo.selectedNames.join(' và ')}.</div>}
      {isWerewolf && state?.currentNightStage === 'werewolf' && <WerewolfVoteDetails info={wolfInfo} currentWolfId={me?.id} />}
      {canAct && isWitch && <WitchActionPanel me={me} targets={targets} witchVictims={witchVictims} selectedTarget={selectedTarget} setSelectedTarget={setSelectedTarget} healTargetId={healTargetId} onAction={onAction} />}
      {canAct && !isCupidStage && !isWitch && <TargetGrid players={targets} selected={effectiveSelectedTarget} onSelect={isWolfRevenge ? toggleWolfTarget : setSelectedTarget} prefix={isWolfRevenge ? 'Chọn mục tiêu' : 'Chọn'} maxSelections={isWolfRevenge ? wolfMaxTargets : 1} />}
      {canAct && isWolfRevenge && <p className="selection-counter">Đã chọn {selectedCount}/{wolfMaxTargets}</p>}
      {canAct && !isCupidStage && !isWitch && <button className="primary-btn action-confirm" disabled={selectedCount === 0} onClick={() => onAction(effectiveSelectedTarget)}>{isWerewolf ? (isWolfRevenge ? 'Gửi biểu quyết cắn' : 'Bỏ phiếu cắn người này') : 'Xác nhận hành động'}</button>}
      {canAct && !isCupidStage && !isWitch && <button className="text-btn" onClick={onSkip}>Bỏ qua lượt của tôi</button>}
      {state?.isModerator && <ModeratorPanel state={state} onNext={onNextStage} onSkip={onSkipStage} onEndNight={onEndNight} />}
    </section>
  );
}

function NightOrder({ state }) {
  return <div className="night-order">{(state?.nightOrder || []).map((item, index) => <React.Fragment key={item.key || item.role}><span className={state?.currentNightStage === (item.key || item.role) ? 'active-turn' : ''}>{item.label}</span>{index < (state?.nightOrder?.length || 0) - 1 && <i>›</i>}</React.Fragment>)}</div>;
}

function CupidSelection({ players = [], selected = [], setSelected, onConfirm }) {
  function toggle(playerId) {
    if (selected.includes(playerId)) return setSelected(selected.filter(id => id !== playerId));
    if (selected.length < 2) setSelected([...selected, playerId]);
  }
  return <div className="cupid-selection"><h2>Bạn là Thần tình yêu</h2><p className="selection-counter">Đã chọn {selected.length}/2</p><div className="target-grid">{players.map(player => <button className={`target ${selected.includes(player.id) ? 'active' : ''}`} key={player.id} onClick={() => toggle(player.id)}><span className="target-check">{selected.includes(player.id) ? '✓' : player.name?.charAt(0)?.toUpperCase()}</span><strong>{player.name}</strong><small>{selected.includes(player.id) ? 'Đã chọn' : 'Ghép đôi'}</small></button>)}</div><button className="primary-btn action-confirm" disabled={selected.length !== 2} onClick={() => onConfirm(selected)}>Xác nhận ghép đôi</button></div>;
}

function WitchActionPanel({ me, targets = [], witchVictims = [], selectedTarget, setSelectedTarget, healTargetId, onAction }) {
  const witchStatus = me?.witchActionStatus || {};
  const healDecision = witchStatus.healDecision || (me?.witchPotions?.heal ? 'pending' : 'unavailable');
  const poisonDecision = witchStatus.poisonDecision || (me?.witchPotions?.poison ? 'pending' : 'unavailable');
  const canChooseHeal = me?.witchPotions?.heal && healDecision === 'pending';
  const canChoosePoison = me?.witchPotions?.poison && poisonDecision === 'pending';
  const healStatusText = healDecision === 'used'
    ? 'Bạn đã dùng bình cứu.'
    : healDecision === 'skipped'
      ? 'Bạn đã không dùng bình cứu.'
      : healDecision === 'unavailable'
        ? 'Đêm nay không có ai có thể cứu.'
        : witchVictims.length
          ? 'Bạn có thể chọn một người để cứu.'
          : 'Đêm nay không có ai có thể cứu.';
  const poisonStatusText = poisonDecision === 'used'
    ? 'Bạn đã dùng bình độc.'
    : poisonDecision === 'skipped'
      ? 'Bạn đã không dùng bình độc.'
      : poisonDecision === 'unavailable'
        ? 'Bình độc đã được sử dụng.'
        : 'Bạn có thể chọn một người để đầu độc.';
  return (
    <div className="witch-actions">
      <h2>Bạn là Phù thủy</h2>
      <div className="potion-row">
        <span className={me?.witchPotions?.heal ? 'available' : 'used'}>Bình cứu: {me?.witchPotions?.heal ? 'Còn' : 'Đã dùng'}</span>
        <span className={me?.witchPotions?.poison ? 'available' : 'used'}>Bình độc: {me?.witchPotions?.poison ? 'Còn' : 'Đã dùng'}</span>
      </div>
      <section className="witch-section">
        <strong>Bình cứu</strong>
        <p className={`witch-status ${healDecision !== 'pending' ? 'resolved' : ''}`}>{healStatusText}</p>
        {canChooseHeal ? (
          witchVictims.length ? (
            <>
              <p>Người có thể cứu: <strong>{witchVictims.map(victim => victim.name).join(', ')}</strong></p>
              {witchVictims.length > 1 && <TargetGrid players={witchVictims} selected={selectedTarget} onSelect={setSelectedTarget} prefix="Chọn để cứu" />}
              <div className="witch-button-row">
                <button className="safe-btn" disabled={!healTargetId} onClick={() => onAction(healTargetId, 'heal')}>Dùng bình cứu</button>
                <button className="text-btn" disabled={healDecision !== 'pending'} onClick={() => onAction(null, 'skip_heal')}>Không dùng bình cứu</button>
              </div>
            </>
          ) : (
            <div className="witch-button-row">
              <button className="text-btn" disabled={healDecision !== 'pending'} onClick={() => onAction(null, 'skip_heal')}>Không dùng bình cứu</button>
            </div>
          )
        ) : (
          <p>{healStatusText}</p>
        )}
      </section>
      <section className="witch-section">
        <strong>Bình độc</strong>
        <p className={`witch-status ${poisonDecision !== 'pending' ? 'resolved' : ''}`}>{poisonStatusText}</p>
        {canChoosePoison ? (
          <>
            <TargetGrid players={targets} selected={selectedTarget} onSelect={setSelectedTarget} prefix="Đầu độc" />
            <div className="witch-button-row">
              <button className="danger-btn" disabled={!selectedTarget} onClick={() => onAction(selectedTarget, 'poison')}>Dùng bình độc</button>
              <button className="text-btn" disabled={poisonDecision !== 'pending'} onClick={() => onAction(null, 'skip_poison')}>Không dùng bình độc</button>
            </div>
          </>
        ) : (
          <p>{poisonStatusText}</p>
        )}
      </section>
    </div>
  );
}

function ModeratorPanel({ state, onNext, onSkip, onEndNight }) {
  const moderator = state?.moderator;
  const stages = moderator?.stages || [];
  const currentIndex = state?.currentNightStageIndex ?? -1;
  const isLastStage = currentIndex === stages.length - 1;
  return (
    <div className="moderator-panel">
      <div className="panel-heading"><div><p className="eyebrow">Người quản trò</p><h2>Bảng điều khiển Quản trò</h2></div><span className="count-badge">{PHASE_LABEL[state?.phase] || '—'}</span></div>
      <p className="moderator-prompt">{moderator?.prompt || 'Đêm đã hoàn tất.'}</p>
      <div className="moderator-stages">
        {stages.map(stage => <div key={stage.key} className={`${state?.currentNightStage === stage.key ? 'active' : ''} ${stage.completed ? 'completed' : ''}`}><span>{stage.completed ? '✓' : '○'}</span><strong>{stage.labelVi}</strong><small>{stage.isImplemented ? 'Đã triển khai' : 'Chưa triển khai vai này'}</small></div>)}
      </div>
      <p className="expected-players">Người mang vai: <strong>{(moderator?.expectedPlayers || []).map(player => `${player.name} (${player.alive ? 'còn sống' : 'đã bị loại'})`).join(', ') || 'Không có'}</strong></p>
      {moderator?.noAliveActorMessage && <p className="moderator-dead-role-note">{moderator.noAliveActorMessage}</p>}
      {moderator?.wolfChildRevenge && <WolfChildRevengeStatus info={moderator.wolfChildRevenge} />}
      {state?.currentNightStage === 'cupid' && <div className="moderator-private-note"><strong>Cặp đôi</strong><p>{moderator?.moderatorLoversInfo ? `Cupid đã ghép đôi: ${moderator.moderatorLoversInfo.names.join(' và ')}.` : 'Đang chờ Cupid chọn Cặp đôi.'}</p></div>}
      {state?.currentNightStage === 'werewolf' && <div className="moderator-private-note"><WerewolfVoteDetails info={moderator?.werewolfNightInfo} /></div>}
      {state?.currentNightStage === 'witch' && <p className="moderator-private-note">Riêng Phù thủy / Quản trò: {moderator?.witchVictimMessage}</p>}
      <div className="moderator-buttons"><button className="primary-btn" onClick={onNext}>{isLastStage ? 'Hoàn tất và sang ngày' : 'Gọi vai tiếp theo'}</button><button onClick={onSkip}>{state?.currentNightStage === 'cupid' ? 'Bỏ qua ghép đôi' : 'Bỏ qua lượt này'}</button>{isLastStage && <button className="danger-outline" onClick={onEndNight}>Kết thúc đêm</button>}</div>
    </div>
  );
}

function WolfChildRevengeStatus({ info }) {
  const text = info.active
    ? 'Đêm nổi giận: Sói được cắn 2 người.'
    : info.pending
      ? 'Sói con đã chết. Đêm tới Sói được cắn 2 người.'
      : info.used
        ? 'Hiệu ứng Sói con đã dùng.'
        : 'Hiệu ứng Sói con chưa kích hoạt.';
  return <div className="moderator-private-note"><strong>Sói con</strong><p>{text}</p></div>;
}

function TargetGrid({ players = [], selected, onSelect, prefix, includeBlank = false, maxSelections = 1 }) {
  const selectedIds = Array.isArray(selected) ? selected : selected ? [selected] : [];
  return <div className="target-grid">{players.map(player => { const active = selectedIds.includes(player.id); return <button className={`target ${active ? 'active' : ''}`} key={player.id} onClick={() => onSelect(player.id)}><span className="target-check">{active ? '✓' : player.name?.charAt(0)?.toUpperCase()}</span><strong>{player.name}</strong><small>{active ? (maxSelections > 1 ? `Đã chọn ${selectedIds.indexOf(player.id) + 1}/${maxSelections}` : 'Đã chọn') : prefix}</small></button>; })}{includeBlank && <button className={`target blank-vote ${selected === BLANK_VOTE ? 'active' : ''}`} onClick={() => onSelect(BLANK_VOTE)}><span className="target-check">{selected === BLANK_VOTE ? '✓' : '—'}</span><strong>Phiếu trắng</strong><small>{selected === BLANK_VOTE ? 'Bạn đã chọn Phiếu trắng' : 'Không treo cổ ai'}</small></button>}</div>;
}

function DayPanel({ state, onGoVoting }) {
  return <section className="panel action-panel day-panel"><p className="eyebrow">Ban ngày · Vòng {state?.round || 1}</p><h1 className="phase-title">Thảo luận trong làng</h1><p className="instruction">Chia sẻ manh mối, đối chiếu lời khai và tìm ra người đáng ngờ.</p>{state?.isModerator ? <button className="primary-btn" onClick={onGoVoting}>Bắt đầu biểu quyết</button> : <div className="waiting-panel"><strong>Đang thảo luận</strong><p>Người quản trò sẽ bắt đầu biểu quyết khi mọi người sẵn sàng.</p></div>}</section>;
}

function VotingPanel({ state, players = [], selectedTarget, setSelectedTarget, hasVoted, onVote, onEndVote }) {
  const canVote = Boolean(state?.me?.alive);
  const targets = players.filter(player => player.id !== state?.me?.id);
  return <section className="panel action-panel voting-panel"><p className="eyebrow">{state?.votesCount || 0} phiếu đã ghi nhận</p><h1 className="phase-title">Biểu quyết treo cổ</h1><p className="instruction">Chọn người bạn nghi ngờ hoặc chọn Phiếu trắng.</p>{canVote ? <>{hasVoted && <div className="success-note">{selectedTarget === BLANK_VOTE ? 'Bạn đã chọn Phiếu trắng.' : 'Phiếu của bạn đã được ghi nhận.'} Bạn vẫn có thể đổi phiếu trước khi Người quản trò chốt.</div>}<TargetGrid players={targets} selected={selectedTarget} onSelect={setSelectedTarget} prefix="Bỏ phiếu" includeBlank /><button className="primary-btn action-confirm" disabled={!selectedTarget} onClick={() => onVote(selectedTarget)}>{hasVoted ? 'Cập nhật phiếu' : 'Xác nhận bỏ phiếu'}</button></> : <div className="waiting-panel"><strong>{state?.isModerator ? 'Bạn đang điều khiển biểu quyết' : 'Bạn không thể biểu quyết'}</strong><p>{state?.isModerator ? 'Người quản trò không tham gia bỏ phiếu.' : 'Người chơi đã chết chỉ có thể theo dõi kết quả.'}</p></div>}{state?.isModerator && <div className="host-controls"><p>Điều khiển quản trò</p><button className="danger-btn" onClick={onEndVote}>Chốt biểu quyết</button></div>}</section>;
}

function WerewolfVoteDetails({ info, currentWolfId }) {
  const finalizedNames = info?.finalizedTargetNames?.length ? info.finalizedTargetNames.join(', ') : info?.finalizedTargetName;
  return <div className="wolf-vote-status"><strong>Biểu quyết của Ma Sói</strong>{info?.isWolfChildRevengeActive && <p className="revenge-note">{info.revengeLabel}</p>}<div className="wolf-vote-list">{(info?.votes || []).map(vote => { const names = vote.targetNames?.length ? vote.targetNames.join(', ') : vote.targetName; return <div key={vote.wolfId}><span>{vote.wolfName}{vote.wolfId === currentWolfId ? ' (Bạn)' : ''}</span><small>{vote.left ? 'Đã rời phòng' : !vote.connected ? 'Mất kết nối' : names ? `Đã chọn: ${names}` : 'Chưa chọn'}</small></div>; })}</div><p>Đã có <strong>{info?.votedCount || 0}/{info?.totalAliveWolves || 0}</strong> Sói gửi biểu quyết.</p><p>{info?.isFinalized ? <>Mục tiêu đã thống nhất: <strong>{finalizedNames}</strong></> : (info?.maxTargets || 1) > 1 ? 'Sói chưa thống nhất đủ mục tiêu.' : 'Sói chưa thống nhất mục tiêu.'}</p></div>;
}

function HunterShotPanel({ state, players = [], selectedTarget, setSelectedTarget, onShoot, onSkip }) {
  const isHunter = Boolean(state?.pendingHunterShot?.isMine);
  const targets = players.filter(player => player.id !== state?.me?.id);
  return <section className="panel action-panel hunter-shot-panel"><p className="eyebrow">Phát bắn cuối cùng</p>{isHunter ? <><h1 className="phase-title">Bạn là Thợ săn. Hãy chọn một người để bắn.</h1><p className="instruction">Bạn đã bị loại và có quyền bắn một người trước khi rời ván.</p><TargetGrid players={targets} selected={selectedTarget} onSelect={setSelectedTarget} prefix="Chọn để bắn" /><button className="danger-btn action-confirm" disabled={!selectedTarget} onClick={() => onShoot(selectedTarget)}>Bắn người này</button></> : state?.isModerator ? <><h1 className="phase-title">Thợ săn đang chọn người bắn.</h1><p className="instruction"><strong>{state?.pendingHunterShot?.hunterName}</strong> có một phát bắn cuối cùng.</p><div className="waiting-panel"><strong>Mục tiêu còn sống</strong><p>{targets.map(player => player.name).join(', ') || 'Không còn mục tiêu hợp lệ.'}</p></div><div className="host-controls"><p>Điều khiển quản trò</p><button className="danger-outline" onClick={onSkip}>Bỏ qua phát bắn</button></div></> : <><h1 className="phase-title">Thợ săn đang chọn người bắn.</h1><div className="waiting-panel"><strong>Đang chờ Thợ săn quyết định.</strong><p>Ván chơi sẽ tiếp tục sau khi phát bắn được xử lý.</p></div></>}</section>;
}

function EndedPanel({ state }) {
  const villageWon = state?.resultMessage?.toLowerCase().includes('dân làng');
  return <section className={`panel ended-panel ${villageWon ? 'village-win' : 'wolf-win'}`}><p className="eyebrow">Trò chơi kết thúc</p><h1>{state?.resultMessage || 'Ván đấu đã kết thúc'}</h1><p className="muted">Danh tính của tất cả người chơi đã được hé lộ.</p><div className="final-roles">{(state?.players || []).map(player => <div key={player.id}><span>{player.name}</span><strong>{player.roleLabel || 'Không rõ'}</strong></div>)}</div><p className="restart-note">Để chơi ván mới, hãy mở lại trang và tạo hoặc tham gia một phòng khác.</p></section>;
}

function ChatBox({ state, chatText, setChatText, onSend }) {
  const chat = state?.chat || [];
  const isDead = state?.me && !state.me.alive;
  const canChat = ['day', 'voting', 'lobby'].includes(state?.phase) && state?.me?.alive;
  return <section className="panel chat-panel"><div className="panel-heading"><div><p className="eyebrow">Kênh làng</p><h2>Thảo luận</h2></div><span className="online-dot">Realtime</span></div><div className="chat-list">{chat.length === 0 && <div className="empty-chat">Chưa có tin nhắn. Hãy bắt đầu cuộc thảo luận.</div>}{chat.map(message => <div className={`chat-message ${message.senderId === state?.me?.id ? 'mine' : ''}`} key={message.id}><div><strong>{message.senderName}</strong><small>{message.senderId === state?.me?.id ? 'Bạn' : 'Người chơi'}</small></div><p>{message.text}</p></div>)}</div>{isDead && <p className="dead-chat-note">Bạn đã chết nên không thể nhắn trong cuộc thảo luận.</p>}<form onSubmit={onSend} className="chat-form"><input value={chatText} disabled={!canChat} onChange={event => setChatText(event.target.value)} placeholder={canChat ? 'Nhập tin nhắn…' : 'Chat không khả dụng lúc này'} maxLength="300" /><button className="primary-btn" disabled={!canChat || !chatText.trim()}>Gửi</button></form></section>;
}
