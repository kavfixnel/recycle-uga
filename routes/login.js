var express = require('express')
var router = express.Router()
var axios = require('axios')
var crypto = require('crypto')

var userModel = require('../schemas/user.js')

// Check if the user has to log in
router.use((req, res, next) => {
	//req.cookie()
	console.log("Checked cookie")
	next()
});

router.get('/cb', async (req, res) => {
	if(req.query.ticket == null) {
		// There is no ticket avaliable
		res.redirect('https://recycle-uga.herokuapp.com/')
	} else {
		// Get the ticket contents
		try {
			const url = 'https://cas2.stage.uga.edu/cas/validate?service=https://recycle-uga.herokuapp.com/login/cb&ticket=' + req.query.ticket
			const response = await axios.get(url)
    			var ans = response.data.split('\n')
			if(ans[0] == 'yes') {
				// Ticket was avlid and ans[1] has username
				var user = await userModel.findOne( { id : ans[1] } )
				if(!user) {
					// New user needs to be created
					var newCookie = random(30)
					await userModel.create({ id : ans[1], ugaStudent : true, cookie : newCookie, cookieExp: (Date.now() + 86400000) })
					console.log('New User created: ' + ans[1])
					console.log('New cookie issued: ' + newCookie)
					res.cookie('sessionCookie', newCookie, {maxAge:86400000})
				} else {
					// User already exists
					// Create new cookie
					var newCookie = random(30)

					// Update the cookie of the user
					userModule.findOneAndUpdate({id:ans[1]}, {$set: {cookie: newCookie}})
					userModule.findOneAndUpdate({id:ans[1]}, {$set: {cookieExp: (Date.now() + 86400000)}})

					console.log(`New cookie (${newCookie}) issued for ${ans[1]}`)

					res.cookie('sessionCookie', newCookie, {maxAge:86400000})
		
				}
			}
		} catch (error) {
			console.error(error)
		}
		
		// Redirect the user to the homepage
		res.redirect('https://recycle-uga.herokuapp.com/')
	}

	// Something went wrong and redirect the user to the homepage
	console.error("Something went wrong with /login/cb")
	res.redirect('https://recycle-uga.herokuapp.com/')





});

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.redirect('https://cas2.stage.uga.edu/cas/login?service=https://recycle-uga.herokuapp.com/login/cb')
});

function random (howMany, chars) {
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
