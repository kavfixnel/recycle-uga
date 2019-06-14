let mongoose = require('mongoose');

let schema = mongoose.Schema;

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
	cookie:  String,
	cookieExp: Date,
	created: {
		type: Date,
		default: Date.now()
	},
	progress: {
		type: Number,
		default: 0,
	}
});

const User = mongoose.model('User', userSchema);

module.exports = User;
