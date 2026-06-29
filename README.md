# MaSoi - Web chơi Ma Sói realtime

MVP web Ma Sói dùng React + Vite + Express + Socket.IO.

## Chạy dự án

```bash
cd MaSoi
npm install
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:4000

## Cách test nhanh

1. Mở 5 tab trình duyệt nếu muốn có đủ Phù thủy.
2. Tab 1 tạo phòng.
3. Các tab còn lại nhập mã phòng để join.
4. Host bấm bắt đầu game.
5. Mỗi người sẽ thấy vai riêng của mình.
6. Ban đêm các vai sẽ dậy lần lượt:
   - Ma sói
   - Bảo vệ
   - Tiên tri
   - Phù thủy
7. Sau khi vai cuối xong, game tự xử lý chết/sống rồi chuyển sang ban ngày.

## Vai hiện có

- Dân làng: vote ban ngày.
- Ma sói: chọn người cắn ban đêm.
- Bảo vệ: bảo vệ một người ban đêm.
- Tiên tri: soi phe của một người ban đêm.
- Phù thủy: có 1 bình cứu và 1 bình độc, mỗi bình dùng một lần trong cả game.

Lưu ý: Phù thủy chỉ xuất hiện khi phòng có từ 5 người trở lên.

## Luật ban đêm

Server đóng vai trò quản trò. Mỗi thời điểm chỉ một vai được hành động.

```txt
Ma sói → Bảo vệ → Tiên tri → Phù thủy → Kết thúc đêm → Ban ngày
```

Người không tới lượt chỉ thấy thông báo chờ. Host hoặc người đang tới lượt có thể bấm bỏ qua lượt hiện tại.

## Luật thắng

- Dân làng thắng khi không còn ma sói sống.
- Ma sói thắng khi số ma sói sống >= số dân làng sống.

## Cấu trúc

```txt
MaSoi/
├── client/              # React UI
│   └── src/
│       ├── App.jsx
│       ├── socket.js
│       ├── main.jsx
│       └── style.css
└── server/              # Express + Socket.IO
    └── src/
        ├── index.js
        ├── gameLogic.js
        └── rooms.js
```

## Dùng CodeGraph

Nếu dùng bản local CLI/MCP:

```bash
npm install -g @colbymchenry/codegraph
codegraph install
cd MaSoi
codegraph init
codegraph status
```

Nếu PowerShell chặn `codegraph.ps1`, dùng:

```bash
codegraph.cmd status
codegraph.cmd explore "Explain this repository architecture"
```

Prompt nên dùng với agent:

```txt
Use CodeGraph first to understand this repository.

Goal:
Improve the MaSoi realtime Werewolf game without rewriting the whole app.

Important files:
- server/src/gameLogic.js controls roles, night order, phase transitions, deaths, and win conditions.
- server/src/rooms.js controls room/player state.
- server/src/index.js controls Socket.IO events.
- client/src/App.jsx controls UI and socket actions.

Keep server as the source of truth.
```
