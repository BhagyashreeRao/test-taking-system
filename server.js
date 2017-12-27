var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var path=require('path');

var passport = require('passport');
var socialAuth=require('./app/passport/passport')(app,passport);

var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(cookieParser());

app.use(express.static('public'));

var session = require('express-session');
var logger = require('morgan');
app.use(logger('dev'));


var dbPath  = "mongodb://localhost/test-taking-systemDb";

// command to connect with database
db = mongoose.connect(dbPath);

mongoose.connection.once('open', function() {

	console.log("database connection open success");
});

var fs = require('fs');

// include all our model files
fs.readdirSync('./app/models').forEach(function(file){
	// check if the file is js or not
	if(file.indexOf('.js'))
		
		// if it is js then include the file from that folder into our express app using require
		require('./app/models/'+file);

});// end for each

// include controllers
fs.readdirSync('./app/controllers').forEach(function(file){
	if(file.indexOf('.js')){
		// include a file as a route variable
		
		var route = require('./app/controllers/'+file);
		
		//call controller function of each file and pass your app instance to it
		route.controllerFunction(app);
	}
});//end for each

app.get('/',function(req,res){
   res.sendFile('index.html',{ root: __dirname });
});

app.listen(3000, function () {
  console.log('Test taking app listening on port 3000!');
});