myApp.controller('resultCtrl',['$http', '$location','$routeParams' ,'$timeout','Test', function($http, $location,$routeParams ,$timeout, Test) {
 
        var main = this;
        main.result_id=$routeParams.result_id;

            // Initiate service to save the user into the dabase            
            Test.getResult(main.result_id).then(function(data) {

                if (!data.data.error) {
                    main.result=data.data.data;
                    console.log(main.result);
                    main.drawDoughnut();

                } else {
                    main.loading = false; // Once data is retrieved, loading icon should be cleared
                    main.errorMsg = data.data.message; // Create an error message
                }
            });
            
                //Plot doughnut graph
            this.drawDoughnut = function(){
                main.ctx = document.getElementById("myChart");
                var myDoughnutChart = new Chart(main.ctx, {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: [main.result.correctAnswers, main.result.incorrectAnswers, main.result.unattempted],
                            backgroundColor :['#f26522','#9CEBF6','#4e757b']
                        }],

                        // These labels appear in the legend and in the tooltips when hovering different arcs
                        labels: [
                            'Correct',
                            'Incorrect',
                            'Unattempted'
                        ]
                    },
                    options: {
                        cutoutPercentage : 50,
                        responsive:true
                    }
                });
};
      
}]);