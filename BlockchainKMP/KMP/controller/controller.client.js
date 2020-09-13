var express = require('express');
var applicationsDB=require('../models/application');
var userdb=require('../models/usersdb');

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
              full_address:req.body.applicantAddress+" "+req.body.applicantAddress2+","+req.body.applicantCity+","+req.body.applicantState+","+req.body.applicantZip,
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

                            userdb.findById("5f1ebd544721bf5ec4c1d977",(err,doas)=>{
                                   if(err){
                                          console.log(err);
                                   }
                                   doas.applications.push(result._id);
                                   user.save();
 
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
      
       

}






































}