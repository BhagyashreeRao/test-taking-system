myApp.factory('User', function($http,AuthToken) {
		var userFactory = {}; // Create the User object

		// User.create(userData)
		userFactory.create = function(userData) {
			//return $http.post('/user/signup', userData); // Return data from end point to controller
				return $http.post('/user/signup', userData).then(function(data){
				AuthToken.setToken(data.data.data);
				return data;
			}); // Return data from end point to controller
		};

		return userFactory;
	});