//inject ngRoute for routing
angular.module('app.routes', ['ngRoute'])
	//configure routes
	.config(function($routeProvider, $locationProvider){
		$routeProvider
			.when('/', {
				templateUrl: 'angular/views/pages/login.html',
				controller: 'mainController',
				controllerAs: 'login'
			})
			.when('/home', {
				templateUrl: 'angular/views/pages/home.html',
				controller: 'homeController',
				controllerAs: 'home'
			})
			.when('/login', {
				templateUrl: 'angular/views/pages/login.html',
				controller: 'mainController',
				controllerAs: 'login'
			})
			.when('/register', {
				templateUrl: 'angular/views/pages/register.html',
				controller: 'userCreateController',
				controllerAs: 'user'
			})
			.when('/about', {
				templateUrl: 'angular/views/pages/about.html',
				controller: 'aboutController',
				controllerAs: 'about'
			})
			.when('/contact', {
				templateUrl: 'angular/views/pages/contact.html',
				controller: 'contactController',
				controllerAs: 'contact'
			})
			.when('/users', {
			  templateUrl: 'angular/views/pages/users/all.html',
			  controller: 'userController',
			  controllerAs: 'user'
			})
			.when('/users/create', {
			  templateUrl: 'angular/views/pages/users/single.html',
			  controller: 'userCreateController',
			  controllerAs: 'user'
			})
			.when('/users/:user_id', {
			  templateUrl: 'angular/views/pages/users/single.html',
			  controller: 'userEditController',
			  controllerAs: 'user'
			})
			.when('/profile', {
			  templateUrl: 'angular/views/pages/users/profile.html',
			  controller: 'profileController',
			  controllerAs: 'profile'
			})
			;
		//set app to have pretty URLS
		$locationProvider.html5Mode(true);
	});
