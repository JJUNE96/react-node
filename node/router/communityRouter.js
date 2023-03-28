const express = require('express');
const router = express.Router();

const { Post } = require('../model/postSchema.js');
const { Counter } = require('../model/counterSchema.js');
const { User } = require('../model/userSchema.js');

//글 저장 라우터
router.post('/create', (req, res) => {
	const temp = req.body;

	Counter.findOne({ name: 'counter' })
		.exec()
		.then((doc) => {
			//temp = {title, content, uid, communityNum}
			temp.communityNum = doc.communityNum;

			//temp객체에 있는 현재 로그인된 사용자의 아이디로 User컬렉션으로 부터 해당 document를 찾음
			User.findOne({ uid: temp.uid })
				.exec()
				.then((doc) => {
					//해당 다큐먼트의 ObjectId값을 body-parser로 전달받은 temp객체의 writer키값에 등록
					//temp = {title, content, uid, communityNum, writer(user-objectId)}
					temp.writer = doc._id;

					//위에서 최종적으로 만들어진 temp객체로 PostModel인스턴스 생성후 DB에 저장
					const PostModel = new Post(temp);
					PostModel.save().then(() => {
						Counter.updateOne({ name: 'counter' }, { $inc: { communityNum: 1 } }).then(
							() => res.json({ success: true })
						);
					});
				});
		})
		.catch((err) => console.log(err));
});

//글 목록 요청 라우터
router.post('/read/:count', (req, res) => {
	Post.find()
		.populate('writer')
		.sort({ createdAt: -1 })
		.limit(req.params.count)
		.exec()
		.then((doc) => {
			res.json({ success: true, communityList: doc });
		})
		.catch((err) => {
			console.log(err);
			res.json({ success: false });
		});
});

//글 상제정보 요청 라우터
router.post('/detail/:num', (req, res) => {
	Post.findOne({ communityNum: req.params.num })
		.populate('writer')
		.exec()
		.then((doc) => res.json({ success: true, detail: doc }))
		.catch((err) => res.json({ success: false, err: err }));
});

//글 수정 요청 라우터
router.post('/edit', (req, res) => {
	const temp = {
		title: req.body.title,
		content: req.body.content,
	};

	Post.updateOne({ communityNum: req.body.num }, { $set: temp })
		.exec()
		.then((doc) => {
			console.log(doc);
			res.json({ success: true });
		})
		.catch((err) => res.json({ success: false }));
});

//글 삭제 요청 라우터
router.post('/delete', (req, res) => {
	Post.deleteOne({ communityNum: req.body.num })
		.exec()
		.then(() => res.json({ success: true }))
		.catch(() => res.json({ success: false }));
});

module.exports = router;
