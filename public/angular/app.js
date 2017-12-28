var myApp = angular.module('testingApp',['ngRoute'])
    .config(function ($httpProvider) {
  	$httpProvider.interceptors.push('AuthInterceptors');
});