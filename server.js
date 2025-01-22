// 기존 Node.js 서버에 express 추가

const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');

// Express 앱 초기화
const app = express();

// CORS 설정 (필요한 경우)
const cors = require('cors');
app.use(cors());  // 모든 요청을 허용 (개발 중에는 이 설정을 사용)

app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

// 기존의 http 또는 https 서버를 Express.js와 함께 사용
const httpServer = http.createServer(app);  // HTTP 서버
const httpsServer = https.createServer({
    key: fs.readFileSync('path/to/your/private.key'),
    cert: fs.readFileSync('path/to/your/certificate.crt')
}, app);  // HTTPS 서버

// 서버 실행
httpServer.listen(80, () => {
    console.log('HTTP Server running on http://localhost:80');
});
httpsServer.listen(443, () => {
    console.log('HTTPS Server running on https://localhost:443');
});
