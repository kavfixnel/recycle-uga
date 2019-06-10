let mongoose = require('mongoose');

let schema = mongoose.Schema;

let userSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true
	},
	ugaStudent: {
		type: Boolean,
		default: false
	},
	created: {
		type: Date,
		default: Date.now()
	},
	progress: {
		type: int,
		default: 0,
	}
});

const User = mongoose.model('User', userSchema);

module.exports = User;
