var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//img schema
var ImgSchema = new Schema({
    	data: Buffer,
    	contentType: String
});

//return the model
module.exports = mongoose.model('Img', ImgSchema);