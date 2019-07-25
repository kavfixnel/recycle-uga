// Import the required modules
const express = require('express')
const router = express.Router()
const axios = require('axios')
const crypto = require('crypto')
const { google } = require('googleapis')
const debug = require('debug')('recycle-uga:login-router')

let userModel = require('../schemas/user.js')

/**
 * Login with CAS
 */
router.get('/cas', (req, res, next) => {
	debug('New CAS login')
	res.redirect('https://cas2.stage.uga.edu/cas/login?service=https://uga-recycle.com/login/cas/cb')
});

/**
 * CAS login callback URL
 */
router.get('/cas/cb', async (req, res) => {
	debug('New CAS callback')
	if (req.query.ticket == null) {
		// There is no ticket avaliable
		debug('No ticket avaliable')
		res.redirect('/')
	} else {
		// Get the ticket contents
		try {
			const url = 'https://cas2.stage.uga.edu/cas/validate?service=https://uga-recycle.com/login/cas/cb&ticket=' + req.query.ticket
			const response = await axios.get(url)
			var ans = response.data.split('\n')
			if (ans[0] == 'yes') {
				// Ticket was valid and ans[1] has username
				debug('Valid CAS ticket')
				var user = await userModel.findOne({ id: ans[1] })
				if (!user) {
					// New user needs to be created
					var newCookie = random(30)
					await userModel.create({ id: ans[1], ugaStudent: true, cookie: newCookie, cookieExp: (Date.now() + 86400000) })
					debug(`New user ${ans[1]} created`)
					res.cookie('sessionCookie', newCookie, { maxAge: 86400000 })
				} else {
					// User already exists
					// Create new cookie
					var newCookie = random(30)

					// Update the cookie of the user
					await userModel.findOneAndUpdate({ id: ans[1] }, { $set: { cookie: newCookie, cookieExp: (Date.now() + 86400000) } })
					debug(`New cookie for user ${ans[1]} issued`)
					res.cookie('sessionCookie', newCookie, { maxAge: 86400000 })
				}
			}
		} catch (error) {
			debug(`Error [1]: ${error}`)
		}

		// Redirect the user to the homepage
		res.redirect('/').send()
	}

	// Something went wrong and redirect the user to the homepage
	debug('Error [2]')
	res.redirect('/').send()
});

// Create an OAuth2 Google client
let googleURL
if (process.env.DEV == 'TRUE') {
	googleURL = 'http://local.uga-recycle.com:5000/login/google/cb'
} else {
	googleURL = 'https://www.uga-recycle.com/login/google/cb'
}
debug(`Google URL: ${googleURL}`)

/** 
 * Create a new Google OAuth client
 */
const oauth2Client = new google.auth.OAuth2(
	process.env.CLIENTID,
	process.env.CLIENTSECRET,
	googleURL
);

/**
 * Redirect the users to the Google OAuth page
 */
router.get('/google', (req, res) => {
	// Generate a new redirection URL to Googles OAuth network
	debug('New Google login')
	let redirectURL = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: 'https://www.googleapis.com/auth/userinfo.email'
	});

	// Redirect the user to that URL
	res.redirect(redirectURL)
})

/**
 *  The callback URL for Google OAuth
 */
router.get('/google/cb', async (req, res) => {
	debug('New Google callback')
	try {
		// Extract the token and send a request to google
		const { tokens } = await oauth2Client.getToken(req.query.code)

		let url = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + tokens.access_token
		let { data } = await axios.get(url)

		// Make new user or grant new cookie
		var user = await userModel.findOne({ id: data.email })
		if (!user) {
			// New user needs to be created
			var newCookie = random(30)
			await userModel.create({ id: data.email, ugaStudent: false, cookie: newCookie, cookieExp: (Date.now() + 86400000) })
			debug(`New user ${data.email} created`)
			res.cookie('sessionCookie', newCookie, { maxAge: 86400000 })
		} else {
			// User already exists
			// Create new cookie
			var newCookie = random(30)

			// Update the cookie of the user
			await userModel.findOneAndUpdate({ id: data.email }, { $set: { cookie: newCookie, cookieExp: (Date.now() + 86400000) } })
			debug(`New cookie for ${data.email} issued`)
			res.cookie('sessionCookie', newCookie, { maxAge: 86400000 })
		}
	} catch (error) {
		debug(`Error [3]: ${error}`)
	}

	// Send the user back to the main page
	res.redirect('/').send()
})

/**
 * Logout requests are handled here
 */
router.get('/logout', async (req, res) => {
	debug('New logout request')
	try {
		var user = await userModel.findOne({ cookie: req.cookies.sessionCookie })

		// No user with that cookie found
		if (!user) {
			let obj = { success: false, error: 'User not found' }
			res.redirect('/').send(obj)
		}

		// Delete user cookie
		user.set('cookie', '')
		await user.save()
		let obj = { success: true }
		res.redirect('/').send(obj)

	} catch (error) {
		debug(`Error [4]: ${error}`)
		let obj = { success: false, error: 'Server error' }
		res.status(500).redirect('/').send(obj)
	}
})

/**
 * A function to generate a cryptographic cookie
 * @param {number} howMany 
 * @param {number} chars 
 */
function random(howMany, chars) {
	chars = chars
		|| 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';
	var rnd = crypto.randomBytes(howMany)
	var value = new Array(howMany)
	var len = len = Math.min(256, chars.length)
	var d = 256 / len

	for (var i = 0; i < howMany; i++) {
		value[i] = chars[Math.floor(rnd[i] / d)]
	};

	return value.join('')
}

// Export the login router
module.exports = router
