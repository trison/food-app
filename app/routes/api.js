var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

  //get instance of express router
  var apiRouter = express.Router();

  //route for authenticatin users
  apiRouter.post('/authenticate', function(req, res) {
    //find user. select username and password explicitly
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

  // ************** MIDDLEWARE for requests
  apiRouter.use(function(req, res, next) {
    //do logging
    console.log('Somebody just came to the app!');

    //add more middleware...
    
    //ROUTE MIDDLEWARE TO VERIFY TOKEN
    //check header or URL or POST parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    
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

  //test route, at GET http://localhost:8080/api
  apiRouter.get('/', function(req, res){
    res.json({ message: 'Hooray! Welcome to the API!' });
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
    //GET users at /api/users
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

    return apiRouter;
  };
