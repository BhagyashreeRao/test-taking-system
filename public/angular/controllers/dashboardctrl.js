myApp.controller('dashboardCtrl',['$location', '$timeout', 'Test','Auth', '$route','$scope', function($location, $timeout, Test,Auth ,$route,$scope) {
 
          var main = this;
          this.allTests=[];
          this.test=[];
          this.user={};
          this.testsTaken=0;
          this.correctAnswers=0;
          this.incorrectAnswers=0;
          this.unattempted=0;
          this.totalTime=0;
          this.avgTime=0;
          this.totalMarks=0;
          this.totalTestScores=0;
          this.avgPercentage=0;

          var stopped;

          Auth.getUser().then(function(data){
            console.log(data);
            main.user.user_id=data.data.user_id;
            Test.getUserStats(main.user).then(function(stats){
                console.log(stats.data.data);
                main.user_results=stats.data.data;
                main.testsTaken=main.user_results.length;
                console.log(main.testsTaken);
                for(var i in main.user_results){
                    main.correctAnswers=main.correctAnswers+main.user_results[i].correctAnswers;
                    main.incorrectAnswers=main.incorrectAnswers+main.user_results[i].incorrectAnswers;
                    main.unattempted=main.unattempted+main.user_results[i].unattempted;
                    main.totalTime = main.totalTime+main.user_results[i].timeTaken;
                    main.totalMarks=main.totalMarks+main.user_results[i].marksScored;
                    main.totalTestScores=main.totalTestScores+main.user_results[i].testScore;
                }
                main.avgTime=main.totalTime/main.user_results.length;
                main.avgPercentage=(main.totalMarks/main.totalTestScores)*100;
                console.log(main.correctAnswers);
                console.log(main.incorrectAnswers);
                console.log(main.unattempted);
                console.log(main.avgTime);
            });
          });

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


            this.countdown = function(counter) {
            stopped = $timeout(function() {
            counter++;   
            main.countdown();   
                }, 100);
            };

            this.takeTest = function(user_id,test_id){
            console.log("called");
            $location.path(user_id+'/take-test/'+test_id);
        };
        
}]);
