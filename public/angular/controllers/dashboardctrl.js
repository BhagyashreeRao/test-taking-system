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
          this.testNames=[];
          this.percentages=[];
          this.colors=[];

          var stopped;

            this.getRandomColor = function() {
                var letters = '0123456789ABCDEF';
                var color = '#';
                for (var i = 0; i < 6; i++) {
                    color += letters[Math.floor(Math.random() * 16)];
                }
                return color;
            };

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
                    main.testNames.push(main.user_results[i].test_name);
                    main.percentages.push(main.user_results[i].testPercentage);
                    main.colors[i]=main.getRandomColor();
                }
                main.avgTime=main.totalTime/main.user_results.length;
                main.avgTime=main.avgTime.toFixed(2);
                main.avgPercentage=(main.totalMarks/main.totalTestScores)*100;
                main.avgPercentage=main.avgPercentage.toFixed(2);

                main.initGraph();
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

                //Draw percentage graph
                this.drawGraph = function(){
                    if(main.testNames.length !=null && main.testNames.length == main.user_results.length && main.percentages !=null && main.percentages.length == main.user_results.length)
                    main.myChart = new Chart(main.ctx,{
                        type:'line',
                        data:{
                            labels:main.testNames,
                            datasets: [{
                                label: 'Percentage',
                                data: main.percentages,
                                pointBackgroundColor:main.colors,
                                borderColor:main.colors,
                                borderWidth: 1,
                                fontSize:20
                            }]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero:true
                                    }
                                }]
                            },
                            responsive:true,
                            maintainAspectRatio: true,
                            layout: {
                                padding: {
                                    left: 20,
                                    right: 20,
                                    top: 20,
                                    bottom: 20
                                }
                            }
                        }
                    });   
            };




            this.initGraph = function(){
                    main.ctx = document.getElementById("myChart").getContext('2d');
                    main.drawGraph();
            };

            this.takeTest = function(user_id,test_id){
            console.log("called");
            $location.path(user_id+'/take-test/'+test_id);
        };
        
}]);
