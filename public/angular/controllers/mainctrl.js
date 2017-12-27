
myApp.controller('mainCtrl',['$http', '$location', '$timeout', 'User', '$route','$scope', function($http, $location, $timeout, User, $route,$scope) {
 
          var main = this;
        

        // Function to submit form and register account
        this.signupUser = function(userData) {
          
            main.loading = true; // To activate spinning loading icon w/bootstrap
            main.errorMsg = false; // Clear error message each time the user presses submit
            
            // Initiate service to save the user into the dabase            
            User.create(main.userData).then(function(data) {
              
                if (!data.data.error) {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared
                    main.successMsg = data.data.message + '...Redirecting'; // Create Success Message
                    // Redirect to home page after 2000 miliseconds
                    $timeout(function() {
                        $('.modal-backdrop').remove();
                        main.successMsg = false;
                        main.hideModal();
                        $location.path('/user/dashboard');
                        //$route.reload();
                    }, 2000);
                } else {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared
                    main.errorMsg = data.data.message; // Create an error message
                     main.reset($scope.signupForm,"signupForm");
                }
            });
        };

            this.hideModal = function(){

            console.log($scope);
            main.reset($scope.signupForm,"signupForm");

            };
            //function to reset modal form
            this.reset=function(form,name){
            document.getElementById(name).reset();
            form.$setPristine();
            //main.userData={};
            form.$setUntouched();
            form.$submitted = false;
        };

}]);