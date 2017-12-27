myApp.controller('dashboardCtrl',['$location', '$timeout', 'Test', '$route', function($location, $timeout, Test, $route) {
 
          var main = this;
          this.allTests=[];
          this.test=[];
        
          
            main.loading = true; // To activate spinning loading icon w/bootstrap
            main.errorMsg = false; // Clear error message each time the user presses submit
            
            // Initiate service to save the user into the dabase            
            Test.getAllTests().then(function(data) {
              
                if (!data.data.error) {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared
                    main.successMsg = data.data.message + '...Redirecting'; // Create Success Message
                    //console.log(data.data.data);

                    main.allTests=data.data.data;
                    console.log(main.allTests);
                } else {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared
                    main.errorMsg = data.data.message; // Create an error message
                }

            });
        
}]);
