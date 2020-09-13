const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const application = new Schema ({
    applicant_name :   String,
        full_address:  String,
        tel_no : String,
        email : String,
        name_of_directors : String,
        name_of_company : String,
        location_aerodrome : String,
        land_area : String,
        aerodrome_category : String,
        site_aerodrome : String,
        district_aerodrome : String,
        state_aerodrome : String,
        estimated_project_cost : String,
        capacity_passengers : String,
        capacity_cargo : String,
        number_of_runways : String,
        length_of_runways : String,
        number_of_taxiways : String,
        area_of_passenger_terminal : String,
        area_of_cargo_terminal : String,
        total_land_cost : String,
        ministry_defence : Object,
        ministry_home : Object,
        approval_AI : Object,
        approval_DOAS : Object,
        approval_DG : Object


});

module.exports = mongoose.model('Application', application)