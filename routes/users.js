// Import the required modules
var express = require('express');
var router = express.Router();

var userModel = require('../schemas/user.js');

/* GET users listing. */
router.get('/', async (req, res, next) => {
	var obj = {}
	obj.found = false

	// Look for user
	var foundUser = await userModel.findOne({cookie: req.cookies.sessionCookie})

	if(foundUser == null) {
		// User not found
		obj.msg = 'No user with that cookie found'
		res.send(obj)
	} else {
		// User found
		obj.userName = foundUser.id
		obj.found = true
		res.send(obj)
	}

	// Some error has occured
	obj.msg = 'Internal Server Error'
	res.status(500).send(obj)
});

module.exports = router;
