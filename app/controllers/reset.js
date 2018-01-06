var mongoose = require( 'mongoose' );
var express= require('express');

var userModel = mongoose.model('User');

var resetRouter  = express.Router();
var responseGenerator = require('./../../libs/responseGenerator');

var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var secret = 'harrypotter';

var sendMail = require('./../../libs/sendMail');


module.exports.controllerFunction = function(app) {

      resetRouter.put('/resetPassword',function(req,res){
      console.log(req.body.email);
      userModel.findOne({email:req.body.email}).select('username email resetToken name').exec(function(err,user){
        if(err)
        {
          var myResponse = responseGenerator.generate(true,"some error occured : "+err,500,null);
          res.json(myResponse);
        }
        else if(!user){
         var myResponse = responseGenerator.generate(true,"No user with that email! ",500,null);
         res.json(myResponse);
        }
        else{
          console.log('reset');

          user.resetToken = jwt.sign({email:user.email},secret,{expiresIn:'1h'});
          user.save(function(err){
            if(err){
              var myResponse = responseGenerator.generate(true,"Cannot process change password request ! ",500,null);
              res.json(myResponse);
            }
            else{
              console.log(user);
              var name = user.username;
              var text='Hi! '+name+' You recently requested to change your password.Please click on the link below to change your password - http://localhost:3000/#/reset/'+user.resetToken;
              var html='Hi! '+name+' You recently requested to change your password.Please click on the link below to change your password - <a href="http://localhost:3000/#/reset/' + user.resetToken+'">http://localhost:3000/reset/</a>';
              
              //Send email with password reset link
              sendMail.send('Localhost',user.email,'Reset Password Link',text,html);
              var myResponse = responseGenerator.generate(false,"Password reset link has been sent to your email!",200,null);
              res.json(myResponse);
            }
          });
        }
      });
    });  

    resetRouter.get('/resetPassword/:token',function(req,res){
      userModel.findOne({resetToken:req.params.token}).select('username email resetToken password').exec(function(err,user){
        if(err)
        {
          var myResponse = responseGenerator.generate(true,"Cannot find the user with that token !",500,null);
          res.json(myResponse); 
        }
        else{
          var token = req.params.token;
          jwt.verify(token,secret,function(err,decoded){
            if(err){
              var myResponse = responseGenerator.generate(true,"Password link has expired! ",500,null);
              res.json(myResponse);
            } 
            else{
              if(!user){
                var myResponse = responseGenerator.generate(true,"Password link has expired! ",500,null);
                res.json(myResponse);
              }
              else{
                var myResponse = responseGenerator.generate(false,"User found! ",200,user);
                res.json(myResponse);
              }

            }
        });
        }
      });
    });  

    resetRouter.put('/savePassword',function(req,res){
      console.log(req.body);
      userModel.findOne({email:req.body.email}).select('username email resetToken password').exec(function(err,user){
        if(err)
        {
          var myResponse = responseGenerator.generate(true,"Cannot find the user with that token !",500,null);
          res.json(myResponse); 
        }
        if(req.body.password!=null||req.body.password!=undefined||req.body.password!=''){
          user.password=req.body.password;
          user.resetToken=false;
          user.save(function(err){
            if(err){
              var myResponse = responseGenerator.generate(true,"Cannot process change password request ! ",500,null);
              res.json(myResponse);
            }
            else{
              var name = user.username;
              var text='Hi! '+name+'This is to notify you that your password has been changed successfully ';
              var html='Hi! '+name+'This is to notify you that your password has been changed successfully ';
              
              //Send email with password reset link
              sendMail.send('Localhost',user.email,'Reset Password',text,html);
              var myResponse = responseGenerator.generate(false,"Password is reset successfully!",200,user);
              res.json(myResponse);

            }
          });
        }
        else{

        }
      });
    });

    resetRouter.post('/delete/:userId',function(req,res)
    {
      userModel.remove({'_id':req.params.userId},function(err,result)
      {
        if(err){
              var myResponse = responseGenerator.generate(true,"Could not delete this user! ",400,null);
              res.json(myResponse);
        }
        else{
              var myResponse = responseGenerator.generate(false,"User removed !",200,null);
              res.json(myResponse);
        }
      });
    });

    resetRouter.post('/deleteByMail/:email',function(req,res)
    {
      userModel.remove({'email':req.params.email},function(err,result)
      {
        if(err){
              var myResponse = responseGenerator.generate(true,"Could not delete this user! ",400,null);
              res.json(myResponse);
        }
        else{
              var myResponse = responseGenerator.generate(false,"User removed !",200,null);
              res.json(myResponse);
        }
      });
    });

    resetRouter.post('/user/:user_id',function(req,res)
    {
      userModel.findOne({'_id':req.params.user_id},function(err,user)
      {
        if(err){
              var myResponse = responseGenerator.generate(true,"Could not delete this user! ",400,null);
              res.json(myResponse);
        }
        else{
              var myResponse = responseGenerator.generate(false,"User found !",200,user);
              res.json(myResponse);
        }
      });
    });


    resetRouter.post('/delete/all',function(req,res)
    {
      userModel.remove({},function(err,result)
      {
        if(err){
              var myResponse = responseGenerator.generate(true,"Could not delete this user! ",400,null);
              res.json(myResponse);
        }
        else{
              var myResponse = responseGenerator.generate(false,"User removed !",200,null);
              res.json(myResponse);
        }
      });
    });
    // this should be the last line
    // now making it global to app using a middleware
    // think of this as naming your api 
    app.use('/reset', resetRouter);
}; //end contoller code


