var express = require('express');
var router = express.Router();

var userModule = require('../schemas/user.js')

router.get('/', async (req, res) => {
	// Check cookie
	var user = await userModule.findOne({cookie: req.cookies.sessionCookie})

	// Check 
	console.log(user)
	if(user) {
		console.log("Inside")
		var daysSinceCookieIssue = ((new Date()).getTime()-(new Date(user.cookieExp)).getTime())/(24*60*60*1000)
		if(daysSinceCookieIssue > 1.0) {
			res.redirect('/login')
		} else {
			// Issue the new module page
		}
	} else {
		res.redirect('/login')
	}
});

router.get('/', (req, res) => {
	res.redirect('https://cas2.stage.uga.edu/cas/login?service=https://recycle-uga.herokuapp.com')
});

module.exports = router
