myApp.controller('setPasswordCtrl',['$location', '$timeout', 'User', '$route','$routeParams', function($location, $timeout, User, $route,$routeParams) {
 
        var main = this;
        this.resetData={};
        console.log($routeParams.token);
        this.submit=false;

        User.resetUser($routeParams.token).then(function(data){
            console.log(data);
            main.resetData=data.data.data;
            console.log(main.resetData);
        });      
            
        // Initiate service to save the user into the dabase 
        this.setNewPassword = function(){ 
            console.log("reset");
            main.resetData.password=main.password;         
            User.saveNewPassword(main.resetData).then(function(data) {
                console.log(data);
                if (!data.data.error) {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared
                    main.successMsg = data.data.message + '...Redirecting'; // Create Success Message
                    //console.log(data.data.data);

                    //main.allTests=data.data.data;
                    //console.log(main.allTests);
                    main.submit=true;
                    console.log('password set');
                    $timeout(function(){
                        $location.path('/');
                        $('#modalLoginForm').modal('show');
                    },2000);
                } else {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared
                    main.errorMsg = data.data.message; // Create an error message
                    console.log('password not set');
                }

            });

        };

        
}]);
