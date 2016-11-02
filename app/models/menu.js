var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MenuSchema = new Schema({
	name: { type: String, required: true, index: {unique: true} },
	price: { type: String},
	description: { type: String},
	user_id: { type: String}
});

module.exports = mongoose.model('Menu', MenuSchema);