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
        name_of_directors : Object,
        name_of_company : Object,
        ministry_defence : Object,
        ministry_home : Object,
        aerodrome_manual:Object,
        landowner_approval:Object,
        approval_AI : String,
        approval_DOAS : String,
        approval_DG : String,
        comments:Object,
        feeAmount:String
});

module.exports = mongoose.model('Application', application)