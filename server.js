const express = require('express');
const http = require('http'); // HTTPS는 사용하지 않음

const app = express();

// ETag 비활성화
app.disable('etag');

// CORS 설정 (모든 요청을 허용)
const cors = require('cors');
app.use(cors());

// 공통 헤더 설정
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    next();
});

// 기본 라우트
app.get('/', (req, res) => {
    res.status(200).contentType('text/plain').send('Hello from the HTTP server!');
});

// 매칭된 플레이어들
let players = [];  // 매칭된 플레이어들

// 플레이어가 매칭되었을 때 호출되는 API
app.post('/match', (req, res) => {
    const player = req.body;  // 클라이언트에서 전달된 플레이어 정보

    // 플레이어가 추가되면
    players.push(player);

    // 두 명이 매칭되면 룸 8로 이동하도록 알림
    if (players.length === 2) {
        res.json({ matched: true, room: 'Room8' });  // 매칭된 경우 룸 8로 이동
        players = [];  // 매칭된 플레이어들은 비웁니다.
    } else {
        res.json({ matched: false });  // 매칭되지 않음
    }
});

// HTTP 서버만 실행 (HTTPS는 사용하지 않음)
const httpServer = http.createServer(app);

// HTTP 서버 실행 (80번 포트에서 실행)
httpServer.listen(80, () => {
    console.log('HTTP Server running on http://localhost:80');
});
