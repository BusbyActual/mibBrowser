const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
	fullName: {
		type: String,
		trim: true,
		required: true
	},
	email: {
		type: String,
		unique: true,
		lowercase: true,
		trim: true,
		required: true
	},
	hash_password: {
		type: String,
		required: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

/* possibly salt pw too? */
UserSchema.methods.comparePassword = (password) => {
	return bcrypt.compareSync(password, this.hash_password);
}

mongoose.model('User', UserSchema);
