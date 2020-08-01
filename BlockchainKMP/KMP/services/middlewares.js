var express = require('express');
var multer=require('multer');
var path = require('path');

var approvalsUploadStorage=multer.diskStorage(
    {
      destination:"./public/approvalsUpload",
      filename:(req,file,cb)=>
      {
        cb(null,"AAIDOC_"+req.params.id+"_"+Date.now()+path.extname(file.originalname));
      }
  
    }
  );    
var approvalUpload = multer({ storage:approvalsUploadStorage });

module.exports={
    approvalUpload
}
