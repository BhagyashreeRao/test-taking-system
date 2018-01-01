var express=require('express');
var app=express();
var http = require('http').Server(app);
var bodyParser=require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var path=require('path');
var port = process.env.PORT || 3000;
var cors = require('cors');


var passport = require('passport');
var socialAuth=require('./app/passport/passport')(app,passport);

var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');


app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/public')));

var session = require('express-session');

var logger = require('morgan');
app.use(logger('dev'));

app.use(cors({
    origin: '*',
    withCredentials: false,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin' ]
}));



var dbPath  = "mongodb://localhost/testerDb";

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

app.use(passport.initialize());

var apiRoutes = express.Router();

app.get('*',function(req,res,next){
   //res.sendFile('index.html',{ root: __dirname });
   res.sendFile(path.resolve(__dirname, './public/index.html'));
});

app.use(function(err,req,res,next){
    
    if(res.status==404){
        var myResponse = responseGenerator.generate(true,"Page not Found",404,null);
        res.sendFile(path.join(__dirname, '/public/views/error404.html'));
    }  
});

/*app.listen(3000, function () {
  console.log('Test taking app listening on port 3000!');
});*/

http.listen(port,function(){
    console.log("Server running on port "+port);
});