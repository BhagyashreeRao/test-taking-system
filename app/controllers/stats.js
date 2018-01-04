var mongoose = require( 'mongoose' );
var express= require('express');

var userModel = mongoose.model('User');
var testModel = mongoose.model('Test');
var questionModel = mongoose.model('Question');
var answerModel = mongoose.model('Answer');
var resultModel = mongoose.model('Result');

var statsRouter  = express.Router();

var responseGenerator = require('./../../libs/responseGenerator');

module.exports.controllerFunction = function(app) {
    //view all tests
    statsRouter .get('/all',function(req,res){
        resultModel.find({},function(err,results){
            if(err){                
              var myResponse = responseGenerator.generate(true,"Tests not found ! ",400,null);
              res.json(myResponse);
            }
            else{

              var myResponse = responseGenerator.generate(false,"All tests ! ",200,results);
              res.json(myResponse);
            }

        });//end test model find 

    });//end get all test



    statsRouter.get('/result/:result_id',function(req,res){
        resultModel.findOne({'_id':req.params.result_id},function(err,result){
            if(err){                
              var myResponse = responseGenerator.generate(true,"Result not found ! ",400,null);
              res.json(myResponse);
            }
            else{

              var myResponse = responseGenerator.generate(false,"Result fetched!",200,result);
              res.json(myResponse);
            }

        });//end test model find 

    });//end get all test





    statsRouter.post('/user-stats',function(req,res){
      console.log(req.body);
      console.log(req.body.user_id);
        resultModel.find({'user_id':req.body.user_id},function(err,results){
            if(err){
              console.log(err);                
              var myResponse = responseGenerator.generate(true,"Test result not found ! ",400,null);
              res.json(myResponse);
            }
            else{

              var myResponse = responseGenerator.generate(false,"All test results! ",200,results);
              res.json(myResponse);
            }

        });//end test model find 

    });//end get all test

    // this should be the last line
    // now making it global to app using a middleware
    // think of this as naming your api 
    app.use('/stats', statsRouter);
}; //end contoller code


