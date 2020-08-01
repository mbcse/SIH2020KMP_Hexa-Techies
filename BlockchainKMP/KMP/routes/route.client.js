var express = require('express');
var router = express.Router();
var clientController=require('../controller/controller.client');
var middlewares=require('..//services/middlewares');
/* GET user dashboard */
router.get('/dashboard',clientController.checkClientLoggedIn, clientController.clientDashboard);

router.get('/newapplication',clientController.checkClientLoggedIn, function(req, res, next) {
  res.render('applicationform');
});

router.post('/aerodromeapplication', clientController.checkClientLoggedIn, clientController.newApplication);

router.get('/getapplicationdetails/:aid',clientController.checkClientLoggedIn, clientController.getApplicationDetails);

router.post('/uploadhmapproval/:id',middlewares.approvalUpload.single('file'),clientController.uploadHM);
router.post('/uploaddfapproval/:id',middlewares.approvalUpload.single('file'),clientController.uploadDF);
router.post('/uploadam/:id',middlewares.approvalUpload.single('file'),clientController.uploadAM);
router.post('/uploadloapproval/:id',middlewares.approvalUpload.single('file'),clientController.uploadLO);

router.get('/applicationdetails/:id',clientController.checkClientLoggedIn,clientController.applicationDetails)

module.exports = router;
