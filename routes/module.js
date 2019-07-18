// Import the required modules
let express = require('express')
let router = express.Router()
let path = require('path')

let userModule = require('../schemas/user.js')

/* Middleware that checks if the user has a valid cookie */
router.use(async (req, res, next) => {
	try {
		// Load the user with a cookie
		let user = await userModule.findOne({ cookie: req.cookies.sessionCookie })

		// Check if user exists
		if (user) {
			let daysSinceCookieIssue = ((new Date()).getTime() - (new Date(user.cookieExp)).getTime()) / (24 * 60 * 60 * 1000)
			if (daysSinceCookieIssue > 1.0) {
				res.redirect('/').send()
			} else {
				// Everyhting is fine
				next()
				return
			}
		} else {
			// No user with that cookie found
			res.redirect('/').send()
		}
	} catch (error) {
		console.error(error)
		res.status(500).send("Error [1] in module.js")
	}
	res.status(500).send("Error [2] in module.js")
});

/* Send the next avaliable module page */
router.get('/next', async (req, res) => {
	try {
		let user = await userModule.findOne({ cookie: req.cookies.sessionCookie })

		// Decide what page needs to be loaded
		switch (user.progress) {
			case 0:
				res.sendFile(path.join(__dirname + '/../private/preSurveyPage.html'))
				break
			case 1:
				res.sendFile(path.join(__dirname + '/../private/infoPage.html'))
				break
			case 2:
				res.sendFile(path.join(__dirname + '/../private/gamePage.html'))
				break
			case 3:
				res.sendFile(path.join(__dirname + '/../private/infoPage2.html'))
				break
			case 4:
				res.sendFile(path.join(__dirname + '/../private/mapPage.html'))
				break
			case 5:
				res.sendFile(path.join(__dirname + '/../private/postSurveyPage.html'))
				break
			case 6:
				res.sendFile(path.join(__dirname + '/../private/finishPage.html'))
				break
			default:
				res.status(500).send("Error [5] in module.js")
		}
	} catch (error) {
		console.error(error)
		res.status(500).send("Error [3] in module.js")
	}
	//res.status(500).send("Error [4] in module.js")
});

/* Let the user post their progress to this endpoint */
router.post('/progress', async (req, res) => {
	try {
		// Find user
		console.log(req.body)
		let user = await userModule.findOne({ cookie: req.cookies.sessionCookie })
		if (req.body.page == user.progress && user.progress <= 5) {
			let name = ['preSurvey', 'pageOne', 'pageTwo', 'pageThree', 'postSurvey']
			user.set('progress', user.progress + 1)
			user.set(name[req.body.page], req.body.data)
			await user.save()
			res.status(200).send()
		} else {
			res.status(400).send()
		}
	} catch (error) {
		console.error(error)
		res.status(500).send('Error [6] in module.js /progress')
	}
	//res.status(400).send()
});

router.get('/progress', async (req, res) => {
	try {
		// Find user
		console.log(req.body)
		let user = await userModule.findOne({ cookie: req.cookies.sessionCookie })

		if(user.progress) {
			let obj = { found: true }
			obj.progress = user.progress / 5
			req.send(obj)
		} else {
			let obj = { found: false, msg: 'Error [7] in module.js'}
			req.status(500).send(obj)
		}

	} catch (error) {
		let obj = { found: false, msg: 'Error [6] in module.js'}
		console.error(error)
		res.status(500).send('Error [6] in module.js /progress')
	}
	//res.status(400).send()
});

module.exports = router
