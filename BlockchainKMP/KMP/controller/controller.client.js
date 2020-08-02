var express = require('express');
var applicationsDB=require('../models/application');
var userdb=require('../models/usersdb');
var clientService=require('../services/service.client');
const { render } = require('ejs');

function newId(){
       let randomNum = Math.random() * ((new Date()/1000) - 1) + 1;
       return "AAI"+Math.floor(randomNum+(new Date()/1000));
}


module.exports={

checkClientLoggedIn:function(req,res,next){
    if(req.session.loggedin)
           next();
    else
           res.render('login',{msg:"Please Login In First"});
},

newApplication:function(req,res,next){
       console.log(req.body);
       var application=new applicationsDB({_id: newId(),                                      
              applicant_name :req.body.username,
              applicant_id:req.session.user,
              full_address:req.body.applicantAddress+","+req.body.applicantAddress2+","+req.body.applicantCity+","+req.body.applicantState+","+req.body.applicantZip,
              tel_no : req.body.applicantPhone,
              email : req.body.applicantEmail,
              nationality: req.body.applicantNationality,
              location_aerodrome : req.body.aerodromeName,
              site_aerodrome : req.body.aerodromeSite,
              state_district: req.body.aerodromeState_District,
              aerodrome_category : req.body.category,
              land_area : req.body.totalLandArea,
              total_land_cost : req.body.totalLandCost,
              latitude:req.body.aerodromeLatitude,
              longitude:req.body.aerodromeLongitude,
              estimated_project_cost : req.body.totalProjectCost,
              capacity_passengers : req.body.passengerCapacity,
              capacity_cargo : req.body.cargoCapacity,
              number_of_runways : req.body.noOfRunways,
              length_of_runways : req.body.runwayLength,
              number_of_taxiways : req.body.noOfTaxiways,
              area_of_passenger_terminal : req.body.areaPassengerT,
              area_of_cargo_terminal : req.body.areaCargoT,
              name_of_directors : {head:{name:req.body.companyHead,status:req.body.companyHeadStatus,phone:req.body.companyHeadPhone}
              ,operationhead:{name:req.body.aerodromeOperationHead,status:req.body.aerodromeOperationHeadStatus,phone:req.body.aerodromeOperationHeadPhone}
              ,safetyhead:{name:req.body.aerodromeSafetyHead,status:req.body.aerodromeSafetyHeadStatus,phone:req.body.aerodromeSafetyHeadPhone}
              ,atmhead:{name:req.body.aerodromeAtmHead,status:req.body.aerodromeAtmHeadStatus,phone:req.body.aerodromeAtmHeadPhone}
              ,cnshead:{name:req.body.aerodromeCnsHead,status:req.body.aerodromeCnsHeadStatus,phone:req.body.aerodromeCnsHeadPhone}
              ,rffhead:{name:req.body.aerodromeRffHead,status:req.body.aerodromeRffHeadStatus,phone:req.body.aerodromeRffHeadPhone}
              ,methead:{name:req.body.aerodromeMetHead,status:req.body.aerodromeMetHeadStatus,phone:req.body.aerodromeMetHeadPhone}
              ,metprovider:{name:req.body.aerodromeMetProvider,address:req.body.aerodromeMetProviderAddress}
              ,atmprovider:{name:req.body.aerodromeAtmProvider,address:req.body.aerodromeAtmProviderAddress}
              }

              });

              application.save((err,result)=>{
                     if(err) res.json({status:false});
                     else
                     {

                            userdb.findById("5f1ebc5e15dbc6598c5f2e68",(err,doas)=>{
                                   if(err){
                                          console.log(err);
                                   }else{
                                          doas.applications.push(result._id);
                                          doas.save();
                                   }
                                   
 
                            });


                            userdb.findById(req.session.user,(err,user)=>{
                               
                                   user.applications.push(result._id);
                                   user.save((err,resu)=>{
                                          console.log(resu);         
                                          res.json({status:true, id:result._id, name:req.body.username, address:result.full_address, phone:result.tel_no, nationality:result.nationality
                                                 ,aerodromename:result.location_aerodrome,district_state :result.state_district, category:result.aerodrome_category, latitude:result.latitude, longitude:result.longitude
                                          });
                                   });
                            });
                         
                            
                     }
                     
              });    

},


clientDashboard:function(req,res,next){
       userdb.findById(req.session.user,(err,user)=>{
              var obj={userApplications:user.applications, id:req.session.user, email:user.email, name:user.name};
              res.render('client_dashboard',obj);  
         });
       

},


getApplicationDetails:function(req,res,next){

       var applicationId=req.params.aid;
       console.log(applicationId);
       applicationsDB.findById(applicationId,(err,data)=>{
            res.json(data);  
       });
},


uploadHM:async function(req,res){
       var id=req.params.id;
       var upload=req.file.filename;
       console.log(upload,id);
       let data=await clientService.upload_Blockchain_OCR_Approvals("./public/approvalsUpload/"+upload);
       applicationsDB.findById(id,(err,application)=>{
              if(err){
                     res.json({status:false})
              }else{
                     application.ministry_home={hash:data.hash,data:data.data};
                     application.save();
                     res.json({status:true, hash:data.hash})
              }    
       });
},


uploadDF:async function(req,res){
       var id=req.params.id;
       var upload=req.file.filename;
       console.log(upload,id);
       let data=await clientService.upload_Blockchain_OCR_Approvals("./public/approvalsUpload/"+upload);
       applicationsDB.findById(id,(err,application)=>{
              if(err){
                     res.json({status:false})
              }else{
                     application.ministry_defence={hash:data.hash,data:data.data};
                     application.save();
                     res.json({status:true, hash:data.hash})
              }    
       });
},

uploadLO:async function(req,res){
       var id=req.params.id;
       var upload=req.file.filename;
       console.log(upload,id);
       let data=await clientService.upload_Blockchain_OCR_Approvals("./public/approvalsUpload/"+upload);
       applicationsDB.findById(id,(err,application)=>{
              if(err){
                     res.json({status:false})
              }else{
                     application.landowner_approval={hash:data.hash,data:data.data};
                     application.save();
                     res.json({status:true, hash:data.hash})
              }    
       });
},


uploadAM:async function(req,res){
       var id=req.params.id;
       var upload=req.file.filename;
       console.log(upload,id);
       let data=await clientService.upload_Blockchain_OCR_Approvals("./public/approvalsUpload/"+upload);
       applicationsDB.findById(id,(err,application)=>{
              if(err){
                     res.json({status:false})
              }else{
                     application.aerodrome_manual={hash:data.hash,data:data.data};
                     application.save();
                     res.json({status:true, hash:data.hash})
              }    
       });
},


applicationDetails:function(req,res){
       var applicationId=req.params.id;
       applicationsDB.findById(applicationId,(err,data)=>{
              res.render('application_details_client',{data:data}); 
         });

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

       res.render('client_feedback',{id:id,comments:result.comments});
});



},

updateApplication:function(req,res){

       var id=req.params.id;
       applicationsDB.findById(id,(err,application)=>{

              res.render('update',{data:application});
       });

}









































}