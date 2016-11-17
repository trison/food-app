var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
	name: { type: String, required: true, index: {unique: true} },
	customer_id: { type: String},
	menu_id: { type: String }
});

module.exports = mongoose.model('Order', OrderSchema);