myApp.controller('facebookCtrl',['$routeParams','$location','Auth','$window', function($routeParams,$location,Auth,$window) {
 //$route.reload();
var app = this;

if($window.location.pathname == '/facebookerror'){
	app.errorMsg = 'Facebook e-mail not found in database.';
	$location.path('/');
	$('#modalLoginForm').modal('show');
}
else{
	console.log($routeParams.token);
	Auth.facebook($routeParams.token);
	$location.path('/user/dashboard');
}
}]);

myApp.controller('googleCtrl',['$routeParams','$location','Auth','$window', function($routeParams,$location,Auth,$window) {
 //$route.reload();
var app = this;

if($window.location.pathname == '/googleerror'){
	app.errorMsg = 'Google e-mail not found in database.';
	$location.path('/');
	$('#modalLoginForm').modal('show');
}
else{
	Auth.google($routeParams.token);
	$location.path('/user/dashboard');
}
}]);