var express = require('express');
var router = express.Router();

var userModule = require('../schemas/user.js')

router.use(async (req, res, next) => {
	try {
		var user = await userModule.findOne({cookie: req.cookies.sessionCookie})

		// Check 
		if(user) {
			var daysSinceCookieIssue = ((new Date()).getTime()-(new Date(user.cookieExp)).getTime())/(24*60*60*1000)
			if(daysSinceCookieIssue > 1.0) {
				res.redirect('/login')
			} else {
				// Everyhting is fine
				next()
			}
		} else {
			res.redirect('/login')
		}
	} catch(error) {
		console.error(error)
		res.status(500).send("Error [1] in module.js")
	}
	res.status.send("Error [2] in module.js")
});

router.get('/', async (req, res) => {
	try {
		var user = await userModule.findOne({cookie: req.cookies.sessionCookie})

		// Decide what page needs to be loaded
		switch(user.progress) {
			case 0:
				res.send("Page 0")
				break
			case 1:
				res.send("Page 1")
				break
			case 2:
				res.send("Page 2")
				break
			default:
				res.status(500).send("Error [5] in module.js")
		}
	} catch(error) {
		console.error(error)
		res.status(500).send("Error [3] in module.js")
	}
	res.status(500).send("Error [4] in module.js")
});

module.exports = router
