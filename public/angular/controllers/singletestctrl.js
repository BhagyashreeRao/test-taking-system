myApp.controller('singleTestCtrl',['$http', '$location', '$timeout','Test','$routeParams','$route', function($http, $location, $timeout, Test,$routeParams,$route) {
 
          var main = this;
        // Function to submit form and register account
          this.test_id=$routeParams.test_id;
          this.addQuestion=false;
          this.editQuestion=false;


          console.log(main.test_id);  
          
            main.loading = true; // To activate spinning loading icon w/bootstrap
            main.errorMsg = false; // Clear error message each time the user presses submit

            // Initiate service to save the user into the dabase            
            Test.getOneTest(main.test_id).then(function(data) {

                if (!data.data.error) {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared
                    main.successMsg = data.data.message + '...Redirecting'; // Create Success Message
                    // Redirect to home page after 2000 miliseconds
                    main.test=data.data.data;
                    main.updatedData=data.data.data;

                } else {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared
                    main.errorMsg = data.data.message; // Create an error message
                }
            });
            
            this.postQuestion=function(test_id,questionData){
                Test.createQuestion(main.test_id,main.questionData).then(function(data){
                    if(!data.data.error){
                        $route.reload();
                    }

                });
            };        
}]);