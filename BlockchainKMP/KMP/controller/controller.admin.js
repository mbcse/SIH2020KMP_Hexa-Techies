var express = require('express');
var applicationsDB=require('../models/application');
var userdb=require('../models/usersdb');
const { render } = require('ejs');
const { use } = require('../routes/route.admin');

function newLicense(){
       let randomNum = Math.random() * ((new Date()/1000) - 1) + 1;
       return "AAI-LICENSE-"+Math.floor(randomNum+(new Date()/1000));
}

module.exports={

checkClientLoggedIn:function(req,res,next){
       if(req.session.loggedin)
              next();
       else
              res.render('login',{msg:"Please Login In First"});
},

adminDashboard:function(req,res,next){
       userdb.findById(req.session.user,(err,user)=>{
              var obj={userApplications:user.applications, id:req.session.user, email:user.email, name:user.name};
              if(req.session.access=="doas")
              res.render('doas_dashboard',obj);  
              else if(req.session.access=="ai")    
              res.render('ai_dashboard',obj);  
              else
              res.render('dg_dashboard',obj);        
       });
       

},


getApplicationDetails:function(req,res,next){

       var applicationId=req.params.aid;
       console.log(applicationId);
       applicationsDB.findById(applicationId,(err,data)=>{
              res.json(data);  
       });
},

applicationDetails:function(req,res){
       var applicationId=req.params.id;
       console.log("working"+req.session.name);
       applicationsDB.findById(applicationId,(err,data)=>{
       if(req.session.access=="doas")
       res.render('application_details_doas',{data:data, access:req.session.access,name:req.session.name});  
       else if(req.session.access=="ai")    
       res.render('application_details_ai',{data:data, access:req.session.access,name:req.session.name});  
       else
       res.render('application_details_dg',{data:data, access:req.session.access,name:req.session.name});  
       });
},


doasApprove:function(req,res){
       var id=req.params.id;
       if(req.session.access=="doas"){
              applicationsDB.findById(id,(err,application)=>{
              application.approval_DOAS="Accepted";
              res.json({status:true})
              });

       }
       else
       {
              res.json({status:false})
       }

},

aiApprove:function(req,res){
       var id=req.params.id;
       if(req.session.access=="ai"){
              applicationsDB.findById(id,(err,application)=>{
                     application.approval_AI="Accepted";
                     application.save();
                     res.json({status:true})
              });

       }
       else
       {
              res.json({status:false})
       }

},


dgApprove:function(req,res){
       var id=req.params.id;
       if(req.session.access=="dg"){
              applicationsDB.findById(id,(err,application)=>{
                 application.approval_DG="Accepted";
                 res.json({status:true})
              });

       }
       else
       {
              res.json({status:false})
       }

},


feedback:function(req,res){
              console.log(req.body);
              var id=req.body.id;
              var  priority=req.body.priority;
              var title=req.body.title;
              var feedback=req.body.feedback;

              applicationsDB.findById(id,(err,application)=>{
              if (err) res.json({status:false});
              var obj={by:req.session.access,priority:priority,title:title,feedback:feedback};
              if(application.comments==null)
              application.comments=[obj];
              else
              application.comments.push(obj);
              
              application.save();
              res.json({status:true});
              });

},

feedbackPage:function(req,res){


       var id=req.params.id;
       applicationsDB.findById(id,(err,result)=>{

              res.render('admins_feedback',{id:id,comments:result.comments});
       });



},


assignToAI:function(req,res){

var id=req.params.id;
userdb.findOne({category:"ai"},(err,result)=>{
       if(err) res.json({status:false});
       result.applications.push(id);
       result.save();
       res.json({status:true});

});

},


assignToDg:function(req,res){

       var id=req.params.id;
       userdb.findOne({category:"dg"},(err,result)=>{
              if(err) res.json({status:false});
              result.applications.push(id);
              result.save();
              res.json({status:true});
       
       });
},


issueLicense:function(req,res){

       var id =req.params.id;
       if(req.params.access=="doas"){
              applicationsDB.findById(id,(err,application)=>{

                     if(err) res.json({status:false});
                     else
                     {
                            if(application.approval_DOAS=="Approved" && application.approval_AI=="Approved" && application.approval_DG=="Approved"){
                                   application.licenseIssued=newLicense();
                                   application.save();
                                   res.json({status:true, licenseno:application.licenseIssued});
                            
                            }
                            else{
                                   res.json({status:false}); 
                            }
                     }

              });


       }else{
              res.json({status:false});
       }
},

rejectApplication:function(req,res){
       var id=req.params.id;
       var signer=req.session.access;
       if(req.session.access=="doas" && req.session.access=="ai" && req.session.access=="dg"){

              applicationsDB.findById(id,(err,application)=>{

                     if(signer=="doas")
                     application.approval_DOAS="Rejected";
                     else if(signer=="ai")
                     application.approval_AI="Rejected";
                     else
                     application.approval_DG="Rejected";

                     application.licenseIssued="Rejected";
                     application.save();
                     res.json({status:true});

              });
       }
       else{
              res.json({status:false})
       }
}
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}