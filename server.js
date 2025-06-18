import http from "http";
import { WebSocketServer } from "ws";

const port = process.env.PORT || 443;
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("OK");
});
const wss = new WebSocketServer({ server });
const rooms = new Map();

wss.on("connection", ws => {
  ws.on("message", raw => {
    let msg;
    try { msg = JSON.parse(raw); }
    catch { return; }

    // 방 입장
    if (msg.type === "join") {
      const room = msg.room;
      if (!rooms.has(room)) rooms.set(room, new Set());
      rooms.get(room).add(ws);
      ws.room = room;
      ws.send(JSON.stringify({ type: "system", data: "joined" }));
    }
    // 채팅 메시지
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
    const set = rooms.get(ws.room);
    if (set) set.delete(ws);
  });
});

server.listen(port, () => {
  console.log(`WebSocket 서버 실행 중 → 포트 ${port}`);
});
