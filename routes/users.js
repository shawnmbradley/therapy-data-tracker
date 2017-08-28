var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var Q = require('q');
var passport = require('passport');
var LocalStrategy = require('passport-local');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {

  if (req.isAuthenticated()) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
  }
  else
  {
    req.session.error = 'Please sign in!';
    res.redirect('/auth/signin');
  }       


});

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('users/newuser', { title: 'Add New User' });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

  if (req.isAuthenticated()) {
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var username = req.body.username;
    var email = req.body.useremail;
    var password = req.body.password;

    // Set our collection
    var collection = db.get('usercollection');

    //check if user already is in db
    collection.findOne({'username' : username})
        .then(function (result) {
            if(null != result) {
                console.log("USERNAME ALREADY EXISTS:", result.username);
                res.send('User already exists');
            }
            else
            {
                var hash = bcrypt.hashSync(password, 8);

                console.log('CREATING USER:', username);

                // Submit to the DB
                collection.insert({
                    "username"      :   username,
                    "password"      :   hash,
                    "email"         :   email
                }, function (err, doc) {
                    if (err) {
                        // If it failed, return error
                        res.send("There was a problem adding the information to the database.");
                    }
                    else {
                        // And forward to success page
                        res.redirect("userlist");
                    }
                });
            }
        })
  }
  else
  {
    req.session.error = 'Please sign in!';
    res.redirect('/auth/signin');
  }     




});



module.exports = router;
