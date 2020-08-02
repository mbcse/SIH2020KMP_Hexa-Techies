var express = require('express');
var path = require('path');
var fs = require('fs');
var applicationsDB=require('../models/application');
var userdb=require('../models/usersdb');
const IPFS = require('ipfs-api');
var spawn = require("child_process").spawn; 
//ipfs config
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https'});

module.exports={

upload_Blockchain_OCR_Approvals:(file)=>{


return new Promise((resolve,reject)=>{
    let ipfsfilen = fs.readFileSync(file);
    let ipfsbuffer = new Buffer(ipfsfilen);
    var hash="";
    ipfs.files.add(ipfsbuffer, function (err, file) {
      if (err) {
        reject(err);
      }
      console.log(file);
      hash=file[0].hash;
    });

    var process = spawn('python',["./public/OCR/file_to_json.py",file] );
    process.stdout.on('data', function(data) { 
    var d=data.toString();
    resolve({hash:hash,data:JSON.parse(d)});
    });
        
    
    


});

  
}








}