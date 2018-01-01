var mongoose = require('mongoose');
// declare schema object.
var Schema = mongoose.Schema;

var bcrypt=require('bcrypt-nodejs');

var userSchema = new Schema({
  username     : 	{type: String , unique:true},
  email        : 	{type: String ,unique:true},
  mobilenumber :  {type: Number}, 
  password     : 	String,
  created_at   :  {type:Date,default:Date.now}
});

userSchema.pre('save', function(next) {
    var user = this;
    bcrypt.hash(user.password,null,null,function(err,hash){
        if(err) return next(err);
        user.password=hash;
        next();
    });
});

userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password,this.password);
    
};

mongoose.model('User',userSchema);

module.exports=mongoose.model('User');