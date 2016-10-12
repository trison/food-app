//name app
angular.module('foodApp', [])
	.controller('mainController', function(){
		//bind to view model
		var vm = this;

		//define variables and objects on this
		//this lets them be available to our views
		//define basic variable
		vm.message = "Hey! Check out how I look!";

		//define list of items
		vm.computers = [
			{ name: 'Macbook Pro', color: 'Silver', nerdness: 7 },
			{ name: 'Yoga 2 Pro', color: 'Gray', nerdness: 6 },
			{ name: 'ChromeBook', color: 'Black', nerdness: 5 }	
		];
});
