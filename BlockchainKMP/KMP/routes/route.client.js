var express = require('express');
var router = express.Router();
var clientController=require('../controller/controller.client');
/* GET user dashboard */
router.get('/dashboard',clientController.checkClientLoggedIn, function(req, res, next) {
  res.render('client_dashboard');
});

router.get('/newapplication',clientController.checkClientLoggedIn, function(req, res, next) {
  res.render('applicationform');
});

router.post('/aerodromeapplication', clientController.newApplication);



module.exports = router;
