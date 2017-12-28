myApp.controller('singleTestCtrl',['$http', '$location', '$timeout','Test','$routeParams','$route', function($http, $location, $timeout, Test,$routeParams,$route) {
 
          var main = this;
        // Function to submit form and register account
          this.test_id=$routeParams.test_id;
          this.addQuestion=false;
          this.editQuestion=false;
          this.editTest=false;

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
                    main.editedTest=data.data.data;
                } else {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared
                    main.errorMsg = data.data.message; // Create an error message
                }
            });

            this.getEditedTest=function(){
                Test.editTest(main.test_id,main.editedTest).then(function(data){
                        if(!data.data.error){
                        $route.reload();
                    }
                });
            };
            
            this.postQuestion=function(){
                Test.createQuestion(main.test_id,main.questionData).then(function(data){
                    if(!data.data.error){
                        $route.reload();
                    }

                });
            };

            this.getEditQuestion=function(index){
                main.updatedQuestion=main.test.questions[index];
                console.log(main.updatedQuestion);
            };        

            this.postEditedQuestion=function(){
                Test.editQuestion(main.updatedQuestion._id,main.updatedQuestion).then(function(data){
                    console.log(data);
                    if(!data.data.error){
                        $route.reload();
                    }
                    else{
                        console.log(data.data.error);
                    }                    
                });
            };

            
            this.getDeleteQuestion=function(question_id){
                Test.deleteQuestion(main.test_id,question_id).then(function(data){
                        if(!data.data.error){
                        $route.reload();
                    }  
                });
            };

            this.getDeleteTest=function(){
                Test.deleteTest(main.test_id).then(function(data){
                    if(!data.data.error){
                        $location.path('/user/dashboard');
                    }
                });
            };
}]);