var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DriverSchema = new Schema({
	name: { type: String },
	restaurant_id: { type: String },
	phone_number: { type: String }
});

module.exports = mongoose.model('Driver', DriverSchema);