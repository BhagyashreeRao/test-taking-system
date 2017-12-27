myApp.controller('testCtrl',['$http', '$location', '$timeout','Test', function($http, $location, $timeout, Test) {
 
          var main = this;
        // Function to submit form and register account
        this.postTest = function(testData) {
          
            main.loading = true; // To activate spinning loading icon w/bootstrap
            main.errorMsg = false; // Clear error message each time the user presses submit

            // Initiate service to save the user into the dabase            
            Test.createTest(main.testData).then(function(data) {

                if (!data.data.error) {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared
                    main.successMsg = data.data.message + '...Redirecting'; // Create Success Message
                    // Redirect to home page after 2000 miliseconds
                    $timeout(function() {
                        //$('.modal-backdrop').remove();
                        console.log(data.data.data);
                        $location.path('/test/'+data.data.data._id);
                        //$route.reload();
                    }, 2000);
                } else {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared
                    main.errorMsg = data.data.message; // Create an error message
                }
            });
        };
}]);