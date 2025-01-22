const express = require('express');
const cors = require('cors');  // CORS 모듈 추가

const app = express();

// CORS를 모든 도메인에서 오는 요청을 허용하도록 설정
app.use(cors());

// 기본 라우트 설정 (GET 요청 처리)
app.get('/', (req, res) => {
    res.json({ status: 'connected' });  // 서버 응답
});

// 서버 실행
const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
