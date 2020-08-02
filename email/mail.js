var express = require('express');
const { render } = require('ejs');

module.exports={

checkmail:function(req,res,next){
       
        res.render('mail',{msg:"No mails yet"});
},