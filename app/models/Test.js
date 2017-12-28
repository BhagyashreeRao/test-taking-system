var mongoose = require('mongoose');
// declare schema object.
var Schema = mongoose.Schema;

var testSchema = new Schema({
  topic          : 	{type: String},
  category    	 : 	{type: String},
  questions      :  [],
  duration       :  {type: Number},
  number_of_ques :  {type: Number , default:0},
  marks_per_question : {type: Number , default:0},
  created_on     :  {type:Date,default:Date.now},
  last_updated_on:  {type:Date,default:Date.now}
});

mongoose.model('Test',testSchema);

