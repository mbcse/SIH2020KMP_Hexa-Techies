var express = require('express');
var router = express.Router();
var clientController=require('../controller/controller.client');
/* GET user dashboard */
router.get('/dashboard', function(req, res, next) {
  res.render('client_dashboard');
});

module.exports = router;
