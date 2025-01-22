const express = require('express');
const app = express();

// 루트 경로 처리 ("/" 경로에 대해 응답을 보냄)
app.get('/', (req, res) => {
    res.send('Hello, World!');  // 간단한 메시지를 보내는 예시
});

app.listen(10000, () => {
    console.log('Server is running on port 10000');
});
