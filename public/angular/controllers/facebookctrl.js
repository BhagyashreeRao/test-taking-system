myApp.controller('facebookCtrl',['$routeParams','$location','Auth', function($routeParams,$location,Auth) {
 //$route.reload();
 console.log($routeParams.token);
 Auth.facebook($routeParams.token);
 $location.path('/');
}]);