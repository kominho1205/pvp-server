import http from "http";
import { WebSocketServer } from "ws";

const port = process.env.PORT || 443;
const server = http.createServer((req, res) => {
  // 기본 HTTP 응답 (Health Check 포함)
  if (req.url === "/health") {
    res.writeHead(200);
    return res.end("OK");
  }
  res.writeHead(200);
  res.end("OK");
});

// WebSocket 서버 인스턴스 (noServer 모드)
const wss = new WebSocketServer({ noServer: true });
const rooms = new Map();

// HTTP → WebSocket Upgrade 처리
server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});

// WebSocket 연결 핸들러
wss.on("connection", (ws) => {
  console.log("클라이언트 접속됨");

  // 연결 즉시 ACK(시스템 메시지) 보내기
  ws.send(JSON.stringify({ type: "system", data: "HANDSHAKE_OK" }));

  ws.on("message", (raw) => {
    let msg;
    try { msg = JSON.parse(raw); }
    catch { return; }

    if (msg.type === "join") {
      const room = msg.room;
      if (!rooms.has(room)) rooms.set(room, new Set());
      rooms.get(room).add(ws);
      ws.room = room;
      ws.send(JSON.stringify({ type: "system", data: "joined" }));
    }
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
