const Mongoose = require('mongoose');

const UserSchema = new Mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
		},
		date:{
			type: Date,
			default: Date.now,
		},
});

const User = Mongoose.model('User', UserSchema);

module.exports = User;