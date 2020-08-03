var express = require('express');
var applicationsDB=require('../models/application');
var userdb=require('../models/usersdb');
var fs = require('fs');
const { json } = require('body-parser');
var spawn = require("child_process").spawn; 
const IPFS = require('ipfs-api');
//ipfs config
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
var deletedb=require('../models/delete');

function newLicense(){
       let randomNum = Math.random() * ((new Date()/1000) - 1) + 1;
       return "AAI-LICENSE-"+Math.floor(randomNum+(new Date()/1000));
}

function getdate(){
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = mm + '/' + dd + '/' + yyyy;
return today;
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
              application.save();
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
                 application.save();
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
       if(req.session.access=="doas"){
              
              applicationsDB.findById(id,(err,application)=>{

                     if(err) res.json({status:false});
                     else
                     {console.log("working");
                            if(application.approval_DOAS=="Accepted" && application.approval_AI=="Accepted" && application.approval_DG=="Accepted"){
                                   var l=newLicense();
                                   application.licenseIssued=l;
                                   application.save();
                                   res.json({status:true, licenseno:l});
                            
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

generateCertificate:function(req,res){

       var id=req.params.id;
       var txhash=req.params.hash;
       if(req.session.access=="doas"){
              applicationsDB.findById(id,(err,application)=>{

                     if(err) res.json({status:false});
                     else
                     {
                            if(application.approval_DOAS=="Accepted" && application.approval_AI=="Accepted" && application.approval_DG=="Accepted"
                            && application.licenseIssued!=="Not Issued"){
                                  
                                   var process = spawn('python',["./public/certificate_script/certificate.py",application.aerodrome_category,application._id,application.licenseIssued,
                                   application.applicant_name,application.location_aerodrome+application.site_aerodrome, application.latitude, application.longitude,getdate(), "AAIKMP",txhash] );
                                   console.log(process);
                                   process.stdout.on('data', function(data) { 
                                   var d=JSON.parse(data.toString());
                                   console.log(d);
                                   if(d.status){
                                          // let ipfsfilen = fs.readFileSync('../public/All_Licenses/License_'+application._id);
                                          // let ipfsbuffer = new Buffer(ipfsfilen);
                                          // var hash="";
                                          // ipfs.files.add(ipfsbuffer, function (err, file) {
                                          //   if (err) {
                                          //    throw err;
                                          //   }
                                          //   console.log(file);
                                          //   hash=file[0].hash;
                                          //   application.licenseHash=hash;
                                          //   application.save();
                                            
                                          // });
                                      
                                          res.json({status:true});
                                          
                                   }else
                                   {    
                                          res.json({status:false});
                                   }
                                   });
                                   
                                   
                            
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
},


deleteApplication:function(req,res){

var id=req.params.id;

applicationsDB.findById(id,(err,app)=>{
       if(err) throw err;
       applicant=app.applicant_id;
      
       if(req.session.access=="doas"){
            
                           
                            userdb.findById(req.session.user,(err,resu)=>{
                                   if(err) throw err;
                                   console.log(resu);
                                   resu.applications.pull(id);
                                   resu.save();


                                   
                                   userdb.findById(applicant,(err,resu)=>{
                                          if(err) throw err;
                                          console.log(resu);
                                          resu.applications.pull(id);
                                          resu.save();

                                          deletedb.find({name:"deletedb"},(err,resl)=>{
                                                 console.log(resl);
                                                 if(resl!=[]){
                                                        var d=new deletedb({
                                                               name:"deletedb"
                                                        });

                                                        d.deletedapplications.push(id);
                                                        d.save();
                                                        res.redirect('/admin/doas/dashboard');

                                                 }
                                                 else
                                                 {
                                                        console.log(resl[0]);
                                                        resl[0].deletedapplications.push(id);
                                                        resl.save();
                                                        

                                                 }
                                        
                                          
                                          });
                                          
                                   });

                                   
                                   
                            });
                          
                            
       }
    
      
       else{
              res.redirect('/admin/dashboard');
       }
       

});
},



archiveapplication:function(req,res){

       var id=req.params.id;
       userdb.findById(req.session.user,(err,resu)=>{
              if(err) throw err;
              console.log(resu);
              resu.applications.pull(id);
              resu.archiveApplications.push(id);
              resu.save();
              res.redirect('/admin/'+req.session.access+'/dashboard');

       });



},
archivepage:function(req,res){

       var id=req.params.id;
       userdb.findById(req.session.user,(err,resu)=>{
              if(err) throw err;
              console.log(resu);
              res.render('archive_page',{id:req.session.user,userApplications:resu.archiveApplications});

       });



},

deletepage:function(req,res){

       
       deletedb.find({name:"deletedb"},(err,resu)=>{
              if(err) throw err;
              console.log(resu[0]);
              res.render('delete_page',{id:req.session.user,userApplications:resu[0].deletedapplications});

       });



},



restorearchive:function(req,res){

       var id=req.params.id;
       userdb.findById(req.session.user,(err,resu)=>{
              if(err) throw err;
              console.log(resu);
              resu.applications.push(id);
              resu.archiveApplications.pull(id);
              resu.save();
              res.redirect('/admin/'+req.session.access+'/dashboard');

       });


}


    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
}