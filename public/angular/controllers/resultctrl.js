myApp.controller('resultCtrl',['$http', '$location','$routeParams' ,'$timeout','Test', function($http, $location,$routeParams ,$timeout, Test) {
 
        var main = this;
        main.result_id=$routeParams.result_id;

            // Initiate service to save the user into the dabase            
            Test.getResult(main.result_id).then(function(data) {

                if (!data.data.error) {
                    main.result=data.data.data;
                    console.log(main.result);

                } else {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared
                    main.errorMsg = data.data.message; // Create an error message
                }
            });
      
}]);