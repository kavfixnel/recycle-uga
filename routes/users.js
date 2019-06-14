var express = require('express');
var router = express.Router();
var request = require('request')

var userModel = require('../schemas/user.js');

// Check if the user has to log in
router.use((req, res, next) => {
	//req.cookie()
	console.log("Checked cookie");
	next();
});

router.get('/login', (req, res) => {
	res.redirect('https://cas2.stage.uga.edu/cas/login?service=https://recycle-uga.herokuapp.com/users/cb').send();
});

router.get('/cb', (req, res) => {
	if(req.query.ticket == null) {
		console.log("Empty sting")
		res.redirect('/')
	} else {
		console.log(res.query.ticket)
		request('https://cas2.stage.uga.edu/cas/validate?service=https://recycle-uga.herokuapp.com&ticket=' + res.query.ticket)
		res.redirect('/')
	}

	console.log("Something went wrong")
	res.redirect('/')
})

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

/* Update user progress */
router.post('/progress', (req, res) => {
	// Print data
	console.log(req.body);

	// Save data
	userModel.create(req.body, (err, obj) => {
		if(err) {
			console.log(err)
			res.status(500).send(err)
		} else {
			res.send('Success')
		}
	})

	res.status(200).send('Success!');
});

router.get('/newUser', (req, res) => {
	userModel.create({id:'newUser'}, (err, other) => {
		if(err) {
			console.log(err)
			res.send(err)
		} else {
			res.send('Success')
		}
	})
})

/* Get the users next avaliable progress page */

module.exports = router;
