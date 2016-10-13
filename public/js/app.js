//name app
angular.module('foodApp', ['routerRoutes', 'ngAnimate'])
	//controller for entire site
	.controller('mainController', function(){
		//bind to view model
		var vm = this;

		//define variables and objects on this
		//this lets them be available to our views
		//define basic variable
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
	//home page specific controller
	.controller('homeController', function(){
		var vm = this;
		vm.message = 'HOME PAGE!!';
	})
	//about page controller
	.controller('aboutController', function(){
		var vm = this;
		vm.message = "ABOUT PAGE!!";
	})
	//contact page controller
	.controller('contactController', function(){
		var vm = this;
		vm.message = 'CONTACT PAGE!!';
	})
;
