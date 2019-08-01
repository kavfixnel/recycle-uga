// Import the required modules
const express = require('express')
const router = express.Router()
const path = require('path')
const debug = require('debug')('recycle-uga:module-router')

let userModule = require('../schemas/user.js')

/* Middleware that checks if the user has a valid cookie */
router.use(async (req, res, next) => {
	try {
		// Load the user with a cookie
		let user = await userModule.findOne({ cookie: req.cookies._ugaRecycle })

		// Check if user exists
		if (user) {
			// Check if users cookie is ''
			if (user.cookie == '') {
				res.redirect('/').send()
			} else {
				let daysSinceCookieIssue = ((new Date()).getTime() - (new Date(user.cookieExp)).getTime()) / (24 * 60 * 60 * 1000)
				if (daysSinceCookieIssue > 1.0) {
					res.redirect('/').send()
				} else {
					// Everyhting is fine
					debug(`Found user with cookie: ${req.cookies._ugaRecycle}`)
					req.user = user
					next()
					return
				}
			}
		} else {
			// No user with that cookie found
			res.redirect('/').send()
		}
	} catch (error) {
		debug(`Error [1]: ${error}`)
		res.status(500).send("Error [1] in module.js")
	}
	res.status(500).send("Error [2] in module.js")
});

/* Send the next avaliable module page
	or the requested page if that user is allowed to go there */
router.get('/next', async (req, res) => {
	try {
		// Check if user requested a certain page
		let page
		if (req.query.page && (req.query.page <= req.user.progress)) {
			page = parseInt(req.query.page)
		} else {
			page = req.user.progress
		}

		debug('Checking user progress')
		debug('User:\n~~~~~')
		debug(req.user)
		debug('~~~~~')

		// Decide what page needs to be loaded
		switch (page) {
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
		debug(`Error [3]: ${error}`)
		res.status(500).send("Error [3] in module.js")
	}
});

/* Let the user post their progress to this endpoint */
router.post('/progress', async (req, res) => {
	try {
		debug(req.body)
		// Check if someone is trying to bamboozle the system
		let name = ['preSurvey', 'infoPage', 'gamePage', 'infoPage2', 'mapPage', 'postSurvey']
		if (req.body.page <= name.length) {
			debug('Inside')
			if (req.body.page == req.user.progress) {
				req.user.set('progress', req.user.progress + 1)
				debug('Progress: ' + req.user.progress)
			}
			req.user[name[req.body.page]].push(req.body.data)
			debug('User: ')
			debug(req.user.pages)
			let ret = await req.user.save()
			debug('Return:')
			debug(ret)
			debug('Done saving user progress')
			res.status(200).send()
		} else {
			res.status(400).send()
		}
	} catch (error) {
		// Error occured
		debug(`Error [6]: ${error}`)
		res.status(500).send('Error [6] in module.js /progress')
	}
});

/**
 * Retrieve the newest user data
 */
router.get('/data', (req, res) => {
	console.log('Test')
	try {
		if (req.query.page) {
			let name = ['preSurvey', 'infoPage', 'gamePage', 'infoPage2', 'mapPage', 'postSurvey']
			let userData = req.user[name[req.query.page]]
			if (!userData) {
				let obj = { success: false, msg: 'No data found here' }
				debug(obj)
				res.status(400).send(obj)
			} else {
				userData.success = true
				debug(userData)
				res.send(userData)
			}
		} else {
			let obj = { success: 'false', msg: 'No page number' }
			debug(obj)
			res.status(400).send(obj)
		}
	} catch (error) {
		debug(`Error [9]: ${error}`)
		res.status(500).send('Error [9] in module.js')
	}
})

/* Get the current progress of a user */
router.get('/progress', async (req, res) => {
	try {
		debug(req.body)
		if (req.user.progress != undefined) {
			let obj = { found: true }
			obj.user = req.user.id
			obj.progress = req.user.progress / 5
			res.send(obj)
		} else {
			let obj = { found: false, msg: 'Error [7] in module.js' }
			res.status(500).send(obj)
		}
	} catch (error) {
		let obj = { found: false, msg: 'Error [8] in module.js' }
		debug(`Error [8]: ${error}`)
		res.status(500).send('Error [8] in module.js /progress')
	}
});

// Export the module router
module.exports = router