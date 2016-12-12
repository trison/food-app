var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MenuIDs = new Schema({
	id: { type: String }
});

var OrderSchema = new Schema({
	username: { type: String},
	rest_id: { type: String },
	menu_ids: [ MenuIDs ],
	time_placed: { type: String },
	delivery_instruction: { type: String},
	subtotal: { type: String },
});

module.exports = mongoose.model('Order', OrderSchema);