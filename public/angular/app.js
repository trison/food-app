//name app
angular.module('foodApp', [
	'ngAnimate',
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

		vm.reloadRoute = function(){
			$route.reload();
		};

		vm.message = "Ayo! This is message!";

		//define list of items
		vm.computers = [
			{ name: 'Macbook Pro', color: 'Silver', nerdness: 7 },
			{ name: 'Yoga 2 Pro', color: 'Gray', nerdness: 6 },
			{ name: 'ChromeBook', color: 'Black', nerdness: 5 }	
		];

		//object with info from form
		vm.computerData = {};
		
		vm.addComputer = function(){
			
			//add computer
			vm.computers.push({
				name: vm.computerData.name,
				color: vm.computerData.color,
				nerdness: vm.computerData.nerdness
			});

			//clear object/form
			vm.computerData = {};
		};
	})	
	// ********************************************
	// USER CONTROLLER
	.controller('userController', function(User) {
		var vm = this;

		// processing variable to show loading
		vm.processing = true;

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
			
			User.delete(id)
				.success(function(data) {
				// get all users to update the table
				// you can also set up your api
				// to return the list of users with the delete call User.all()
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
	.controller('userCreateController', function(User) {
		var vm = this;

		//var to hide/show elements, differentiate between create or edit page
		vm.type = 'create';

		//create user
		vm.saveUser = function(){
			vm.processing = true;
			vm.message = '';

			User.create(vm.userData)
				.success(function(data){
					vm.processing = false;

					//clear form after success
					vm.userData = {};
					vm.message = data.message;
				});
		};
	})
	// ********************************************
	// USER EDIT CONTROLLER
	.controller('userEditController', function($routeParams, User) {
		var vm = this;
		vm.type = 'edit';

		User.get($routeParams.user_id)
			.success(function(data) {
				vm.userData = data;
			});

		vm.saveUser = function() {
			vm.processing = true;
			vm.message = '';

			User.update($routeParams.user_id, vm.userData)
				.success(function(data) {
					vm.processing = false;
					vm.userData = {};
					vm.message = data.message;
				});
		};

		// vm.saveMenu = function() {
		// 	vm.processing = true;
		// 	vm.message = '';

		// 	User.updateMenu($routeParams.user_id, vm.menuData)
		// 		.success(function(data) {
		// 			vm.processing = false;
		// 			vm.menuData = {};
		// 			vm.menuMessage = data.menuMessage;
		// 		});
		// };
	})
	// ********************************************
	// MENU CREATE CONTROLLER
	.controller('menuCreateController', function(User) {
		var vm = this;
		vm.type = 'create';

	})
	// ********************************************
	// MENU EDIT CONTROLLER
	.controller('menuEditController', function($routeParams, User) {
		var vm = this;
		vm.type = 'edit';

		User.getMenu($routeParams._id)
			.success(function(menu) {
				vm.menuData = menu;
			});
	})

	// ********************************************
	// PROFILE CONTROLLER
	.controller('profileController', function($routeParams, $route, Auth, User){
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

		// User.getMenu(vm.user._id).success(function(data){
		// 	vm.menus = data;
		// });

		// vm.getUserMenu = function(userId){
		// 	var menu = User.getMenu(userId);
		// 	return menu;
		// };
	})

	// ********************************************
	// HOME CONTROLLER
	.controller('homeController', function(){
		var vm = this;
		vm.message = 'HOME PAGE!!';
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
