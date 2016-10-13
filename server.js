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
var superSecret = config.secret;
var User = require('./app/models/user');

mongoose.connect(config.database)

//use body parser to grab info from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

/*
//use app.route instead of app.get as shortcut to Router for multiple req
app.route('/login')
	//show the form (GET http://localhost:8080/login)
	.get(function(req, res){
		res.send('this is the login form');
	})

	//process login form (POST .../login)
	.post(function(req, res){
		console.log('processing login form');
		res.send('processing login form');
	}
);


//create routes for admin section
var adminRouter = express.Router();

//middeware that will happen on every request
adminRouter.use(function(req, res, next) {
	//log each request to console
	console.log(req.method, req.url);

	//continue and go to the route
	next();
});

//admin main page. the dashboard (localhost:8080/admin)
adminRouter.get('/', function(req, res) {
	res.send('I am the dashboard!');
});

//users page (localhost:8080/admin/users)
adminRouter.get('/users', function(req, res) {
	res.send('I show all the users!');
});

//validate :name before the request below
adminRouter.param('name', function(req, res, next, name){
	//do validation on name here
	//validate
	//log confirmation
	console.log('doing name validations on ' + name);

	//once validation is done save new item in req
	req.name = name;
	//go to next thing
	next();
});

//route with parameters
adminRouter.get('/hello/:name', function(req, res) {
	res.send('hello ' + req.name + '!');
});

//route with parameter (localhost:8080/admin/users/:name)
adminRouter.get('/users/:name', function(req, res){
	res.send('hello ' + req.params.name + '!');
});

//posts page (localhost:8080/admin/posts)
adminRouter.get('/posts', function(req, res) {
	res.send('I show all the posts!');
});

//apply routes to appliction
app.use('/admin', adminRouter);
*/

//start server
app.listen(port);
console.log('server running on ' + config.port);
