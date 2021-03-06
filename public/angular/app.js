//name app
angular.module('foodApp', [
	'ngAnimate',
	'ngFileUpload',
	'app.routes',
	'authService',
	'userService',
	'mainCtrl',
	'userCtrl'
	])
	// ********************************************
	//	MAIN CONTROLLER
	.controller('mainController', function($rootScope, $location, $route, Auth){
		var vm = this;

		// get info if person is logged in
		vm.loggedIn = Auth.isLoggedIn();

		//check to see if a user is logged in on every request
		$rootScope.$on('$routeChangeStart', function(){
			vm.loggedIn = Auth.isLoggedIn();

			//get user info on route change
			Auth.getUser()
				.then(function(data){
					vm.user = data.data;
					if(vm.user.username == "admin")
						vm.isAdmin = true;
					else
						vm.isAdmin = false;
			});
		});

		//handle login form
		vm.doLogin = function(){
			vm.processing = true;
			vm.error = '';

			//call Auth.login()
			Auth.login(vm.loginData.username, vm.loginData.password)
				.success(function(data){
					vm.processsing = false;

					//if user successfully logs in, redirect to users page
					if (data.success)	
						$location.path('/profile');
					else
						vm.error = data.message;
				});
		};

		//handle logging out
		vm.doLogout = function(){
			Auth.logout();
			//reset all user info
			vm.user = {};
			$location.path('/login');
		};

		// vm.reloadRoute = function(){
		// 	$route.reload();
		// };
	})	
	// ********************************************
	// USER CONTROLLER
	.controller('userController', function(User, Auth, $location) {
		Auth.getUser()
			.then(function(data){
				vm.user = data.data;
				if(vm.user.username !== "admin")
					$location.path('/profile')
		});

		var vm = this;

		// processing variable to show loading
		vm.processing = true;

		//delay before getting users info
		setTimeout( function(){}, 2000 );

		// get users on page load
		User.all().success(function(data) {
		    // remove processing var when users come
			vm.processing = false;
			// bind the users to vm.users
			vm.users = data;
		});

		// get menus on page load
		User.menus().success(function(data) {
			vm.processing = false;
			vm.menus = data;
		});

		vm.deleteUser = function(id) {
			vm.processing = true;
			//need to add menu deletion
			
			User.delete(id)
				.success(function(data) {
				User.all()
					.success(function(data){
						vm.processing = false;
						vm.users = data;
				});
			});
		};

		vm.deleteMenu = function(menuId){
			vm.processing = true;

			User.deleteMenu(menuId)
				.success(function(data) {

				User.menus()
					.success(function(data){
						vm.processing = false;
						vm.menus = data;
				});
			});
		};
	})
	// ********************************************
	// USER CREATE CONTROLLER
	.controller('userCreateController', function(User, $window) {
		var vm = this;
		vm.type = 'create';
		vm.message = '';
		vm.error = '';

		//create user
		vm.saveUser = function(){
			vm.processing = true;
			vm.message = '';
			vm.error = '';

			if (vm.userData.password == vm.userData.password1){
				User.create(vm.userData)
					.success(function(data){
						vm.processing = false;

						//clear form after success
						vm.userData = {};
						vm.message = data.message;
					});
			}
			else{
				vm.processing = false;
				vm.error = "Password entries do not match!";
			}

			$window.scrollTo(0,0);
		};
	})
	// ********************************************
	// USER EDIT CONTROLLER
	.controller('userEditController', function($routeParams, $window, User, Auth) {
		var vm = this;
		vm.type = 'edit';
		vm.deleteMessage = '';
		vm.error = '';

		User.get($routeParams.user_id)
			.success(function(data) {
				vm.userData = data;
			});

		// get menus on page load
		User.menus().success(function(data) {
			vm.processing = false;
			vm.menus = data;
		});

		vm.deleteUser = function(id){
			vm.processing = true;

			//delete user's menus
			vm.menus.forEach(function(data){
				if(vm.userData._id == data.user_id){
					User.deleteMenu(data._id)
						.success(function(data) {

						User.menus()
							.success(function(data){
								vm.processing = false;
								vm.menus = data;
							});
						});
				}
			});

			//delete user
			User.delete(vm.userData._id)
				.success(function(data) {
					User.all()
						.success(function(data){
							vm.processing = false;
							vm.users = data;
						});
			});

			vm.deleteMessage = "User deleted!";
			$window.scrollTo(0,0);
			Auth.logout();
		};

		vm.saveUser = function() {
			vm.processing = true;
			vm.message = '';
			vm.error = '';

			if (vm.userData.password == vm.userData.password1){
				User.update($routeParams.user_id, vm.userData)
					.success(function(data) {
						vm.processing = false;
						vm.userData = {};
						vm.message = data.message;
					});
			}
			else{
				vm.processing = false;
				vm.error = "Password entries do not match!";
			}
			$window.scrollTo(0,0);
		};

		vm.deleteMenu = function(menuId){
			vm.processing = true;

			User.deleteMenu(menuId)
				.success(function(data) {

				User.menus()
					.success(function(data){
						vm.processing = false;
						vm.menus = data;
				});
			});
		};
	})

	// ********************************************
	// MENU CREATE CONTROLLER
	.controller('menuCreateController', function($routeParams, User, Upload, $window) {
		var vm = this;
		vm.type = 'create';
		vm.message = '';

		User.get($routeParams._id)
			.success(function(data) {
				vm.userData = data;
			});

		//create blank menu with user id
		User.createMenu(vm.menuData)
			.success(function(data){
				vm.processing = false;
				vm.menuData = {};
				vm.menuData.user_id = $routeParams._id;
				vm.menuData.img_url = "img/placeholder.png";
				vm.menuData.gf = "false";
				vm.menuData.df = "false";
				vm.menuData.nuts = "false";
				vm.menuData.vegetarian = "false";
				//vm.message = data.message; //"Menu Validation Failed"??
			});

		vm.change = function(value, dietType){
        	console.log("value = "+value+" dietType = "+dietType);
        	switch(dietType) {
        		case "g":
        			if(value == "false")
        				vm.menuData.gf = "true";
        			else if (value == "true")
        				vm.menuData.gf = "false";
        			break;
        		case "d":
        			if(value == "false")
        				vm.menuData.df = "true";
        			else if (value == "true")
        				vm.menuData.df = "false";
        			break;
        		case "n":
        			if(value == "false")
        				vm.menuData.nuts = "true";
        			else if (value == "true")
        				vm.menuData.nuts = "false";
        			break;
        		case "v":
        			if(value == "false")
        				vm.menuData.vegetarian = "true";
        			else if (value == "true")
        				vm.menuData.vegetarian = "false";
        			break;
        	}
        }

		vm.saveMenu = function() {
			vm.processing = true;
			vm.message = '';

			User.createMenu(vm.menuData)
				.success(function(data){
					vm.processing = false;
					vm.menuData = {};
					vm.message = data.message;
				});
			$window.scrollTo(0,0);
		};

		//Menu img submit
		vm.submit = function(){ //function to call on form submit
			var date = new Date();
            var month = date.getMonth();
	        var day = date.getDay();
	        var year = date.getFullYear();

            var timeStamp = year+month+day;
            var fullName = vm.file.name;
			
            if (vm.upload_form.file.$valid && vm.file) { //check if form is valid
				var name = fullName.split('.')[0];
	        	var ext = fullName.split('.')[fullName.split('.').length -1];
	        	var fileName = name + '-' + timeStamp + '.' + ext;

                vm.upload(vm.file, fileName);
            }
        }
        vm.upload = function (file, fileName) {
            Upload.upload({
                url: '/api/upload', //webAPI exposed to upload the file
                data:{file:file} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                if(resp.data.error_code === 0){ //validate success
                    //$window.alert('Success ' + resp.config.data.file.name + ' uploaded. Response: ');
                    vm.menuData.img_url = "/img/menus/"+fileName;
                } else {
                    //$window.alert('an error occured');
                    vm.message = "An error occured!";
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                //$window.alert('Error status: ' + resp.status);
                vm.message = "Error status: "+resp.status;
            }, function (evt) {
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };
	})

	// ********************************************
	// MENU EDIT CONTROLLER
	.controller('menuEditController', function($routeParams, User, Upload, $window) {
		var vm = this;
		vm.type = 'edit';
		vm.message = '';

		User.getMenu($routeParams._id)
			.success(function(menu) {
				vm.menuData = menu;
			});

		vm.saveMenu = function() {
			vm.processing = true;
			vm.message = '';

			User.updateMenu($routeParams._id, vm.menuData)
				.success(function(data) {
					vm.processing = false;
					vm.menuData = {};
					vm.message = data.message;
				});
			$window.scrollTo(0,0);
		};

		//Menu img submit
		vm.submit = function(){ //function to call on form submit
			var date = new Date();
            var month = date.getMonth();
	        var day = date.getDay();
	        var year = date.getFullYear();

            var timeStamp = year+month+day;
            var fullName = vm.file.name;
			
            if (vm.upload_form.file.$valid && vm.file) { //check if form is valid
				var name = fullName.split('.')[0];
	        	var ext = fullName.split('.')[fullName.split('.').length -1];
	        	var fileName = name + '-' + timeStamp + '.' + ext;

                vm.upload(vm.file, fileName);
            }
        }
        vm.upload = function (file, fileName) {
            Upload.upload({
                url: '/api/upload', //webAPI exposed to upload the file
                data:{file:file} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                if(resp.data.error_code === 0){ //validate success
                    //$window.alert('Success ' + resp.config.data.file.name + ' uploaded. Response: ');
                    vm.menuData.img_url = "/img/menus/"+fileName;
                } else {
                    //$window.alert('an error occured');
                    vm.message = "An error occured!";
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                //$window.alert('Error status: ' + resp.status);
                vm.message = "Error status: "+resp.status;
            }, function (evt) {
                console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
        };

        vm.change = function(value, dietType){
        	console.log("value = "+value+" dietType = "+dietType);
        	switch(dietType) {
        		case "g":
        			if(value == "false")
        				vm.menuData.gf = "true";
        			else if (value == "true")
        				vm.menuData.gf = "false";
        			break;
        		case "d":
        			if(value == "false")
        				vm.menuData.df = "true";
        			else if (value == "true")
        				vm.menuData.df = "false";
        			break;
        		case "n":
        			if(value == "false")
        				vm.menuData.nuts = "true";
        			else if (value == "true")
        				vm.menuData.nuts = "false";
        			break;
        		case "v":
        			if(value == "false")
        				vm.menuData.vegetarian = "true";
        			else if (value == "true")
        				vm.menuData.vegetarian = "false";
        			break;
        	}
        }
	})

	// ********************************************
	// PROFILE CONTROLLER
	.controller('profileController', function($routeParams, $route, Auth, User, Upload, $window){
		var vm = this;
		vm.user = "";
		
		Auth.getUser()
			.then(function(data){
				vm.user = data.data;
		});

		User.menus().success(function(data) {
			vm.menus = data;
		});

		vm.deleteMenu = function(menuId){
			vm.processing = true;

			User.deleteMenu(menuId)
				.success(function(data) {

				User.menus()
					.success(function(data){
						vm.processing = false;
						vm.menus = data;
				});
			});
		};
	})
	// ********************************************
	// ORDERS CONTROLLER
	.controller('orderController', function(Auth, User, $window, $route){
		var vm = this;
		vm.processing = true;
		vm.orders = "";

		Auth.getUser()
			.then(function(data){
				vm.user = data.data;
		});

  		vm.propertyName = 'name';
  		vm.reverse = true;

  		vm.sortBy = function(propertyName){
  			vm.reverse = (vm.propertyName === propertyName) ? !vm.reverse : false;
  			vm.propertyName = propertyName;
  		};

		User.getOrders()
			.success(function(ord) {
				vm.orders = ord;
				vm.processing = false;
			});

		vm.deleteOrder = function(orderId){
			vm.processing = true;

			User.deleteOrder(orderId)
				.success(function(data) {

				User.getOrders()
					.success(function(data){
						vm.processing = false;
						vm.orders = data;
				});
			});
		};

		vm.refresh = function(){
			$route.reload();
		};
	})
	// ********************************************
	// ADMIN CONTROLLER
	.controller('adminController', function(User, $routeParams, $location) {
		var vm = this;
		vm.type = 'create';
		vm.message = '';

		User.get($routeParams.user_id)
			.success(function(data) {
				vm.userData = data;
			});

		if(vm.userData.admin != "y"){
			$location.url('/profile');
			return;
		}

		vm.processing = true;

		User.all().success(function(data) {
			vm.processing = false;
			vm.users = data;
		});

		vm.deleteUser = function(id) {
			vm.processing = true;
			//need to add menu deletion
			
			User.delete(id)
				.success(function(data) {
				User.all()
					.success(function(data){
						vm.processing = false;
						vm.users = data;
				});
			});
		};
	})
	// ********************************************
	// DRIVER CONTROLLER
	.controller('driverController', function(User, $window){
		var vm = this;
		vm.message = '';
		vm.error = '';
		//vm.type = create;

		//create driver
		vm.saveDriver = function(){
			vm.processing = true;
			vm.message = '';
			vm.error = '';

			User.createDriver(vm.driverData)
				.success(function(data){
					vm.processing = false;
					vm.driverData = {};
					vm.message = data.message;
					vm.processing = false;
					//vm.error = "Password entries do not match!";
				});
			$window.scrollTo(0,0);
		};		
	})

	// ********************************************
	// HOME CONTROLLER
	.controller('homeController', function(){
		var vm = this;
		vm.message = 'HOME PAGE!!';
	})
	// ********************************************
	// LEARNING CONTROLLER
	.controller('learnController', function(){
		var vm = this;
		vm.message = 'LEARN PAGE!!';
	})
	// ********************************************
	// ABOUT CONTROLLER
	.controller('aboutController', function(){
		var vm = this;
		vm.message = "ABOUT PAGE!!";
	})
	
	// ********************************************
	// CONTACT CONTROLLER
	.controller('contactController', function(){
		var vm = this;
		vm.message = 'CONTACT PAGE!!';
	})

	.config(function($httpProvider){
        $httpProvider.interceptors.push('AuthInterceptor');
    });
;
