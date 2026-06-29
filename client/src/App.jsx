import React, { useEffect, useMemo, useState } from 'react';
import { socket } from './socket.js';

const PHASE_LABEL = {
  lobby: 'Sảnh chờ',
  night: 'Ban đêm',
  day: 'Ban ngày',
  voting: 'Biểu quyết',
  ended: 'Kết thúc'
};

const ROLE_HINT = {
  villager: 'Quan sát, thảo luận và tìm ra Ma sói trước khi ngôi làng bị chiếm.',
  werewolf: 'Ban đêm chọn một người để cắn. Ban ngày hãy che giấu thân phận của bạn.',
  seer: 'Mỗi đêm soi một người để biết họ thuộc phe Dân làng hay Ma sói.',
  guard: 'Mỗi đêm chọn một người để bảo vệ khỏi đòn cắn của Ma sói.',
  witch: 'Bạn có một bình cứu và một bình độc, mỗi bình chỉ dùng được một lần trong cả game.'
};

const NIGHT_INFO = {
  werewolf: { title: 'Ma sói đang thức dậy', instruction: 'Chọn một người để cắn.' },
  guard: { title: 'Bảo vệ đang thức dậy', instruction: 'Chọn một người để bảo vệ.' },
  seer: { title: 'Tiên tri đang thức dậy', instruction: 'Chọn một người để soi phe.' },
  witch: { title: 'Phù thủy đang thức dậy', instruction: 'Cân nhắc sử dụng bình cứu hoặc chọn một người để dùng bình độc.' }
};

const BLANK_VOTE = '**blank**';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [name, setName] = useState(localStorage.getItem('masoi_name') || '');
  const [roomInput, setRoomInput] = useState('');
  const [state, setState] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [chatText, setChatText] = useState('');
  const [selectedTarget, setSelectedTarget] = useState('');
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
    if (state?.phase !== 'voting') setHasVoted(false);
  }, [state?.phase, state?.nightTurn, state?.round]);

  const players = state?.players || [];
  const alivePlayers = useMemo(() => players.filter(player => player.alive), [players]);
  const canActAtNight = Boolean(state?.phase === 'night' && state?.me?.alive && state?.isMyNightTurn);

  function saveName() {
    const cleanName = name.trim();
    if (!cleanName) {
      setError('Vui lòng nhập tên của bạn.');
      return null;
    }
    localStorage.setItem('masoi_name', cleanName);
    return cleanName;
  }

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
    const cleanName = saveName();
    if (cleanName) emit('create_room', { name: cleanName });
  }

  function joinRoom() {
    const cleanName = saveName();
    if (!cleanName) return;
    const roomCode = roomInput.trim().toUpperCase();
    if (!roomCode) return setError('Vui lòng nhập mã phòng.');
    emit('join_room', { roomCode, name: cleanName });
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

  if (screen === 'home') {
    return <HomeScreen name={name} setName={setName} roomInput={roomInput} setRoomInput={setRoomInput} onCreate={createRoom} onJoin={joinRoom} error={error} />;
  }

  if (!state) return <LoadingScreen />;

  const me = state.me;
  return (
    <main className="page game-page">
      <GameStatus state={state} />

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
            {state?.viewerType === 'player' ? <RolePanel me={me} /> : <><ModeratorIdentity state={state} /><PresetPreview state={state} /><RoleLibrary roles={state?.roleLibrary || []} /></>}
            <PlayersPanel players={players} />
          </aside>
          <div className="right-stack">
            {state.phase === 'night' && <NightPanel state={state} players={alivePlayers} canAct={canActAtNight} selectedTarget={selectedTarget} setSelectedTarget={setSelectedTarget} onAction={(targetId, action) => emit('night_action', { roomCode: state.code, targetId, action })} onSkip={() => emit('skip_night_turn', { roomCode: state.code })} onNextStage={() => emit('moderator_next_stage', { roomCode: state.code })} onSkipStage={() => emit('moderator_skip_stage', { roomCode: state.code })} onEndNight={() => emit('end_night', { roomCode: state.code })} />}
            {state.phase === 'day' && <DayPanel state={state} onGoVoting={() => emit('go_voting', { roomCode: state.code })} />}
            {state.phase === 'voting' && <VotingPanel state={state} players={alivePlayers} selectedTarget={selectedTarget} setSelectedTarget={setSelectedTarget} hasVoted={hasVoted} onVote={targetId => emit('vote_player', { roomCode: state.code, targetId }, () => setHasVoted(true))} onEndVote={() => emit('end_vote', { roomCode: state.code })} />}
            {state.phase === 'ended' && <EndedPanel state={state} />}
            {state.phase !== 'ended' && <ChatBox state={state} chatText={chatText} setChatText={setChatText} onSend={sendMessage} />}
          </div>
        </section>
      )}
    </main>
  );
}

