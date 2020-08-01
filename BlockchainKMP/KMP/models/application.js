const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const application = new Schema ({
        _id:String,
        applicant_name :   String,
        full_address:  String,
        tel_no : String,
        email : String,
        nationality: String,
        location_aerodrome : String,
        site_aerodrome : String,
        state_district: String,
        aerodrome_category : String,
        land_area : String,
        total_land_cost : String,
        latitude:String,
        longitude:String,
        estimated_project_cost : String,
        capacity_passengers : String,
        capacity_cargo : String,
        number_of_runways : String,
        length_of_runways : String,
        number_of_taxiways : String,
        area_of_passenger_terminal : String,
        area_of_cargo_terminal : String,
        name_of_directors : {type:Object, default:null},
        ministry_defence : {type:Object, default:null},
        ministry_home : {type:Object, default:null},
        aerodrome_manual:{type:Object, default:null},
        landowner_approval:{type:Object, default:null},
        approval_AI : {type:String, default:"Pending"},
        approval_DOAS : {type:String, default:"Pending"},
        approval_DG : {type:String, default:"Pending"},
        licenseIssued:{type:String, default:"Not Issued"},
        comments:{type:[Object], default:null},
        feeAmount:String
});

module.exports = mongoose.model('Application', application)