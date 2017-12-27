FacebookStrategy 	= require('passport-facebook').Strategy;

var mongoose        = require('mongoose');

var User            = require('../models/User');
var session         = require('express-session');

var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var secret = 'harrypotter';

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
  		main.token=jwt.sign({username:user.username,email:user.email},secret,{expiresIn:'24h'});
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
		    callbackURL: "http://localhost:3000/auth/facebook/callback",
		    profileFields: ['id', 'displayName','email']

		  },
		  function(accessToken, refreshToken, profile, done) 
		  {	
		  	console.log(profile);	  	
			User.findOne({'email':profile._json.email}).select('username password email').exec(function(err,user){
				if (err) done(err);

				if(user && user!=null){
					done(null,user);
				} else{
					done(err);
				}
			});
			
		   }
		));

		app.get('/auth/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/' }),function(req,res){
	
			res.redirect('/facebook/'+main.token);
		});

			app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

		return passport;
		};