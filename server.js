<<<<<<< HEAD
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
=======
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
>>>>>>> 4713fd3a885f77a74539a21c30497cd9d0cb11bc
    if (msg.type === "join") {
      const room = msg.room;
      if (!rooms.has(room)) rooms.set(room, new Set());
      rooms.get(room).add(ws);
      ws.room = room;
<<<<<<< HEAD
      ws.send(JSON.stringify({ type: "system", data: "joined" }));
    }
    // 채팅 메시지
=======
      ws.send(JSON.stringify({ type: "system", data: `룸 ${room} 입장 완료` }));
    }
    // 2) 채팅 메시지
>>>>>>> 4713fd3a885f77a74539a21c30497cd9d0cb11bc
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
<<<<<<< HEAD
    const set = rooms.get(ws.room);
    if (set) set.delete(ws);
  });
});

server.listen(port, () => {
  console.log(`WebSocket 서버 실행 중 → 포트 ${port}`);
});
=======
    // 연결 끊길 때 방 목록에서 제거
    const room = ws.room;
    if (rooms.has(room)) rooms.get(room).delete(ws);
  });
});

console.log(`WebSocket 서버 실행 중 → 포트 ${PORT}`);
>>>>>>> 4713fd3a885f77a74539a21c30497cd9d0cb11bc
