var express = require('express');
var router = express.Router();
var indexController=require('../controller/controller.index');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('This is Homepage Under Development');
});

router.get('/loginpage', function(req, res, next) {
  res.render('login',{msg:""});
});

router.post('/login',indexController.login);

router.get('/registerpage', function(req, res, next) {
  res.render('register');
});

router.post('/register',indexController.register);

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
