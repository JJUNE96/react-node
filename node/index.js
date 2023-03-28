const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
const port = 5000;

// client에서 보내는 데이터를 전달 받도록 설정 (body-parser)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//express에서 react안쪽 build폴더까지의 경로를 static으로 지정
app.use(express.static(path.join(__dirname, '../abc/build')));

//community,user 전용 라우터 연결
app.use('/api/community', require('./router/communityRouter.js'));
app.use('/api/user', require('./router/userRouter.js'));

// mongoDB 접속 구문
app.listen(port, () => {
	mongoose
		.connect(
			'mongodb+srv://hj09060906:!abcd1234@cluster0.b5rgoz2.mongodb.net/?retryWrites=true&w=majority'
		)
		//접속 성공시
		.then(() => console.log(`Server app listening on port ${port} with MongoDB`))
		//접속 실패시
		.catch((err) => console.log(err));
});

//기본 라우터 설정
app.get('/', (req, res) => {
	//서버에서 5000포트로 접속하면 static폴더로 지정되어 있는 build안쪽의 index.html을 화면에 내보냄
	res.sendFile(path.join(__dirname, '../abc/build/index.html'));
});

//어떤 URL에서 접속하더라도 화면이 뜨도록 설정
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../abc/build/index.html'));
});

//리액트 요청 라우터(글 저장)
//글 저장 순서-> counter모델로 글번호 가져옴 -> body-parser로 제목, 본문 가져와서 글번호 추가후 저장 -> 저장 완료후 카운터 모델의 글번호 증가
