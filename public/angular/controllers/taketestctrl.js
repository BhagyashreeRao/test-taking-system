myApp.controller('takeTestCtrl',['$http', '$location', '$timeout','$scope','Test','Auth','$routeParams','$route','$filter','$window', function($http, $location, $timeout,$scope ,Test,Auth,$routeParams,$route,$filter,$window) {
 
      var main = this;
      this.test_id          = $routeParams.test_id;
      this.test             = {};
      this.user_id          = $routeParams.user_id;
      this.correctAnswers   = 0;
      this.unattempted      = 0;
      this.incorrectAnswers = 0;
      this.currentPage      = 0;
      this.pageSize         = 1;
      this.data             = [];
      this.live             = false;
      this.answerArray      = [];
      this.testScore        = 0;
      this.marksScored      = 0;
      this.percentage       = 0;
      var stopped;

        //service to get the test by ID         
        Test.getOneTest(main.test_id).then(function(data) {
            if (!data.data.error) {
                main.loading = false; // Once data is retrieved, loading icon should be cleared
                main.successMsg = data.data.message + '...Redirecting'; // Create Success Message
                
                main.test=data.data.data;
                console.log(main.test);

                $scope.count=data.data.data.duration*10*60;


                for(var i=0;i<main.test.number_of_ques;i++){

                main.answerArray.push({ test_id:main.test_id,
                                        question_id:main.test.questions[i]._id,
                                        user_id:main.user_id,
                                        question:main.test.questions[i].question_desc,
                                        correctAnswer:main.test.questions[i].answer
                                    });

                main.testScore = main.test.number_of_ques*main.test.marks_per_question ;

                }
                console.log(main.answerArray);

            } 
            else 
            {
                main.loading = false; // Once data is retrieved, loading icon should be cleared
                main.errorMsg = data.data.message; // Create an error message
            }

            console.log(main.answerArray);

        });


            this.startTest=function(user_id){
                main.live=true;
                $location.path(user_id+'/take-test/'+main.test_id);
                $scope.countdown();
            };


            $scope.countdown = function() {
                stopped = $timeout(function() {
                   console.log($scope.count);
                 $scope.count--;   
                 //$scope.countdown();   
                }, 1000);
              };

            main.submitTest=function(){
            for(var i=0;i<main.test.number_of_ques;i++){

                

                if(main.answerArray[i].givenAnswer==null||main.answerArray[i].givenAnswer==undefined||main.answerArray[i].givenAnswer=='')
                {
                    main.unattempted++;
                }
                else if(main.answerArray[i].givenAnswer==main.answerArray[i].correctAnswer)
                {
                    main.correctAnswers++;
                }
                else if(main.answerArray[i].givenAnswer!=main.answerArray[i].correctAnswer)
                {
                    main.incorrectAnswers++;
                }

               
            }

            console.log(main.answerArray);

            main.marksScored=main.correctAnswers * main.test.marks_per_question ;
            main.percentage = ((main.marksScored/main.testScore)*100).toFixed(2);

            console.log(main.unattempted);
            console.log(main.correctAnswers);
            console.log(main.incorrectAnswers);
            console.log(main.marksScored); 
            console.log(main.percentage); 
        };

}]);

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
myApp.filter('startFrom', function() {
    return function(input, start) {
        
        start = +start; //parse to int
        return input.slice(start);
    };
});




