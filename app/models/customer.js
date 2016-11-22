var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CustomerSchema = new Schema({
	first_name: { type: String},
	last_name: { type: String},
	phone_number: { type: String},
	email: { type: String }
});

module.exports = mongoose.model('Customer', CustomerSchema);