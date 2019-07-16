// Import the required modules
let express = require('express')
let router = express.Router()
let axios = require('axios')
let crypto = require('crypto')
let { google } = require('googleapis');

let userModel = require('../schemas/user.js')

// Redirect users to the cas login page
router.get('/cas', (req, res, next) => {
	res.redirect('https://cas2.stage.uga.edu/cas/login?service=https://recycle-uga.herokuapp.com/login/cb')
});

router.get('/cb', async (req, res) => {
	if (req.query.ticket == null) {
		// There is no ticket avaliable
		res.redirect('/')
	} else {
		// Get the ticket contents
		try {
			const url = 'https://cas2.stage.uga.edu/cas/validate?service=https://recycle-uga.herokuapp.com/login/cb&ticket=' + req.query.ticket
			const response = await axios.get(url)
			var ans = response.data.split('\n')
			if (ans[0] == 'yes') {
				// Ticket was valid and ans[1] has username
				var user = await userModel.findOne({ id: ans[1] })
				if (!user) {
					// New user needs to be created
					var newCookie = random(30)
					await userModel.create({ id: ans[1], ugaStudent: true, cookie: newCookie, cookieExp: (Date.now() + 86400000) })
					if (process.env.DEVMODE == 'TRUE') {
						console.log('New User created: ' + ans[1])
						console.log('New cookie issued: ' + newCookie)
					}
					res.cookie('sessionCookie', newCookie, { maxAge: 86400000 })
				} else {
					// User already exists
					// Create new cookie
					var newCookie = random(30)

					// Update the cookie of the user
					await userModel.findOneAndUpdate({ id: ans[1] }, { $set: { cookie: newCookie, cookieExp: (Date.now() + 86400000) } })

					if (process.env.DEVMODE == 'True') {
						console.log(`New cookie (${newCookie}) issued for ${ans[1]}`)
					}

					res.cookie('sessionCookie', newCookie, { maxAge: 86400000 })
				}
			}
		} catch (error) {
			console.error(error)
		}

		// Redirect the user to the homepage
		res.redirect('/').send()
	}

	// Something went wrong and redirect the user to the homepage
	console.error("Something went wrong with /login/cb")
	res.redirect('/').send()
});

// Create an OAuth2 Google client
const oauth2Client = new google.auth.OAuth2(
	process.env.CLIENTID,
	process.env.CLIENTSECRET,
	'https://recycle-uga.herokuapp.com/login/googlecb'
);

// Redirect the users to the Google OAuth page
router.get('/google', (req, res) => {
	// Generate a new redirection URL to Googles OAuth network
	let redirectURL = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: 'https://www.googleapis.com/auth/userinfo.email'
	});

	// Redirect the user to that URL
	res.redirect(redirectURL)
})

// The callback URL for Google OAuth
router.get('/googlecb', async (req, res) => {
	try {
		const { tokens } = await oauth2Client.getToken(req.query.code)

		let url = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + tokens.access_token
		let { data } = await axios.get(url)z

		// Make new user or grant new cookie
		var user = await userModel.findOne({ id: data.email })
		if (!user) {
			// New user needs to be created
			var newCookie = random(30)
			await userModel.create({ id: data.email, ugaStudent: false, cookie: newCookie, cookieExp: (Date.now() + 86400000) })
			if (process.env.DEVMODE == 'TRUE') {
				console.log('New User created: ' + data.email)
				console.log('New cookie issued: ' + newCookie)
			}
			res.cookie('sessionCookie', newCookie, { maxAge: 86400000 })
		} else {
			// User already exists
			// Create new cookie
			var newCookie = random(30)

			// Update the cookie of the user
			await userModel.findOneAndUpdate({ id: data.email }, { $set: { cookie: newCookie, cookieExp: (Date.now() + 86400000) } })

			if (process.env.DEVMODE == 'TRUE') {
				console.log(`New cookie (${newCookie}) issued for ${data.email}`)
			}

			res.cookie('sessionCookie', newCookie, { maxAge: 86400000 })
		}
	} catch (error) {
		console.log('Error in login.js [1]: ' + error)
	}

	// Send the user back to the main page
	res.redirect('/').send()
})

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

module.exports = router
