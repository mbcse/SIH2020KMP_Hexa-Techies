const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const details = new Schema ({
    ids : [{type : String}],
    name: { type: String, required: true },
    position : { type: String, required: true },
    



})