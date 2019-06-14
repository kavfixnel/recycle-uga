const request = require('request');

var ticket = 'ST-14889-hRY9x6nHD1yOiUDO6H9X-cas2.stage.uga.edu'

request('https://cas2.stage.uga.edu/cas/validate?service=https://recycle-uga.herokuapp.com&ticket=' + ticket, function (error, response, body) {
	console.error('error:', error);
	console.log('statusCode:', response && response.statusCode);
	console.log('body:', body);
	var result = body.split('\n')
	console.log('result:', result)
});
