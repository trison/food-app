angular.module('userService', [])
	.factory('User', function($http){
		//create object
		var userFactory = {};

		//GET a single user
		userFactory.get = function(id) {
			return $http.get('/api/users/'+id);
		};
		//GET you!
		userFactory.me = function() {
			return $http.get('/api/me/');
		};

		//GET all users
		userFactory.all = function(){
			return $http.get('/api/users/');
		};

		//POST (create) a user
		userFactory.create = function(userData){
			return $http.post('/api/users/', userData);
		};

		//PUT (update) a user
		userFactory.update = function(id, userData){
			return $http.put('/api/users/'+id, userData);
		};

		//DELETE a user
		userFactory.delete = function(id){
			return $http.delete('/api/users/'+id);
		};

		//GET user's menu
		userFactory.getMenu = function(userId){
			return $http.get('/api/menu/'+userId)
		};
		return userFactory;
	});