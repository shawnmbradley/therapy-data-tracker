var express = require('express');
var router = express.Router();
var Q = require('q');
var passport = require('passport');
var LocalStrategy = require('passport-local');

var config = require('../config.js'), //config file contains all tokens and other private info
    funct = require('../functions.js'); //funct file contains our helper functions for our Passport and database work

//displays our homepage
router.get('/', function(req, res){
  if (req.isAuthenticated()) {
    res.send('authenticated!');
  }
  else
  {
    req.session.error = 'Please sign in!';
    res.redirect('/auth/signin');
  }

});

//displays our signup page
router.get('/signin', function(req, res){
  res.render('auth/signin');
});

//sends the request through our local signup strategy, and if successful takes user to homepage, otherwise returns then to signin page
router.post('/local-reg', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/auth/signin'
  })
);

//sends the request through our local login/signin strategy, and if successful takes user to homepage, otherwise returns then to signin page
router.post('/login', passport.authenticate('local-signin', {
  successRedirect: '/',
  failureRedirect: '/auth/signin'
  })
);

//logs user out of site, deleting them from the session, and returns to homepage
router.get('/logout', function(req, res){
  var name = req.user.username;
  console.log("LOGGIN OUT " + req.user.username)
  req.logout();
  res.redirect('/');
  req.session.notice = "You have successfully been logged out " + name + "!";
});




module.exports = router;