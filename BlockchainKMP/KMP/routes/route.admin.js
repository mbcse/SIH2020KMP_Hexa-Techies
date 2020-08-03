var express = require('express');
var router = express.Router();
var adminController=require('../controller/controller.admin');
var middlewares=require('../services/middlewares');
/* GET user dashboard */
router.get('/doas/dashboard',adminController.checkClientLoggedIn, adminController.adminDashboard);
router.get('/ai/dashboard',adminController.checkClientLoggedIn, adminController.adminDashboard);
router.get('/dg/dashboard',adminController.checkClientLoggedIn, adminController.adminDashboard);

router.get('/doas/approve/:id',adminController.checkClientLoggedIn, adminController.doasApprove);
router.get('/ai/approve/:id',adminController.checkClientLoggedIn, adminController.aiApprove);
router.get('/dg/approve/:id',adminController.checkClientLoggedIn, adminController.dgApprove);

router.get('/getapplicationdetails/:aid',adminController.checkClientLoggedIn, adminController.getApplicationDetails);

router.get('/applicationdetails/:id',adminController.checkClientLoggedIn,adminController.applicationDetails);
router.get('/cms',(req,res)=>{
    res.render('CMS');
});

router.post('/sendfeedback',adminController.checkClientLoggedIn,adminController.feedback);

router.get('/feedbackpage/:id',adminController.checkClientLoggedIn,adminController.feedbackPage);

router.get('/rejectapplication/:id',adminController.checkClientLoggedIn,adminController.rejectApplication);

router.get('/assignai/:id',adminController.checkClientLoggedIn,adminController.assignToAI);
router.get('/senddg/:id',adminController.checkClientLoggedIn,adminController.assignToDg)
router.get('/issuelicense/:id',adminController.checkClientLoggedIn,adminController.issueLicense);
router.get('/generatecertificate/:id/:hash',adminController.checkClientLoggedIn,adminController.generateCertificate);
router.get('/deleteapplication/:id',adminController.checkClientLoggedIn,adminController.deleteApplication);
router.get('/archiveapplication/:id',adminController.checkClientLoggedIn,adminController.archiveapplication);
router.get('/archivepage/:id',adminController.checkClientLoggedIn,adminController.archivepage);
router.get('/restorearchive/:id',adminController.checkClientLoggedIn,adminController.restorearchive);
router.get('/deletepage',adminController.checkClientLoggedIn,adminController.deletepage);


module.exports = router;
