var mongoose = require( 'mongoose' );
var express= require('express');

var userModel = mongoose.model('User');
var testModel = mongoose.model('Test');
var questionModel = mongoose.model('Question');

var testRouter  = express.Router();

var responseGenerator = require('./../../libs/responseGenerator');

module.exports.controllerFunction = function(app) {
    //view all tests
    testRouter.get('/all',function(req,res){
        testModel.find({},function(err,tests){
            if(err){                
              var myResponse = responseGenerator.generate(true,"Tests not found ! ",400,null);
              res.json(myResponse);
            }
            else{

              var myResponse = responseGenerator.generate(false,"All tests ! ",200,tests);
              res.json(myResponse);

            }

        });//end test model find 

    });//end get all test

    //create a new test
    testRouter.post('/create',function(req,res){


        if(req.body.topic!=undefined && req.body.category!=undefined && req.body.duration!=undefined){

            var newTest = new testModel({
                
                topic               : req.body.topic,
                category            : req.body.category,
                duration            : req.body.duration


            });// end new user 
            

            newTest.save(function(err,test){
                if(err){

                    var myResponse = responseGenerator.generate(true,"Can't save this test!",400,null);
                    //res.json({ success: false, message: 'Username or Email already exists!' }); // Cannot save if username or email exist in the database
                    res.json(myResponse);
              }
              else{
                var myResponse = responseGenerator.generate(false,"test created successfully ! ",201,test);
                res.json(myResponse);
                }
            });//end new test save
       }
        else{
          
           var myResponse = responseGenerator.generate(true,"Ensure all fields are provided properly ! ",400,null);
              res.json(myResponse);

        }
       
    });//end test creation

    //Create questions for a test
    testRouter.post('/:test_id/question/create',function(req,res){


        if(req.body.question_desc!=undefined && req.body.optA!=undefined && req.body.optB!=undefined && req.body.optC!=undefined && req.body.optD!=undefined && req.body.answer!=undefined){

            var newQuestion = new questionModel({
                
                question_desc       : req.body.question_desc,
                optA                : req.body.optA,
                optB                : req.body.optB,
                optC                : req.body.optC,
                optD                : req.body.optD,
                answer              : req.body.answer,
                test_id             : req.params.test_id



            });// end new user 
            
            //add question to question model
            newQuestion.save(function(err,question){
                if(err){

                    var myResponse = responseGenerator.generate(true,"Can't save this Question!",400,null);
                    //res.json({ success: false, message: 'Username or Email already exists!' }); // Cannot save if username or email exist in the database
                    res.json(myResponse);
                 }
                else{
                  //update the respective test model with new question
                  testModel.findOneAndUpdate({'_id':req.params.test_id},{$inc:{'number_of_ques':1},$push: { "questions": question } },function(err,test){
                    if(err){
                        var myResponse = responseGenerator.generate(true,"test not found",400,null);
                        res.json(myResponse);
                    }
                    else{
                      var myResponse = responseGenerator.generate(false,"question created successfully ! ",201,test);
                      res.json(myResponse);
                        }
                      });

                      }
                    });//end new test save
              }
        else{
          
           var myResponse = responseGenerator.generate(true,"Ensure all fields are provided properly ! ",400,null);
              res.json(myResponse);

        }
       
    });//end test creation


    //get details of single test
    testRouter.get('/:test_id',function(req,res){
        testModel.findOne({'_id':req.params.test_id},function(err,test){
            if(err){                
              var myResponse = responseGenerator.generate(true,"Test not found ! ",400,null);
              res.json(myResponse);
            }
            else{

              var myResponse = responseGenerator.generate(false,"test found ! ",200,test);
              res.json(myResponse);

            }

        });//end test model find 

    });//end get all test


    //update details of a test
    testRouter.post('/edit/:testId',function(req,res)
    {
      var update=req.body;

    testModel.findOneAndUpdate({'_id':req.params.testId},update,{new:true},function(err,test)
      {
        if(err){
              var myResponse = responseGenerator.generate(true,"Could not update test! ",400,null);
              res.json(myResponse);

        }
        else{
              var myResponse = responseGenerator.generate(false,"test updated ! ",200,test);
              res.json(myResponse);
        }

      }); 

    });


    //edit a question
    testRouter.post('/question/edit/:questionId',function(req,res)
      {
        var question_update=req.body;

      questionModel.findOneAndUpdate({'_id':req.params.questionId},question_update,{new: true},function(err,question)
        {
        if(err){
                var myResponse = responseGenerator.generate(true,"Could not update test! ",400,null);
                res.json(myResponse);
          }

        else{

                      console.log(question_update);
                      console.log(question);
                      //console.log(req.params.questionId);
                       testModel.findOneAndUpdate(
                         {'_id': question.test_id,
                           'questions' : { $elemMatch: { '_id':question._id}}
                         },
                         { $set: { 'questions.$' : question } },{new: true },function(error,result){
                           if(error)
                           {
                                var myResponse = responseGenerator.generate(true,"Could not update test with question! ",400,null);
                                res.json(myResponse);
                           }
                           else{
                                console.log(req.params.questionId);
                                var myResponse = responseGenerator.generate(false,"Test updated !",200,result);
                                res.json(myResponse);
                               
                           }
                         });
            }
      }); 
    });
/*              testModel.findOne({'_id':question.test_id},function(err,test){
                if(err){
                  var myResponse = responseGenerator.generate(true,"Could not find test! ",400,null);
                  res.json(myResponse);                  
                }
                else{
                  var index = -1;
                  console.log(test);
                  for(var i in test.questions)
                  {
                    if(test.questions[i]._id==req.params.questionId){
                      index = i;
                        
                      
                    }
                  }
                  console.log(index);                
                }
            });

              var myResponse = responseGenerator.generate(false,"test updated ! ",200,question);
              res.json(myResponse);*/


    // delete a question from test
    testRouter.post('/question/delete/:questionId',function(req,res)
    {
      questionModel.findOne({'_id':req.params.questionId},function(err,question)
      {
        if(err){
              var myResponse = responseGenerator.generate(true,"Could not delete question! ",400,null);
              res.json(myResponse);
        }
        else{
            console.log(question);
            testModel.findOneAndUpdate({'_id':question.test_id}, { $pull: { questions: { $elemMatch: { '_id':req.params.questionId}} } },{new:true},function(error,test)
              { 
                if(err){
                      var myResponse = responseGenerator.generate(true,"Could not delete test with question!",400,null);
                      res.json(myResponse);
                }
                else{
                      console.log(test);
                      var myResponse = responseGenerator.generate(false,"Test updated!",200,test);
                      res.json(myResponse);

                }
              });

        }

      });
      
    });

    //delete a test
    testRouter.post('/delete/:testId',function(req,res)
    {
      testModel.remove({'_id':req.params.testId},function(err,result)
      {
        if(err){
              var myResponse = responseGenerator.generate(true,"Could not delete this test! ",400,null);
              res.json(myResponse);
        }
        else{
              var myResponse = responseGenerator.generate(false,"Test deleted !",200,null);
              res.json(myResponse);
        }
      });
    });

    // this should be the last line
    // now making it global to app using a middleware
    // think of this as naming your api 
    app.use('/test', testRouter);
}; //end contoller code


