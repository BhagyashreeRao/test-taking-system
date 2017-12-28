myApp.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider){
    $routeProvider
        .when('/',{
            // location of the template
        	templateUrl		: './views/index-view.html',
        	// Which controller it should use 
            controller 		: 'mainCtrl',
            // what is the alias of that controller.
        	controllerAs 	: 'main',

            authenticated   :  false
        })

        .when('/user/dashboard',{
            templateUrl     : './views/dashboard-view.html',

            controller      :  'dashboardCtrl',

            controllerAs    :  'dashboard',

            authenticated   :   true

        })
        .when('/test/create',{
            templateUrl     : './views/create-test-view.html',

            controller      :  'testCtrl',

            controllerAs    :  'test',

            authenticated   :   true

        })
        .when('/test/:test_id',{
            templateUrl     : './views/single-test-view.html',

            controller      :  'singleTestCtrl',

            controllerAs    :  'singleTest',

            authenticated   :   true

        })        

        .when('/logout',{
            templateUrl     : './views/logout-view.html',

            authenticated   :   false

        })

        .when('/facebook/:token',{
            templateUrl     : './views/facebook-view.html',
            controller      :  'facebookCtrl',
            controllerAs    :  'facebook',
            //authenticated   :  true

        })

        .otherwise({
            //redirectTo:'/'
            template   : '<h2>404 page not found</h2>'

        });

        $locationProvider.html5Mode({
            enabled:true,
            requireBase: false
        }).hashPrefix();

}]);



//Avoid unauthorized access to routes
myApp.run(['$rootScope','Auth','$location',function($rootScope,Auth,$location){
    $rootScope.$on('$routeChangeStart',function(event,next,current){

        if(next.hasOwnProperty('$$route')){
            //If logged In
            if(next.$$route.authenticated==true){

                if(Auth.isLoggedIn()){
                    //Call authService to get User
                    Auth.getUser().then(function(data){
                        //If error
                        if(data.data.error){
                            event.preventDefault();
                            $location.path('/');
                        }          
                    });
                }
                else
                {
                    event.preventDefault();
                    $location.path('/');
                }
                
            }
            //If not logged in
            if(next.$$route.authenticated==false){

                if(Auth.isLoggedIn()){
                    //Call authService to get User
                    Auth.getUser().then(function(data){

                        //If error
                        if(!data.data.error){
                            event.preventDefault();
                            $location.path('/user/dashboard');
                        }          
                    });
                }
                
            }
        }

    });
}]);
