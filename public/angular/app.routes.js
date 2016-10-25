//inject ngRoute for routing
angular.module('app.routes', ['ngRoute'])
	//configure routes
	.config(function($routeProvider, $locationProvider){
		$routeProvider
			//route for home page
			.when('/', {
				templateUrl: 'angular/views/pages/home.html',
				controller: 'homeController',
				controllerAs: 'home'
			})
			//route for login page
			.when('/login', {
				templateUrl: 'angular/views/pages/login.html',
				controller: 'mainController',
				controllerAs: 'login'
			})
			//route for about page
			.when('/about', {
				templateUrl: 'angular/views/pages/about.html',
				controller: 'aboutController',
				controllerAs: 'about'
			})
			//route for about page
			.when('/contact', {
				templateUrl: 'angular/views/pages/contact.html',
				controller: 'contactController',
				controllerAs: 'contact'
			});
		//set app to have pretty URLS
		$locationProvider.html5Mode(true);
	});
