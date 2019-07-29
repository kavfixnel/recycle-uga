// Require mongoose 
let mongoose = require('mongoose');

// Creat a new Schema
let schema = mongoose.Schema;

/* Define the user object */
let userSchema = new schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	ugaStudent: {
		type: Boolean,
		default: false
	},
	cookie: String,
	cookieExp: Date,
	created: {
		type: Date,
		default: Date.now()
	},
	progress: {
		type: Number,
		default: 0,
	},
	preSurvey: 	Array,
	infoPage:	Array,
	gamePage:	Array,
	infoPage2:	Array,
	mapPage:	Array,
	postSurvey:	Array
});

// Compile the schema into a model
const User = mongoose.model('User', userSchema);

// Export the module
module.exports = User;
