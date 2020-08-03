const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deletearchive = new Schema ({
    name:String,
    deletedapplications:[String]
});

module.exports = mongoose.model('deletedb', deletearchive)