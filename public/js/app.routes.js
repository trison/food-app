//inject ngRoute for routing
angular.module('routerRoutes', ['ngRoute'])
	//configure routes
	.config(function($routeProvider, $locationProvider){
		$routeProvider
			//route for home page
			.when('/', {
				templateUrl: 'views/pages/home.html',
				controller: 'homeController',
				controllerAs: 'home'
			})
			//route for about page
			.when('/about', {
				templateUrl: 'views/pages/about.html',
				controller: 'aboutController',
				controllerAs: 'about'
			})
			//route for about page
			.when('/contact', {
				templateUrl: 'views/pages/contact.html',
				controller: 'contactController',
				controllerAs: 'contact'
			});
		//set app to have pretty URLS
		$locationProvider.html5Mode(true);
	});
