const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());  // CORS 허용

const server = http.createServer(app);
const io = new Server(server);

let players = {};

io.on("connection", (socket) => {
    console.log(`Player connected: ${socket.id}`);

    players[socket.id] = { x: 0, y: 0, hp: 100 };

    socket.broadcast.emit("player-joined", { id: socket.id, ...players[socket.id] });

    socket.on("update-position", (data) => {
        if (players[socket.id]) {
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            io.emit("update-players", players);
        }
    });

    socket.on("disconnect", () => {
        console.log(`Player disconnected: ${socket.id}`);
        delete players[socket.id];
        io.emit("player-left", socket.id);
    });
});

// Render에서 제공하는 포트 사용
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