function HomeScreen({ name, setName, roomInput, setRoomInput, onCreate, onJoin, error }) {
  return (
    <main className="page home-page">
      <header className="home-hero">
        <p className="eyebrow">Trò chơi suy luận realtime</p>
        <h1>Ma Sói <span>Online</span></h1>
        <p>Tạo phòng, chia vai bí mật và chơi Ma Sói realtime cùng bạn bè.</p>
      </header>
      <section className="home-grid">
        <article className="panel entry-card">
          <span className="step-number">01</span><h2>Tạo phòng làm Quản trò</h2>
          <p className="muted">Điều khiển trận đấu và mời người chơi tham gia.</p>
          <label>Tên Quản trò<input value={name} onChange={event => setName(event.target.value)} placeholder="Ví dụ: Minh" maxLength="24" /></label>
          <button className="primary-btn" onClick={onCreate}>Tạo phòng làm Quản trò</button>
        </article>
        <article className="panel entry-card">
          <span className="step-number">02</span><h2>Vào phòng làm Người chơi</h2>
          <p className="muted">Nhập mã phòng do Người quản trò chia sẻ.</p>
          <label>Mã phòng<input className="code-input" value={roomInput} onChange={event => setRoomInput(event.target.value.toUpperCase())} placeholder="ABCD" maxLength="4" onKeyDown={event => event.key === 'Enter' && onJoin()} /></label>
          <button className="secondary-btn" onClick={onJoin}>Vào phòng làm Người chơi</button>
        </article>
      </section>
      {error && <p className="home-error" role="alert">{error}</p>}
      <p className="home-hint">Mỗi người chơi nên mở game trên một tab hoặc thiết bị riêng.</p>
    </main>
  );
}

function LoadingScreen() {
  return <main className="page home-page"><section className="panel loading-card"><div className="moon-icon">◐</div><h1>Đang tải phòng…</h1></section></main>;
}

