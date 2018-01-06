var FacebookStrategy 	= require('passport-facebook').Strategy;
var GoogleStrategy 		= require('passport-google-oauth').OAuth2Strategy;

var mongoose        	= require('mongoose');

var User            	= require('../models/User');
var session         	= require('express-session');

var jwt 				= require('jsonwebtoken');
var expressJwt 			= require('express-jwt');
var secret 				= 'harrypotter';

module.exports=function(app,passport){

	var main=this;
  	app.use(passport.initialize());
  	app.use(passport.session());
  	app.use(session({
  		secret: 'keyboard cat',
  		resave: false,
  		saveUninitialized: true,
  		cookie: { secure: false }
	}));

  	passport.serializeUser(function(user, done) {
  		console.log("Serialize");
  		main.token=jwt.sign({username:user.username,email:user.email,user_id:user._id},secret,{expiresIn:'24h'});
  		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		console.log("deSerialize");
  		User.findById(id, function(err, user) {
    	done(err, user);
  		});
	});

		passport.use(new FacebookStrategy({
		    clientID: '308757226282671',
		    clientSecret: 'bdba027fe4aab20d11a446d546453acd',
		    callbackURL: "https://my-tester-100.herokuapp.com/auth/facebook/callback",
		    
		    profileFields: ['id', 'displayName','email']

		  },
		  function(accessToken, refreshToken, profile, done) 
		  {	
		  	console.log(profile);	  	
			User.findOne({'email':profile._json.email}).select('username password email ').exec(function(err,user){
				if (err) done(err);

				if(user && user!=null){
					done(null,user);
				} else{

					user = new User({
                	email : profile._json.email,
                	username : profile._json.name

            		});
					console.log(user);
		            user.save(function(err,user){
		                if(err) done(err);
		                else done(null,user);
					});	
				}
			});
			
		   }
		));

		passport.use(new GoogleStrategy({
		    clientID: '828881026786-agqjndspaphl3macd10i7m5t2nffciei.apps.googleusercontent.com',
		    clientSecret: 'Li99IqWKVJlWlogQLj7CVANz',
		    callbackURL: "https://my-tester-100.herokuapp.com/auth/google/callback"
		  },
  		function(accessToken, refreshToken, profile, done) {
  			console.log(profile);
  			User.findOne({'email':profile.emails[0].value}).select('username email _id').exec(function(err,user){
            if(err) done(err);

            if(user && user!=null){
                done(null,user);
            }
            else {

                //If user not found register
                user = new User({
                    email : profile.emails[0].value,
                    username : profile.displayName
                });

                user.save(function(err,user){
                    if(err) done(err);
                    else done(null,user);
                });
            }
           });
  		}
		));

		app.get('/auth/google',passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login','profile','email'] }));


		// GET /auth/google/callback
		//   Use passport.authenticate() as route middleware to authenticate the
		//   request.  If authentication fails, the user will be redirected back to the
		//   login page.  Otherwise, the primary route function function will be called,
		//   which, in this example, will redirect the user to the home page.
		app.get('/auth/google/callback',passport.authenticate('google', { failureRedirect: '/' }),function(req, res) {
		    res.redirect('/#/google/'+main.token);
		  });

		app.get('/auth/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/' }),function(req,res){
	
			res.redirect('/#/facebook/'+main.token);
		});

			app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

		return passport;
		};