import { WebSocketServer } from "ws";

const PORT = process.env.PORT || 8080;
const wss  = new WebSocketServer({ port: PORT });

// room 코드별 연결 목록
const rooms = new Map();

wss.on("connection", ws => {
  console.log("클라이언트 접속됨");
  ws.on("message", raw => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    // 1) 방에 입장
    if (msg.type === "join") {
      const room = msg.room;
      if (!rooms.has(room)) rooms.set(room, new Set());
      rooms.get(room).add(ws);
      ws.room = room;
      ws.send(JSON.stringify({ type: "system", data: `룸 ${room} 입장 완료` }));
    }
    // 2) 채팅 메시지
    else if (msg.type === "message") {
      const room = ws.room;
      if (!rooms.has(room)) return;
      for (const client of rooms.get(room)) {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify({ type: "message", data: msg.data }));
        }
      }
    }
  });

  ws.on("close", () => {
    // 연결 끊길 때 방 목록에서 제거
    const room = ws.room;
    if (rooms.has(room)) rooms.get(room).delete(ws);
  });
});

console.log(`WebSocket 서버 실행 중 → 포트 ${PORT}`);
