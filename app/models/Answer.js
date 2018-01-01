var mongoose = require('mongoose');
// declare schema object.
var Schema = mongoose.Schema;

var answerSchema = new Schema({

    test_id            : {type:String,required:true},
    user_id            : {type:String,default:'',required:true},
    question_id        : {type:String,default:'',required:true},
	question           : {type:String,default:'',required:true},
	givenAnswer        : {type:String,default:'',required:true},
    correctAnswer      : {type:String,default:'',required:true},
	timeTaken          : {type:Number,default:'',required:true},
    createdAt          : {type:Date,default:Date.now()}

});

mongoose.model('Answer',answerSchema);

