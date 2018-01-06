myApp.factory('User', function($http,AuthToken) {
		var userFactory = {}; // Create the User object

		// User.create(userData)
		userFactory.create = function(userData) {
			//return $http.post('/user/signup', userData); // Return data from end point to controller
				return $http.post('/user/signup', userData).then(function(data){
				AuthToken.setToken(data.data.data);
				console.log(token);
				return data;
			}); // Return data from end point to controller
		};

		userFactory.getEmailForReset = function(email){
			console.log('service called');
			console.log(email);
			return $http.put('/reset/resetPassword',email);
		};

		userFactory.resetUser = function(token){
			return $http.get('/reset/resetPassword/'+token);
		};

		userFactory.saveNewPassword = function(resetData){
			return $http.put('/reset/savePassword',resetData);
		};

		userFactory.getAllUsers = function(){
			return $http.get('/user/all');
		};		

		userFactory.getUserById = function(user_id){
			return $http.get('/user/'+user_id);
		};		


/*		testFactory.editTest = function(test_id,updatedTest){
			return $http.post('/test/edit/'+test_id,updatedTest);
		};*/
		

		return userFactory;
	});