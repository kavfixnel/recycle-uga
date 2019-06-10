var express = require('express');
var router = express.Router();

//var userModel = require('../schemas/user.js');

// Check if the user has to log in
router.use((req, res, next) => {
	//req.cookie()
	console.log("Checked cookie");
	next();
});

router.get('/login', (req, res) => {
	res.redirect('https://cas2.stage.uga.edu/cas/login?service=https://recycle-uga.herokuapp.com').send();
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Update user progress */
router.post('/progress', (req, res) => {
	// Print data
	console.log(req.body);
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
