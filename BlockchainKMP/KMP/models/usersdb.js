var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var users=new Schema({
    name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    email:{
       type:String,
       required:true,
       unique:true
    },
    password:{
       type:String,
       required:true
    },
    ethaddress:{
        type:String,
        required:true,
        unique:true
     },
    passport:{
        type:String,
        required:true,
        unique:true
    },
    country:{
        type:String,
        required:true
    },
    phoneno:{
        type:String,
        required:true
    },
    applications:[String],
    archiveApplications:[String]
});


module.exports=mongoose.model('users',users);

