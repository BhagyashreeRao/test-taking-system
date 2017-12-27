var myApp = angular.module('querizeApp',['ngRoute'])
    .config(function ($httpProvider) {
  	$httpProvider.interceptors.push('AuthInterceptors');
});