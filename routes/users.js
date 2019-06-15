var express = require('express');
var router = express.Router();

var userModel = require('../schemas/user.js');

// Check if the user has to log in
router.use((req, res, next) => {
	//req.cookie()
	console.log("Checked cookie");
	next();
});

/* GET users listing. */
router.get('/', async (req, res, next) => {
	var obj = {}
	var foundUser = await userModel.findOne({cookie: req.cookies.sessionCookie})
	if(foundUser == null) {
		obj.msg = "No user with that cookie found"
		obj.found = false
		res.send(obj)
	} else {
		obj.userName = foundUser.id
		obj.found = true
		res.send(obj)
	}
	res.status(500).send("Server Error")
});

/* Update user progress */
router.post('/progress', (req, res) => {
	// Print data
	console.log(req.body);

	// Save data
	userModel.create(req.body, (err, obj) => {
		if(err) {
			console.log(err)
			res.status(500).send(err)
		} else {
			res.send('Success')
		}
	})

	res.status(200).send('Success!');
});

router.get('/newUser', (req, res) => {
	userModel.create({id:'newUser'}, (err, other) => {
		if(err) {
			console.log(err)
			res.send(err)
		} else {
			res.send('Success')
		}
	})
})

/* Get the users next avaliable progress page */

module.exports = router;
