myApp.factory('Auth', function($http,AuthToken) {
		var authFactory = {}; // Create the User object

		// User.create(userData)
		authFactory.login = function(loginData) {
			return $http.post('/user/authenticate', loginData).then(function(data){
				AuthToken.setToken(data.data.data);
				return data;
			}); // Return data from end point to controller
		};

		authFactory.isLoggedIn=function(){
			if(AuthToken.getToken()){
				return true;
			}
			else
			{
				return false;
			}
		};

		authFactory.facebook= function(token){
			AuthToken.setToken(token);
		};

		authFactory.getUser=function(){
			if(AuthToken.getToken()){
				return $http.post("/user/getuser");
			}
			else{
				$q.reject({message:"user has no token"});
			}
		};

		authFactory.logout=function(){
			AuthToken.setToken();
		};
		return authFactory;
		
	});



myApp.factory('AuthToken', function($window) {
		var authTokenFactory = {}; // Create the User object

		// User.create(userData)
		authTokenFactory.setToken = function(token) {
		if(token){
			$window.localStorage.setItem('token',token); // Return data from end point to controller
		}
		else{
			$window.localStorage.removeItem('token');
		}
		};


		authTokenFactory.getToken=function(){
			return $window.localStorage.getItem('token');
		};

		return authTokenFactory;
	});

myApp.factory("AuthInterceptors",function(AuthToken){
	var authInterceptorsFactory={};
	authInterceptorsFactory.request=function(config){
		var token=AuthToken.getToken();
		
		if(token){
			config.headers['x-access-token']=token;
		}
		return config;
	};
	return authInterceptorsFactory;
});