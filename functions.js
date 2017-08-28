var bcrypt = require('bcrypt'),
    Q = require('q'),
    config = require('./config.js'); //config file contains all tokens and other private info

// MongoDB connection information
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/rsdtv1');

//used in local-signup strategy
exports.localReg = function (username, password) {
  var deferred = Q.defer();
    
    var collection = db.collection('userscollection');

    //check if username is already assigned in our database
    collection.findOne({'username' : username})
      .then(function (result) {
        if (null != result) {
          console.log("USERNAME ALREADY EXISTS:", result.username);
          deferred.resolve(false); // username exists
        }
        else  {
          var hash = bcrypt.hashSync(password, 8);
          var user = {
            "username": username,
            "password": hash,
            "avatar": "http://placepuppy.it/images/homepage/Beagle_puppy_6_weeks.JPG"
          }

          console.log("CREATING USER:", username);

          collection.insert(user)
            .then(function () {
              db.close();
              deferred.resolve(user);
            });
        }
      });

    return deferred.promise;
};

//check if user exists
    //if user exists check if passwords match (use bcrypt.compareSync(password, hash); // true where 'hash' is password in DB)
      //if password matches take into website
  //if user doesn't exist or password doesn't match tell them it failed
exports.localAuth = function (username, password) {
  var deferred = Q.defer();

    var collection = db.collection('usercollection');

    collection.findOne({'username' : username})
      .then(function (result) {
          console.log(result);
        if (null == result) {
          console.log("USERNAME NOT FOUND:", username);

          deferred.resolve(false);
        }
        else {
          var hash = result.password;

          console.log("FOUND USER: " + result.username);

          if (bcrypt.compareSync(password, hash)) {
            deferred.resolve(result);
          } else {
            console.log("AUTHENTICATION FAILED");
            deferred.resolve(false);
          }
        }

        db.close();
      });
  return deferred.promise;
}