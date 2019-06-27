// Import the required modules
var express = require('express');
var router = express.Router();

var userModule = require('../schemas/user.js')

/* Middleware that checks if the user has a valid cookie */
router.use(async (req, res, next) => {
	try {
		var user = await userModule.findOne({cookie: req.cookies.sessionCookie})

		// Check if user exists
		if(user) {
			var daysSinceCookieIssue = ((new Date()).getTime()-(new Date(user.cookieExp)).getTime())/(24*60*60*1000)
			if(daysSinceCookieIssue > 1.0) {
				res.redirect('/login')
			} else {
				// Everyhting is fine
				next()
			}
		} else {
			// Co user with that cookie found
			res.redirect('/login')
		}
	} catch(error) {
		console.error(error)
		res.status(500).send("Error [1] in module.js")
	}
	res.status.send("Error [2] in module.js")
});

/* Send the next avaliable module page */
router.get('/next', async (req, res) => {
	try {
		var user = await userModule.findOne({cookie: req.cookies.sessionCookie})

		// Decide what page needs to be loaded
		switch(user.progress) {
			case 0:
				res.send("Pre Survey")
				break
			case 1:
				res.send("Page 1")
				break
			case 2:
				res.send("Page 2")
				break
			case 3:
				res.send("Page 3")
				break
			case 4:
				res.send("Post survey")
				break
			case 5:
				res.send("Done")
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

/* Let the user post their progress to this endpoint */
router.post('/progress', async (req, res) => {
	try {
		// Find user
		var user = await userModule.findOne({cookie: req.cookies.sessionCookie})
		if(req.body.page == user.progress) {
			var name = ['preSurvey', 'pageOne', 'pageTwo', 'pageThree', 'postSurvey']
			await userModule.findOneAndUpdate({cookie: req.cookies.sessionCookie}, {$inc: {progress: 1}})
			switch(req.body.page) {
				case 0:
					console.log(">>>Pre Survey run<<<")
					await userModule.findOneAndUpdate({cookie: req.cookies.sessionCookie}, {$set: {preSurvey: req.body.data}})
					break
				case 1:
					console.log(">>>Page One run<<<")
					await userModule.findOneAndUpdate({cookie: req.cookies.sessionCookie}, {$set: {pageOne: req.body.data}})
					break
				case 2:
						console.log(">>>Page Two run<<<")
					await userModule.findOneAndUpdate({cookie: req.cookies.sessionCookie}, {$set: {pageTwo: req.body.data}})
					break
				case 3:
					await userModule.findOneAndUpdate({cookie: req.cookies.sessionCookie}, {$set: {pageThree: req.body.data}})
					break
				case 4:
					await userModule.findOneAndUpdate({cookie: req.cookies.sessionCookie}, {$set: {postSurvey: req.body.data}})
					break
				default:
					res.status(500).send("Error [5] in module.js")
			}
			res.status(200).send()
		} else {
			res.status(400).send()
		}
	} catch(error) {
		console.error(error)
		res.status(500).send('Error [6] in module.js /progress')
	}
	res.status(400).send()
});

module.exports = router
