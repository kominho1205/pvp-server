import http from "http";
import { WebSocketServer } from "ws";

const port = process.env.PORT || 443;
const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200);
    return res.end("OK");
  }
  res.writeHead(200);
  res.end("OK");
});

// noServer 모드로 생성하며, 클라이언트가 제안한 프로토콜을 그대로 선택해 응답
const wss = new WebSocketServer({
  noServer: true,
  handleProtocols: (protocols, request) => {
    // GameMaker가 요청하는 프로토콜 리스트(protocols)에 들어있다면 그 값을 그대로 반환
    // (대개 첫 번째 요소가 됩니다)
    return protocols[0];
  }
});

server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});

wss.on("connection", (ws) => {
  console.log("클라이언트 접속됨");

  // 연결 즉시 ACK (핸드셰이크 확인용)
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
