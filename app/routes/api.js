var User = require('../models/user');
var Img = require('../models/img');
var Menu = require('../models/menu');
var Order = require('../models/order');
var Customer = require('../models/customer');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var fs = require('fs');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

  //get instance of express router
  var apiRouter = express.Router();

  //route for authenticatin users
  apiRouter.post('/authenticate', function(req, res) {
    //find user. select username and password explicitly
    User.findOne({ username: req.body.username })
    .select('_id name email username password description hours address phone delivery min_order').exec(function(err, user) {
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
              _id: user._id,
              name: user.name,
              username: user.username,
              email: user.email,
              description: user.description,
              hours: user.hours,
              address: user.address,
              phone: user.phone,
              delivery: user.delivery,
              min_order: user.min_order
            },
            superSecret, {
              expiresIn: 1440 //24mins
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

 //test route, at GET http://localhost:8080/api
  apiRouter.get('/', function(req, res){
    res.json({ message: 'Welcome to the API boiii!' });
  });

  // ===================== USER ======================
  //POST user at localhost:8080/api/users
  apiRouter.post('/users/', function(req, res) {
    //create new instance of User model
    var user = new User();

    //set users info (from request)
    user.name = req.body.name;
    user.email = req.body.email;
    user.username = req.body.username;
    user.password = req.body.password;
    user.address = req.body.address;
    user.phone = req.body.phone;
    user.description = req.body.description;
    user.hours = req.body.hours;
    user.delivery = req.body.delivery;
    user.min_order = req.body.min_order;

    //save user and check for errors
    user.save(function(err) {
      if(err) {
        //duplicate entry
        if(err.code == 11000)
          return res.json({ success: false, message: 'A user with that username already exists. '});
        else
          return res.send(err);
      }
      res.json({ message: 'Thank for for registering, '+req.body.name+'!' });
    });
  })

  // ===================== IMG (PROB NOT GONNA USE) ======================
  //POST image at /api/img
  apiRouter.post('/img/', function(req, res) {
    //create new instance of Img model
    var img = new Img();
    var imgPath = '/Users/trison/Web/food/public/img/img.png';

    //set img info (from request)
    img.data = fs.readFileSync(imgPath);

    // var str = String(data);
    // img.data = data.toString('base64');

    img.contentType = 'image/png';

    //save img and check for errors
    img.save(function(err) {
      if(err) throw err;
      console.error('saved img to mongo: '+img.data);
      res.json({ message: 'Image posted!' });
    });
  })

  //routes that end in /img
  apiRouter.route('/img')
    //GET images at /api/img
    .get(function(req, res){
      Img.find(function(err, imgs) {
        if(err) res.send(err);
        
        //return images
        res.json(imgs);
      });
    });

  // ============ MENU =========================
  //POST menu at /api/menu
  apiRouter.post('/menu/', function(req, res) {
    //create new instance of Menu model
    var menu = new Menu();

    //set menu info (from request)
    menu.name = req.body.name;
    menu.price = req.body.price;
    menu.description = req.body.description;
    menu.prep_time = req.body.prep_time;
    menu.user_id = req.body.user_id;
    menu.img_url = req.body.img_url;
    menu.gf = req.body.gf;
    menu.df = req.body.df;
    menu.nuts = req.body.nuts;
    menu.vegetarian = req.body.vegetarian;

    //save menu and check for errors
    menu.save(function(err) {
      if(err) {
        //duplicate entry
        if(err.code == 11000)
          return res.json({ success: false, message: 'A menu with that name already exists. '});
        else
          return res.send(err);
      }
      res.json({ message: 'Menu item '+req.body.name+' added! ' });
    });
  })

  //GET all menus
  apiRouter.route('/menu/')
    .get(function(req, res){
      Menu.find(function(err, menu) {
        if(err) res.send(err);     
          //return menu
          res.json(menu);
      });
    });
  
  // ========== ORDERS ==========================
  // apiRouter.post('/orders/', function(req, res){
  //   var order = new Order();

  //   //set order info (from request)
  //   order.name = req.body.name;
  //   order.customer_username = req.body.customer_username;
  //   order.menu_id = req.body.menu_id;
  //   order.time_placed = req.body.time_placed;

  //   //save order and check for errors
  //   order.save(function(err) {
  //     if(err) {
  //       if(err.code == 11000)//duplicate entry
  //         return res.json({ success: false, message: 'An order with that name already exists. '});
  //       else
  //         return res.send(err);
  //     }
  //     res.json({ message: 'Order added! '+req.body });
  //   });
  // });

  apiRouter.route('/orders/')
    .get(function(req, res){
      Order.find(function(err, order) {
        if(err) res.send(err);
          res.json(order);
      });
    });

  apiRouter.route('/orders/:_id')
    .get(function(req, res) {
      Order.findById(req.params._id, function(err, order) {
        if(err) res.send(err);
        res.json(order);
      })
    })
    .delete(function(req, res) {
      Order.remove(
        { _id: req.params._id },
        function(err, menu){
          if(err) return res.send(err);
          res.json({ message: 'Successfully deleted order item' });
        });
    });

    // ===================== CUSTOMER ======================
    apiRouter.route('/customers/')
    .get(function(req, res){
      Customer.find(function(err, customers) {
        if(err) res.send(err);
          res.json(customers);  
      });
    });

    apiRouter.route('/customers/:_id')
    .get(function(req, res) {
      Menu.findById(req.params._id, function(err, customer) {
        if(err) res.send(err);
          res.json(customer);
      });
    })

  // ************** MIDDLEWARE for requests
  apiRouter.use(function(req, res, next) {
    //do logging
    console.log('Somebody just came to the app!');
    
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

  // ===================== USER ======================
  //routes that end in /users
  apiRouter.route('/users')
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
        if (req.body.email) user.email = req.body.email;
        if (req.body.username) user.username = req.body.username;
        if(req.body.password) user.password = req.body.password;
        if (req.body.address) user.address = req.body.address;
        if (req.body.phone) user.phone = req.body.phone;
        if (req.body.description) user.description = req.body.description;
        if (req.body.hours) user.hours = req.body.hours;
        if (req.body.delivery) user.delivery = req.body.delivery;
        if (req.body.min_order) user.min_order = req.body.min_order;

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
          res.json({ message: 'Successfully deleted user!' });
        });
    });

    // ===================== MENU ======================
    //----------------ROUTES FOR menu/:_id
    apiRouter.route('/menu/:_id')
    //GET menu with id (at /api/menu/:_id)
    .get(function(req, res) {
      Menu.findById(req.params._id, function(err, menu) {
        if(err) res.send(err);

        //return that menu
        res.json(menu);
      });
    })
    //PUT (update) menu at /api/menu/:user_id
    .put(function(req, res) {
      //use menu model to find the menu we want
      Menu.findById( req.params._id, function(err, menu){
        if(err) res.send(err);
      
        //update only if new
        if (req.body.name) menu.name = req.body.name;
        if (req.body.price) menu.price = req.body.price;
        if (req.body.description) menu.description = req.body.description;
        if (req.body.prep_time) menu.prep_time = req.body.prep_time;
        if (req.body.user_id) menu.user_id = req.body.user_id;
        if (req.body.img_url) menu.img_url = req.body.img_url;
        if (req.body.df) menu.df = req.body.df;
        if (req.body.gf) menu.gf = req.body.gf;
        if (req.body. nuts) menu.nuts = req.body.nuts;
        if (req.body.vegetarian) menu.vegetarian = req.body.vegetarian;

        //save menu
        menu.save(function(err){
          if(err) res.send(err);
          
          //return a message
          res.json({ message: 'Menu updated!' });
        });
      });
    })
    //DELETE menu item at /api/menu/:_id
    .delete(function(req, res) {
      Menu.remove(
        { _id: req.params._id },
        function(err, menu){
          if(err) return res.send(err);
          res.json({ message: 'Successfully deleted menu item' });
        });
    });

    //api endpoint to get user info
    apiRouter.get('/me', function(req, res){
     res.send(req.decoded);
    });

    return apiRouter;
  };
