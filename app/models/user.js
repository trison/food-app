//grab the packages needed for user model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

//user schema
var UserSchema = new Schema({
	name: String,
	email: { type: String, required: true, index: { unique: true }},
	username: { type: String, required: true, index: { unique: true }},
	password: { type: String, required: true, select: false },
	menu: [
		{ item_name: String, item_price: String }
	]
});

//hash password before user is saved
UserSchema.pre('save', function(next) {
	var user = this;
	
	//hash password only if password is changed or user is new
	if(!user.isModified('password')) return next();

	//generate hash
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if(err) return next(err);

		//change password to hashed version
		user.password = hash;
		next();
	});
});

//method to compare given password with db hash
UserSchema.methods.comparePassword = function(password) {
	var user = this;

	return bcrypt.compareSync(password, user.password);
};

//return the model
module.exports = mongoose.model('User', UserSchema);
