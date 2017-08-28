var express = require('express');
var router = express.Router();


/* GET goal messurement types page. */
router.get('/student_goal_messurement_types', function(req, res) {

  if (req.isAuthenticated()) {
    var db = req.db;
    var collection = db.get('student_goal_messurement_types');
    collection.find({},{},function(e,docs){
        res.render('config/goals/student_goal_messurement_types', {
            "student_goal_messurement_types" : docs, title: 'Goal Messurement Types'
        });
    });
  }
  else
  {
    req.session.error = 'Please sign in!';
    res.redirect('/auth/signin');
  }      

});

/* GET Edit goal messurement type page. */
router.get('/edit_student_goal_messurement_type/:id', function(req, res) {

  if (req.isAuthenticated()) {

    var db = req.db;
    
    var goaltypes = db.get('student_goal_messurement_types');
    var ObjectId = require('mongodb').ObjectID
    var id = req.params.id;
    var o_id = new ObjectId(id);
      
    goaltypes.findOne({_id:o_id},function(e,docs){
        res.render('config/goals/edit_student_goal_messurement_type', {
            "goaltype" : docs, title: 'Edit Goal Messurement Types'
        });        
    })

  }
  else
  {
    req.session.error = 'Please sign in!';
    res.redirect('/auth/signin');
  }       


});

/* GET to New Student Goal Messurement Type */
router.get('/new_student_goal_messurement_type/', function(req, res) {
    res.render('config/goals/new_student_goal_messurement_type')
})


/* POST to Update Student Service */
router.post('/add_student_goal_messurement_type/', function(req, res) {

  if (req.isAuthenticated()) {
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var name = req.body.name;




    // Set our collection
    var collection = db.get('student_goal_messurement_types');
  

    // Submit to the DB
    collection.insert(
    {
        "name"   : name
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("/goals/student_goal_messurement_types/");
        }
    });
  }
  else
  {
    req.session.error = 'Please sign in!';
    res.redirect('/auth/signin');
  }         


});


/* POST to Update Student Service */
router.post('/update_student_goal_messurement_type/:id', function(req, res) {

  if (req.isAuthenticated()) {
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var name = req.body.name;




    // Set our collection
    var collection = db.get('student_goal_messurement_types');

    var ObjectId = require('mongodb').ObjectID
    var id = req.params.id;
    var o_id = new ObjectId(id);    

    // Submit to the DB
    collection.update(
    {
        "_id"   :   o_id
    },
    {
        "name"   : name
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("/goals/edit_student_goal_messurement_type/" + id);
        }
    });
  }
  else
  {
    req.session.error = 'Please sign in!';
    res.redirect('/auth/signin');
  }         


});

module.exports = router;