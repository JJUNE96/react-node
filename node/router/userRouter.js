const express = require('express');
const router = express.Router();
const { User } = require('../model/userSchema.js');
const { Counter } = require('../model/counterSchema.js');

router.post('/join', (req, res) => {
	const temp = req.body;

	Counter.findOne({ name: 'counter' })
		.then((doc) => {
			temp.userNum = doc.userNum;

			const userData = new User(temp);
			userData.save().then(() => {
				Counter.updateOne({ name: 'counter' }, { $inc: { userNum: 1 } }).then(() => {
					res.json({ success: true }).catch(() => res.json({ succes: false }));
				});
			});
		})
		.catch((err) => res.json({ success: false, err: err }));
});

module.exports = router;
