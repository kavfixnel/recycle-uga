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
	preSurvey: Object,
	pageOne: Object,
	pageTwo: Object,
	pageThree: Object,
	postSurvey: Object
});

// Compile the schema into a model
const User = mongoose.model('User', userSchema);

// Export the module
module.exports = User;
