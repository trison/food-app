var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MenuSchema = new Schema({
	name: { type: String, required: true, index: {unique: true} },
	price: { type: String },
	description: { type: String },
	prep_time: { type: String },
	user_id: { type: String },
	img_url: { type: String },
	gf: { type: String, default: "false" },
	df: { type: String, default: "false" },
	nuts: { type: String, default: "false" },
	vegetarian: { type: String, default: "false" }
});

module.exports = mongoose.model('Menu', MenuSchema);