//load express package and create app
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var config = require('./config');
var port = process.env.PORT || 8080;
var jwt = require('jsonwebtoken');
var multer = require('multer');
var superSecret = config.secret;
var User = require('./app/models/user');
var Img = require('./app/models/img');
var Menu = require('./app/models/menu');

var fs = require('fs');

mongoose.connect(config.database)

//use body parser to grab info from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//use multer for file upload
var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './public/img/uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });

//multer instance
var upload = multer({ storage: storage }).single('file');

/** API path that will upload the files */
app.post('/upload', function(req, res) {
	upload(req,res,function(err){
	    if(err){
	         res.json({error_code:1,err_desc:err});
	         return;
	    }
	     res.json({error_code:0,err_desc:null});
	})
});

//configure app to handle CORS requests
app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, \ Authorization');
	next();
});

//log requests to console
app.use(morgan('dev'));

//set public folder to serve public assets
app.use(express.static(__dirname + '/public'));

// ROUTES ===================================
// API ROUTES ------------------------
var apiRoutes = require('./app/routes/api')(app, express);
app.use('/api', apiRoutes);

// MAIN CATCHALL ROUTE ---------------
//set up route to index.html file whenever get a request to server (* is wildcard)
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname+'/public/angular/views/index.html'));
});

//start server
app.listen(port);
console.log('server running on ' + config.port);
