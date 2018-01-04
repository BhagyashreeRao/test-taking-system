var mongoose = require('mongoose');
// declare schema object.
var Schema = mongoose.Schema;

var resultSchema = new Schema({

	test_id           : {type:String,default:'',required:true},
	test_name         : {type:String,default:'',required:true},
	user_id		      : {type:String,default:'',required:true},
	testScore         : {type:Number,default:0},
	marksScored  	  : {type:Number},
	testPercentage    : {type:Number},
    correctAnswers    : {type:Number,default:0,required:true},
	incorrectAnswers  : {type:Number,default:0,required:true},
	unattempted       : {type:Number,default:0,required:true},
	timeTaken         : {type:Number},
    createdAt         : {type:Date,default:Date.now()}
    
});

mongoose.model('Result',resultSchema);

