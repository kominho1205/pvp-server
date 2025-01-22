const express = require('express');
const cors = require('cors');  // CORS 모듈 추가
const app = express();

// CORS 설정
app.use(cors());  // 모든 도메인에서의 요청을 허용

// 기본 라우트
app.get('/', (req, res) => {
    res.send('Server is running and CORS is enabled!');
});

// 서버 실행
const port = process.env.PORT || 10000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