function GameStatus({ state }) {
  const me = state?.me;
  return (
    <header className="topbar">
      <div className="brand-mark"><span>◐</span><div><small>MA SÓI ONLINE</small><strong>Phòng {state?.code || '—'}</strong></div></div>
      <div className="status-items">
        <div><small>Giai đoạn</small><strong>{PHASE_LABEL[state?.phase] || 'Đang chờ'}</strong></div>
        <div><small>Vòng</small><strong>{state?.round || '—'}</strong></div>
        {state?.phase === 'night' && <div><small>Lượt hiện tại</small><strong>{state?.nightTurnLabel || 'Đang xử lý'}</strong></div>}
        {state?.isModerator ? <span className="life-badge moderator-badge">Người quản trò</span> : <span className={`life-badge ${me?.alive ? 'alive' : 'dead'}`}>{me?.alive ? 'Bạn còn sống' : 'Bạn đã chết'}</span>}
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
      <PlayersPanel players={players} compact />
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
  return <details className="panel role-library"><summary>Danh sách vai trò <span>{roles.length} vai</span></summary><p className="muted">Thư viện mô tả công khai. Các vai chưa triển khai không được chia trong game.</p><div className="role-library-groups">{factions.map(faction => { const factionRoles = roles.filter(role => role.faction === faction); if (!factionRoles.length) return null; return <details key={faction}><summary>{FACTION_LABEL[faction]} <span>{factionRoles.length}</span></summary><div className="role-library-grid">{factionRoles.map(role => <article key={role.key} className="library-role" title={role.description}><div><strong>{role.labelVi}</strong><small className={role.isImplemented ? 'implemented' : 'unimplemented'}>{role.isImplemented ? 'Đã triển khai' : 'Chưa triển khai'}</small></div><p>{role.shortDescription}</p><footer><span>{role.aura}</span><span>{role.group}</span>{role.isNightRole && <span>Vai đêm</span>}</footer></article>)}</div></details>; })}</div></details>;
}

function RolePanel({ me }) {
  const role = me?.role || 'unknown';
  return (
    <section className={`panel role-card role-${role}`}>
      <div className="panel-heading"><div><p className="eyebrow">Vai của bạn</p><h2>{me?.roleLabel || 'Chưa chia vai'}</h2></div><span className={`life-badge ${me?.alive ? 'alive' : 'dead'}`}>{me?.alive ? 'Còn sống' : 'Đã chết'}</span></div>
      <p className="team-label">Phe: <strong>{me?.teamLabel || 'Chưa xác định'}</strong></p>
      {me?.role && <p className="role-hint">{ROLE_HINT[me.role]}</p>}
      {me?.role === 'witch' && <div className="potion-row"><span className={me?.witchPotions?.heal ? 'available' : 'used'}>Bình cứu: {me?.witchPotions?.heal ? 'còn' : 'đã dùng'}</span><span className={me?.witchPotions?.poison ? 'available' : 'used'}>Bình độc: {me?.witchPotions?.poison ? 'còn' : 'đã dùng'}</span></div>}
      {!me?.alive && <p className="dead-warning">Bạn đã chết và không thể hành động, nhắn tin hoặc biểu quyết.</p>}
    </section>
  );
}

function ModeratorIdentity({ state }) {
  return <section className="panel moderator-identity"><p className="eyebrow">Vai trò điều khiển</p><h2>Người quản trò</h2><p className="muted">{state?.moderator?.name || 'Bạn'} điều khiển trận đấu và không tham gia như một người chơi.</p></section>;
}

function PlayersPanel({ players = [], compact = false }) {
  return (
    <section className={`panel players-panel ${compact ? 'compact-panel' : ''}`}>
      <div className="panel-heading"><div><p className="eyebrow">Ngôi làng</p><h2>Người chơi</h2></div><span className="count-badge">{players.length} người</span></div>
      <div className="player-list">
        {players.length === 0 && <p className="muted">Chưa có người chơi.</p>}
        {players.map(player => <div className={`player-card ${player.alive ? '' : 'is-dead'} ${player.isMe ? 'is-me' : ''}`} key={player.id}><span className="player-avatar">{player.name?.charAt(0)?.toUpperCase() || '?'}</span><div className="player-info"><strong>{player.name}</strong><small>{player.roleLabel || 'Vai bí mật'}</small></div><div className="tags">{player.isMe && <span>Bạn</span>}<span className={player.alive ? 'alive-tag' : 'dead-tag'}>{player.alive ? 'Sống' : 'Đã chết'}</span></div></div>)}
      </div>
    </section>
  );
}

function NightPanel({ state, players = [], canAct, selectedTarget, setSelectedTarget, onAction, onSkip, onNextStage, onSkipStage, onEndNight }) {
  const me = state?.me;
  const current = NIGHT_INFO[state?.currentNightStage] || { title: `Quản trò đang gọi: ${state?.currentNightStageLabel || 'Vai khác'}`, instruction: 'Chờ Quản trò điều phối lượt đêm.' };
  const isWitch = me?.role === 'witch';
  const witchVictim = isWitch ? players.find(player => player.id === me?.witchVictim) : null;
  const targets = players.filter(player => me?.role === 'guard' || player.id !== me?.id);
  return (
    <section className={`panel action-panel night-panel turn-${state?.nightTurn || 'none'}`}>
      <p className="eyebrow">Đêm {state?.round || 1}</p><h1 className="phase-title">{current.title}</h1><p className="instruction">{current.instruction}</p>
      <NightOrder state={state} />
      {!canAct && !state?.isModerator && <div className="waiting-panel"><strong>{me?.alive ? `Quản trò đang gọi: ${state?.currentNightStageLabel || 'vai hiện tại'}` : 'Bạn đã bị loại nên không thể hành động.'}</strong><p>{me?.alive ? `Quản trò đang gọi: ${state?.currentNightStageLabel || 'vai hiện tại'}. Nếu không phải lượt của bạn, hãy chờ.` : 'Bạn chỉ có thể theo dõi diễn biến.'}</p></div>}
      {canAct && <div className="your-turn"><span>ĐẾN LƯỢT BẠN HÀNH ĐỘNG</span><strong>{current.instruction}</strong></div>}
      {canAct && isWitch && <div className="witch-actions"><p>{witchVictim ? <>Người bị Ma sói cắn: <strong>{witchVictim.name}</strong></> : <strong>Không có ai chết do Ma sói trong đêm nay.</strong>}</p><button className="safe-btn" disabled={!me?.witchPotions?.heal || !witchVictim} onClick={() => onAction(witchVictim?.id, 'heal')}>Dùng bình cứu {me?.witchPotions?.heal ? '' : '· Đã dùng'}</button></div>}
      {canAct && (!isWitch || me?.witchPotions?.poison) && <TargetGrid players={targets} selected={selectedTarget} onSelect={setSelectedTarget} prefix={isWitch ? 'Đầu độc' : 'Chọn'} />}
      {canAct && !isWitch && <button className="primary-btn action-confirm" disabled={!selectedTarget} onClick={() => onAction(selectedTarget)}>Xác nhận hành động</button>}
      {canAct && isWitch && <button className="danger-btn action-confirm" disabled={!me?.witchPotions?.poison || !selectedTarget} onClick={() => onAction(selectedTarget, 'poison')}>Dùng bình độc {me?.witchPotions?.poison ? '' : '· Đã dùng'}</button>}
      {canAct && <button className="text-btn" onClick={onSkip}>Bỏ qua lượt của tôi</button>}
      {state?.isModerator && <ModeratorPanel state={state} onNext={onNextStage} onSkip={onSkipStage} onEndNight={onEndNight} />}
    </section>
  );
}

function NightOrder({ state }) {
  return <div className="night-order">{(state?.nightOrder || []).map((item, index) => <React.Fragment key={item.key || item.role}><span className={state?.currentNightStage === (item.key || item.role) ? 'active-turn' : ''}>{item.label}</span>{index < (state?.nightOrder?.length || 0) - 1 && <i>›</i>}</React.Fragment>)}</div>;
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
      {state?.currentNightStage === 'witch' && <p className="moderator-private-note">Riêng Phù thủy / Quản trò: {moderator?.witchVictimMessage}</p>}
      <div className="moderator-buttons"><button className="primary-btn" onClick={onNext}>{isLastStage ? 'Hoàn tất và sang ngày' : 'Gọi vai tiếp theo'}</button><button onClick={onSkip}>Bỏ qua lượt này</button>{isLastStage && <button className="danger-outline" onClick={onEndNight}>Kết thúc đêm</button>}</div>
    </div>
  );
}

