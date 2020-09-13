var express = require('express');
var userdb=require('../models/usersdb');
module.exports={

login:(req,res,next)=>{

       var email=req.body.email;
       var password=req.body.password;
       userdb.findOne({email:email, password:password},'category password id',(err,user)=>{
            if(err) res.json({error:"Something Went Wrong"});
            if(user){
                req.session.loggedin = true;
                req.session.user =user._id;
                req.session.access=user.category;
                res.redirect('/'+user.category+'/dashboard');

            }
                
            else
                res.redirect('/loginpage');  
       });


       
  
},

register:(req,res,next)=>{
    var name=req.body.first_name+req.body.last_name;
    var ethaddress=req.body.ethaddress;
    var passport=req.body.passport;
    var country=req.body.country;
    var phone=req.body.code+req.body.phone;
    var email=req.body.email;
    var password=req.body.password;
    var category=req.body.category;
    console.log(phone);
    var user=new userdb({name:name,category:category,email:email,password:password,ethaddress:ethaddress,passport:passport,country:country,phoneno:phone});
    user.save((err,result)=>{
        if(err) res.json({error:err});
        else
        res.send("USer saved"+result);
    })

}













}