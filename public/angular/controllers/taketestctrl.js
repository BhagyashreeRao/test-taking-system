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
      this.resultData       = {};
      this.started = false;
      var stopped;

        //service to get the test by ID         
        Test.getOneTest(main.test_id).then(function(data) {
            if (!data.data.error) {
                main.loading = false; // Once data is retrieved, loading icon should be cleared
                main.successMsg = data.data.message + '...Redirecting'; // Create Success Message
                
                main.test=data.data.data;
                console.log(main.test);

                main.count=data.data.data.duration*10*60;
                main.previousTime = main.count;
                main.timeTakenAnswers = new Array(data.data.data.questions.length);
                main.timeViewFirstAnswers = new Array(data.data.data.questions.length);

                for(var i=0;i<main.test.number_of_ques;i++){

                main.answerArray.push({ test_id:main.test_id,
                                        question_id:main.test.questions[i]._id,
                                        user_id:main.user_id,
                                        question:main.test.questions[i].question_desc,
                                        correctAnswer:main.test.questions[i].answer
                                    });
                main.timeTakenAnswers[i]=0;
                main.timeViewFirstAnswers[i]=0;
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


        //Calculate time for answer
        this.calTime = function(index,question){

            console.log(index,question);
            main.timeTakenAnswers[index]=main.timeTakenAnswers[index] + main.previousTime - main.count;
            //console.log(main.previousTime);
            //console.log(main.count);
            
        };

        //Save time at which user opened the question
        this.setFirstViewTime = function(index){
            console.log(index);
            main.timeViewFirstAnswers[index]=main.test.duration*10*60 - main.count;            
        };  



            this.startTest=function(user_id){
                $scope.live=true;
                main.started = true;
                main.playing=true;
                main.countdown();
            };


            main.submitTest=function(){
              console.log("answer times");
              console.log(main.timeTakenAnswers);
              console.log(main.timeViewFirstAnswers);
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

                main.answerArray[i].timeTaken = (main.timeTakenAnswers[i] - main.timeViewFirstAnswers[i])/10;

                console.log(main.answerArray[i].timeTaken);
               // Test.postAnswer(main.answerArray[i].test_id,main.answerArray[i].question_id);

                Test.postAnswer(main.answerArray[i].test_id,main.answerArray[i].question_id,main.answerArray[i]).then(function(data)
                {
                    if(data.data.error){
                        main.answerErrorMessage = data.data.message;
                        console.log(data.data.message);
                    } else{
                        main.answerSuccessMessage = data.data.message;
                        console.log(data.data.message);
                    }

                }); 
            }

                main.testTime = (main.test.duration*10*60 - main.count)/600;
                main.testTime = +main.testTime.toFixed(2);
           
                console.log(main.testTime);

            console.log(main.answerArray);


            main.marksScored=main.correctAnswers * main.test.marks_per_question ;
            main.percentage = ((main.marksScored/main.testScore)*100).toFixed(2);

            console.log(main.unattempted);
            console.log(main.correctAnswers);
            console.log(main.incorrectAnswers);
            console.log(main.marksScored); 
            console.log(main.percentage);
            console.log(main.testTime); 

            main.resultData.test_id = main.test_id;
            main.resultData.test_name=main.test.topic;
            main.resultData.user_id=main.user_id;
            main.resultData.testScore=main.testScore;
            main.resultData.marksScored=main.marksScored;
            main.resultData.testPercentage=main.percentage;
            main.resultData.correctAnswers=main.correctAnswers;
            main.resultData.incorrectAnswers=main.incorrectAnswers;
            main.resultData.unattempted=main.unattempted;
            main.resultData.timeTaken=main.testTime;

            console.log(main.resultData);

            Test.postResult(main.test_id,main.resultData).then(function(data){
                    if(data.data.error){
                        main.resultErrorMessage = data.data.message;
                        console.log(data.data.message);
                    } else{
                        main.resultId=data.data.data._id;
                        console.log(main.resultId);
                        main.resultSuccessMessage = data.data.message;
                        console.log(data.data.message);
                        $location.path('/show-result/'+main.resultId);
                    }
            });

        };

        this.LeadingZero = function(Time) {
        return (Time < 10) ? "0" + Time : + Time;
    };

    //Convert time to mins hours seconds
    this.displayTime = function(count) {
  
        var tenths = count;  
        var sec = Math.floor(tenths / 10);
        var hours = Math.floor(sec / 3600);
        sec -= hours * (3600);
        var mins = Math.floor(sec / 60);
        sec -= mins * (60);

        if (hours < 1) {
            $('#time_left').html(main.LeadingZero(mins)+':'+main.LeadingZero(sec));  
        }
        else {
            $('#time_left').html(hours+':'+main.LeadingZero(mins)+':'+main.LeadingZero(sec));
        }
    };


    //Count down function
    this.countdown = function(){

        //Call display time
        main.displayTime(main.count); 
        //console.log(main.count);
        if (main.count == 0) {
            main.playing = false;

            //Submit answers if time limit reached
            main.submitTest();
            $scope.$apply(function(){
                main.testFinished=true;
            });
        }   else if (main.playing) {
                setTimeout(main.countdown, 100);
                main.count--;
        }   else {
                setTimeout(main.countdown, 100); 
        }
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





