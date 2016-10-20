angular.module('mainCtrl', [])
//controller for entire site
	.controller('mainController', function($rootScope, $location, Auth){
		//bind to view model
		var vm = this;

		//get info if person is logged in
		vm.loggedIn = Auth.isLoggedIn();

		//check to see if a user is logged in on every request
		$rootScope.$on('$routeChangeStart', function(){
			vm.loggedin = Auth.isLoggedIn();

			//get user info on route change
			Auth.getUser().success(function(data){
				vm.user = data;
			});
		});

		//handle login form
		vm.doLogin = function(){
			//call Auth.login()
			Auth.login(vm.loginData.username, vm.loginData.password)
				.success(function(data){
					//if user successfully logs in, redirect to users page
					$location.path('/users');
				});
		};

		//handle logging out
		vm.doLogout = function(){
			Auth.logout();
			//reset all user info
			vm.user = {};
			$location.path('/login');
		};



		// //define variables and objects on this
		// //this lets them be available to our views
		// //define basic variable
		// vm.message = "Ayo! This is message!";

		// //define list of items
		// vm.computers = [
		// 	{ name: 'Macbook Pro', color: 'Silver', nerdness: 7 },
		// 	{ name: 'Yoga 2 Pro', color: 'Gray', nerdness: 6 },
		// 	{ name: 'ChromeBook', color: 'Black', nerdness: 5 }	
		// ];

		// //object with info from form
		// vm.computerData = {};
		
		// vm.addComputer = function(){
			
		// 	//add computer
		// 	vm.computers.push({
		// 		name: vm.computerData.name,
		// 		color: vm.computerData.color,
		// 		nerdness: vm.computerData.nerdness
		// 	});

		// 	//clear object/form
		// 	vm.computerData = {};
		// };
	})
;