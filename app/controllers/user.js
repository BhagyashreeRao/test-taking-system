var mongoose = require( 'mongoose' );
var express= require('express');

var userModel = mongoose.model('User');

var userRouter  = express.Router();
var responseGenerator = require('./../../libs/responseGenerator');

var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var secret = 'harrypotter';

var sendMail = require('./../../libs/sendMail');


module.exports.controllerFunction = function(app) {

    userRouter.get('/all',function(req,res){
        userModel.find({},function(err,allUsers){
            if(err){                
                res.send(err);
            }
            else{

                res.send(allUsers);

            }

        });//end user model find 

    });//end get all users

    userRouter.get('/:user_id',function(req,res)
    {
      userModel.findOne({'_id':req.params.user_id},function(err,user)
      {
        if(err){
              var myResponse = responseGenerator.generate(true,"Could not find user! ",400,null);
              res.json(myResponse);
        }
        else{
              var myResponse = responseGenerator.generate(false,"User found !",200,user);
              res.json(myResponse);
        }
      });
    });


    userRouter.post('/signup',function(req,res){


        if(req.body.username!=undefined && req.body.mobilenumber!=undefined && req.body.email!=undefined && req.body.password!=undefined){

            var newUser = new userModel({
                
                username            : req.body.username,
                email               : req.body.email,
                mobilenumber        : req.body.mobilenumber,
                password            : req.body.password


            });// end new user 
            

            newUser.save(function(err){
                if(err){

                    var myResponse = responseGenerator.generate(true,"Username or Email already exists!",400,null);
                    //res.json({ success: false, message: 'Username or Email already exists!' }); // Cannot save if username or email exist in the database
                    res.json(myResponse);
              }
              else{

                    //var myResponse = responseGenerator.generate(false,"successfully signup user",200,newUser);
                   // res.send(myResponse);
                   

                var token=jwt.sign({username:user.username,email:user.email,user_id:user._id},secret,{expiresIn:'24h'});
                var myResponse = responseGenerator.generate(false,"User authenticated ! ",201,token);
                res.json(myResponse);
                }
            });//end new user save
       }
        else{
          
           var myResponse = responseGenerator.generate(true,"Ensure username, email, and password were provided",400,null);
              res.json(myResponse);

        }
       
    });//end sign up


    userRouter.post('/authenticate',function(req,res){

        userModel.findOne({'email':req.body.email}).select('email username mobilenumber password').exec(function(err,user){
            if(err){
                var myResponse = responseGenerator.generate(true,"some error occured : "+err,500,null);
                res.json(myResponse);
            }

            if(!user){
               var myResponse = responseGenerator.generate(true,"No user with that email! ",500,null);
               res.json(myResponse);
            }

            else if (user){
              if(req.body.password){
                var validPassword= user.comparePassword(req.body.password);
              }
              else{
                var myResponse = responseGenerator.generate(true,"No password provided ! ",500,null);
                res.json(myResponse);
              }
            }

              if(!validPassword){
                var myResponse = responseGenerator.generate(true,"Could not authenticate password ! ",500,null);
                res.json(myResponse);
              }
              else{
                var token=jwt.sign({username:user.username,email:user.email,user_id:user._id},secret,{expiresIn:'24h'});
                var myResponse = responseGenerator.generate(false,"User authenticated ! ",201,token);
                res.json(myResponse);
              }
        });// end find

    });//end get login screen


    userRouter.use(function(req,res,next){
      var token=req.body.token || req.body.query || req.headers['x-access-token'] ;

      if(token){
        jwt.verify(token,secret,function(err,decoded){
          if(err){
            var myResponse = responseGenerator.generate(true,"Token invalid ! ",500,null);
            res.json(myResponse);
          } 
          else{
          
            req.decoded=decoded;
            next();
          }
        });
      }
      else{
        var myResponse = responseGenerator.generate(true,"No token provided ! ",500,null);
         res.json(myResponse);
      }
    });

    userRouter.post('/getuser',function(req,res){

      res.send(req.decoded);
      
    });



    // this should be the last line
    // now making it global to app using a middleware
    // think of this as naming your api 
    app.use('/user', userRouter);
}; //end contoller code


