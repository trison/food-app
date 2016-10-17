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

		//hangle logout

		//check if user is logged in

		//get user info

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
		authFactory.setToken = function(token){
			if(token)
				$window.localStorage.setItem('token', token);
			else
				$window.localStorage.removeItem('token');
		};

		return authTokenFactory;

	})

	// app config to integrate token into request
	.factory('AuthInterceptor', function($q, authToken){
		var interceptorFactory = {};

		//attach token to every request

		//redirect of token doesn't authenticate

		return interceptorFactory;
	});