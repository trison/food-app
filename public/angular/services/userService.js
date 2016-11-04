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

		//Get all the menus
		userFactory.menus = function(){
			return $http.get('api/menu/');
		};

		//GET user's menu
		userFactory.getUserMenu = function(userId){
			return $http.get('/api/menu/'+userId)
		};

		//GET particular menu
		userFactory.getMenu = function(menuId){
			return $http.get('/api/menu/'+menuId)
		};

		//PUT (update) a menu item
		userFactory.updateMenu = function(menuId, menuData){
			return $http.put('/api/menu/'+menuId, menuData)
		};

		//POST (create) a menu item
		userFactory.create = function(menuData){
			return $http.post('/api/menu/', menuData);
		};

		//DELETE a menu item
		userFactory.deleteMenu = function(menuId){
			return $http.delete('/api/menu/'+menuId);
		};

		return userFactory;
	});