var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MenuIDs = new Schema({
	dish_ordered: { type: String }
});

var OrderSchema = new Schema({
	Username: { type: String},
	rest_oid: { type: String },
	// dish_ordered: [ MenuIDs ],
	Time_Placed: { type: String },
	delivery_instruction: { type: String},
	subtotal: { type: String },
});

module.exports = mongoose.model('Order', OrderSchema);