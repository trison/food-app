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

// ==== ROUTES ====
//basic route for homepage
app.get('/', function(req, res) {
	res.send('HOME PAGE');
	//res.sendFile(path.join(__dirname+'/public/index.html'));
});

//get instance of express router
var apiRouter = express.Router();

//route for authenticatin users
apiRouter.post('/authenticate', function(req, res) {
	//find user. select username and passowrd explicitly
	User.findOne({ username: req.body.username })
	.select('name username password').exec(function(err, user) {
		if(err) throw err;

		//no user with that username found
		if(!user) {
			res.json({
				success: false,
				message: 'Authentication failed. User not found.'
			});
		} else if (user) {
			//check if password matches
			var validPassword = user.comparePassword(req.body.password);
			if(!validPassword) {
				res.json({
					success: false,
					message: 'Authentication failed. Wrong password.'
				});
			} else {
				//if user found and password right, create token
				var token = jwt.sign(
					{
						name: user.name,
						username: user.username
					},
					superSecret, {
						expiresIn: 1440 //24hrs
					}
				);
			//return info including token as JSON
			res.json({
				success: true,
				message: 'Enjoy your token!',
				token: token
			});
			}//end else
		}
	});
});

//middleware for requests
apiRouter.use(function(req, res, next) {
	//do logging
	console.log('Somebody just came to the app!');

	//add more middleware...
	
	//ROUTE MIDDLEWARE TO VERIFY TOKEN
	//check header or URL or POST parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];
	
	//decode token
	if(token){
		//verfies secret and checks exp
		jwt.verify(token, superSecret, function(err, decoded){
			if(err){
				return res.status(403).send({
					success: false,
					message: 'Failed to authenticate token.'
				});
			}else {
				//if all good, save request for other routes
				req.decoded = decoded;
				next();
			}
		});
	}else{
		//if no token, return HTTP 403(access forbidden) and err msg
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
});



//test route, at GET http://localhost:9090/api
apiRouter.get('/', function(req, res){
	res.json({ message: 'hooray! welcome to the api!' });
});

//routes that end in /users
apiRouter.route('/users')
	//POST user at localhost:8080/api/users
	.post(function(req, res) {
		//create new instance of User model
		var user = new User();
		
		//set users info (from request)
		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;

		//save user and check for errors
		user.save(function(err) {
			if(err) {
				//duplicate entry
				if(err.code == 11000)
					return res.json({ success: false, message: 'A user with that username already exists. '});
				else
					return res.send(err);
			}
			res.json({ message: 'User created!' });
		});
	})
	//GET users
	.get(function(req, res){
		User.find(function(err, users) {
			if(err) res.send(err);
			
			//return users
			res.json(users);	
		});
	});

//routes that end in /users/:user_id
apiRouter.route('/users/:user_id')
	//GET user with id (at /api/users/:user_id
	.get(function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if(err) res.send(err);

			//return that user
			res.json(user);
		});
	})
	//PUT (update) user at /api/users/:user_id
	.put(function(req, res) {
		//use user model to find the user we want
		User.findById(req.params.user_id, function(err, user){
			if(err) res.send(err);
		
			//update only if new
			if (req.body.name) user.name = req.body.name;
			if (req.body.username) user.username = req.body.username;
			if(req.body.password) user.password = req.body.password;

			//save user
			user.save(function(err){
				if(err) res.send(err);
				
				//return a message
				res.json({ message: 'User updated!' });
			});
		});
	})
	//DELETE user at /api/users/:user_id
	.delete(function(req, res) {
		User.remove(
			{ _id: req.params.user_id },
			function(err, user){
				if(err) return res.send(err);
				res.json({ message: 'Succesfully deleted' });
			});
	});

//api endpoint to get user info
apiRouter.get('/me', function(req, res){
	res.send(req.decoded);
});

// REGISTER ROUTES
app.use('/api', apiRouter);

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
console.log('server running on 8080');
