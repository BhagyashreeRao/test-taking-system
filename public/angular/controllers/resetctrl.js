myApp.controller('resetCtrl',['$location', '$timeout', 'User', '$route', function($location, $timeout, User, $route) {
 
          var main = this;
          this.resetData = {};
            main.loading = true; // To activate spinning loading icon w/bootstrap
            main.errorMsg = false; // Clear error message each time the user presses submit
            $('.modal-backdrop').remove();
            main.submit=false;
            // Initiate service to save the user into the dabase 

        this.requestPasswordReset = function(){ 
            console.log("reset");      
            console.log(main.resetData);   
            User.getEmailForReset(main.resetData).then(function(data) {
                if (!data.data.error) {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared
                    main.successMsg = data.data.message + '...Redirecting'; // Create Success Message
                    //console.log(data.data.data);

                    //main.allTests=data.data.data;
                    //console.log(main.allTests);
                    main.submit=true;
                    
                    toastr.success('The reset link has been sent to your email! Please check your email.');
                } else {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared
                    main.errorMsg = data.data.message; // Create an error message
                    
                    toastr.error('The email is not valid');
                }

            });

        };

        
}]);
