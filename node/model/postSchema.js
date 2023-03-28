//기존 일반 DB (Oracle, MySQL, MSSQL, MariaDB) 테이블 형식, SQL표준 명령어를 이용하여 DB입출력 관리
//MongoDB : 자바스크립트의 객체형태로 데이터를 저장하는 구조, NoSQL, JS문으로 DB입출력 관리
//Schema : 데이터베이스에 저장될 자료형식이나 키값을 강제하는 시스템적인 틀

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
	{
		title: String,
		content: String,
		communityNum: Number,
		//User컬랙션에서 참조하고자 하는 document의 object_id가 등록되면
		//해당 다큐먼트의 정보를 post에서 참조
		writer: {
			ref: 'User',
			type: mongoose.Schema.Types.ObjectId,
		},
	},
	{ collection: 'Posts', timestamps: true }
);

const Post = mongoose.model('Post', postSchema);
module.exports = { Post };
