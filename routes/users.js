// Import the required modules
const express = require('express');
const router = express.Router();
const debug = require('debug')('recycle-uga:users-router')

let userModel = require('../schemas/user.js');

/* GET users listing. */
router.get('/', async (req, res, next) => {
	let obj = {}
	obj.found = false

	// Look for user
	let foundUser = await userModel.findOne({ cookie: req.cookies.sessionCookie })

	if (foundUser == null) {
		// User not found
		debug('User not found')
		obj.msg = 'No user with that cookie found'
		res.send(obj)
	} else {
		// User found
		debug('User found')
		obj.user = foundUser.id
		obj.found = true
		res.send(obj)
	}
});

// Export user router
module.exports = router;