function TargetGrid({ players = [], selected, onSelect, prefix, includeBlank = false }) {
  return <div className="target-grid">{players.map(player => <button className={`target ${selected === player.id ? 'active' : ''}`} key={player.id} onClick={() => onSelect(player.id)}><span className="target-check">{selected === player.id ? '✓' : player.name?.charAt(0)?.toUpperCase()}</span><strong>{player.name}</strong><small>{selected === player.id ? 'Đã chọn' : prefix}</small></button>)}{includeBlank && <button className={`target blank-vote ${selected === BLANK_VOTE ? 'active' : ''}`} onClick={() => onSelect(BLANK_VOTE)}><span className="target-check">{selected === BLANK_VOTE ? '✓' : '—'}</span><strong>Phiếu trắng</strong><small>{selected === BLANK_VOTE ? 'Bạn đã chọn Phiếu trắng' : 'Không treo cổ ai'}</small></button>}</div>;
}

function DayPanel({ state, onGoVoting }) {
  return <section className="panel action-panel day-panel"><p className="eyebrow">Ban ngày · Vòng {state?.round || 1}</p><h1 className="phase-title">Thảo luận trong làng</h1><p className="instruction">Chia sẻ manh mối, đối chiếu lời khai và tìm ra người đáng ngờ.</p>{state?.isModerator ? <button className="primary-btn" onClick={onGoVoting}>Bắt đầu biểu quyết</button> : <div className="waiting-panel"><strong>Đang thảo luận</strong><p>Người quản trò sẽ bắt đầu biểu quyết khi mọi người sẵn sàng.</p></div>}</section>;
}

function VotingPanel({ state, players = [], selectedTarget, setSelectedTarget, hasVoted, onVote, onEndVote }) {
  const canVote = Boolean(state?.me?.alive);
  const targets = players.filter(player => player.id !== state?.me?.id);
  return <section className="panel action-panel voting-panel"><p className="eyebrow">{state?.votesCount || 0} phiếu đã ghi nhận</p><h1 className="phase-title">Biểu quyết treo cổ</h1><p className="instruction">Chọn người bạn nghi ngờ hoặc chọn Phiếu trắng.</p>{canVote ? <>{hasVoted && <div className="success-note">{selectedTarget === BLANK_VOTE ? 'Bạn đã chọn Phiếu trắng.' : 'Phiếu của bạn đã được ghi nhận.'} Bạn vẫn có thể đổi phiếu trước khi Người quản trò chốt.</div>}<TargetGrid players={targets} selected={selectedTarget} onSelect={setSelectedTarget} prefix="Bỏ phiếu" includeBlank /><button className="primary-btn action-confirm" disabled={!selectedTarget} onClick={() => onVote(selectedTarget)}>{hasVoted ? 'Cập nhật phiếu' : 'Xác nhận bỏ phiếu'}</button></> : <div className="waiting-panel"><strong>{state?.isModerator ? 'Bạn đang điều khiển biểu quyết' : 'Bạn không thể biểu quyết'}</strong><p>{state?.isModerator ? 'Người quản trò không tham gia bỏ phiếu.' : 'Người chơi đã chết chỉ có thể theo dõi kết quả.'}</p></div>}{state?.isModerator && <div className="host-controls"><p>Điều khiển quản trò</p><button className="danger-btn" onClick={onEndVote}>Chốt biểu quyết</button></div>}</section>;
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
