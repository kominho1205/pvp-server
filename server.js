const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');

const app = express();

// CORS 설정
const cors = require('cors');
app.use(cors());  // 모든 도메인에서 요청을 허용

app.get('/', (req, res) => {
    res.send('Hello from the HTTP server!');
});

// HTTP 서버 설정
const httpServer = http.createServer(app);

// HTTPS 서버 설정 (SSL 인증서 필요)
const httpsOptions = {
    key: fs.readFileSync('path/to/your/private.key'),
    cert: fs.readFileSync('path/to/your/certificate.crt')
};
const httpsServer = https.createServer(httpsOptions, app);

// HTTP에서 HTTPS로 리디렉션
app.use((req, res, next) => {
    if (req.protocol === 'http') {
        res.redirect(301, `https://${req.headers.host}${req.url}`);
    } else {
        next();
    }
});

// HTTP 서버 실행 (포트 80)
httpServer.listen(80, () => {
    console.log('HTTP Server running on http://localhost:80');
});

// HTTPS 서버 실행 (포트 443)
httpsServer.listen(443, () => {
    console.log('HTTPS Server running on https://localhost:443');
});
