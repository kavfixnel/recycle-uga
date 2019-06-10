var express = require('express');
var router = express.Router();

router.get('/module', (req, res) => {
	// Check cookie
	
	// Check 
});

router.get('/', (req, res) => {
	res.redirect('https://cas2.stage.uga.edu/cas/login?service=https://recycle-uga.herokuapp.com');
	res.send();
});

module.exports = router;
