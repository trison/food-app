angular.module('authService', [])
	// auth factory to login and get info
	// inject $http for communicating with API
	// inject $q to return promise objects
	// inject AuthToken to manage tokens
	.factory('Auth', function($http, $q, AuthToken){
		//create auth factory object
		var authFactory = {};

		//handle login
		authFactory.login = function(username, password){
			//return promise object and data
			return $http.post('/api/authenticate', {
				username: username,
				password: password
			})
			.success(function(data){
				AuthToken.setToken(data.token);
				return data;
			});
		};

		//handle logout
		authFactory.logout = function(){
			//clear token
			AuthToken.setToken();
		};

		//check if user is logged in
		authFactory.isLoggedIn = function(){
			if (AuthToken.getToken())
				return true;
			else
				return false;
		};

		//get user info
		authFactory.getUser = function(){
			if (AuthToken.getToken())
				return $http.get('/api/me', { cache: true });//check if in cache
			else
				return $q.reject({ message: 'User has no token.'});
		};

		return authFactory;
	})

	// factory for handling tokens
	// inject $window to store token client-side
	.factory('AuthToken', function($window){
		var authTokenFactory = {};

		//get token from local storage
		authTokenFactory.getToken = function(){
			return $window.localStorage.getItem('token');
		};

		//set or clear token
		authTokenFactory.setToken = function(token){
			if(token)
				$window.localStorage.setItem('token', token);
			else
				$window.localStorage.removeItem('token');
		};
		return authTokenFactory;
	})

	// app config to integrate token into request
	.factory('AuthInterceptor', function($q, $location, AuthToken){
		var interceptorFactory = {};

		//this will happen on all HTTP requests
		interceptorFactory.request = function(config){
			//grab token
			var token = AuthToken.getToken();

			//add token to every request
			//if token exists, add it to header as x-access token
			if (token)
				config.headers['x-access-token'] = token;
			return config;
		};

		//redirect of token doesn't authenticate
		//happens on response errors
		interceptorFactory.responseError = function(response){
			//if server returns 403 forbidden
			if (response.status == 403) {
				AuthToken.setToken();
				$location.path('/login');
			}

			//return errors from server as promise
			return $q.reject(response);
		};

		return interceptorFactory;
	});