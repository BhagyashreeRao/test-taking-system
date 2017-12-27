var mongoose = require('mongoose');
// declare schema object.
var Schema = mongoose.Schema;

var questionSchema = new Schema({
  test_id        :  {type: String},			
  question_desc  : 	{type: String},
  optA    	     : 	{type: String},
  optB           :  {type: String},
  optC           :  {type: String},
  optD           :  {type: String},
  answer         :  {type: String},
  created_on     :  {type:Date,default:Date.now},
  last_updated_on:  {type:Date,default:Date.now}
});

mongoose.model('Question',questionSchema);

