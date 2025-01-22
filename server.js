const express = require('express');
const http = require('http'); // https는 사용하지 않음

const app = express();

// CORS 설정 (필요한 경우)
const cors = require('cors');
app.use(cors());  // 모든 요청을 허용 (개발 중에는 이 설정을 사용)

app.get('/', (req, res) => {
    res.send('Hello from the HTTP server!');
});

// HTTP 서버만 실행 (HTTPS는 사용하지 않음)
const httpServer = http.createServer(app);

// HTTP 서버 실행 (80번 포트에서 실행)
httpServer.listen(80, () => {
    console.log('HTTP Server running on http://localhost:80');
});
