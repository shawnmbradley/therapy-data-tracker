var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET Userlist page. */
router.get('/studentlist', function(req, res) {

  if (req.isAuthenticated()) {
    var db = req.db;
    var collection = db.get('studentscollection');
    collection.find({},{},function(e,docs){
        res.render('students/studentlist', {
            "studentlist" : docs, title: 'Students'
        });
    });
  }
  else
  {
    req.session.error = 'Please sign in!';
    res.redirect('/auth/signin');
  }      

});

/* GET Edit Student page. */
router.get('/edit/:id', function(req, res) {

  if (req.isAuthenticated()) {

    var db = req.db;
    var students = db.get('studentscollection');
    var goaltypes = db.get('student_goal_messurement_types');
    var goaltype = db.get('student_goal_messurement_types');
    var goals = db.get('student_goals');
    var ObjectId = require('mongodb').ObjectID
    var id = req.params.id;
    var o_id = new ObjectId(id);
      
    students.find({_id:o_id},function(e,docs){
        goals.find({"student_object_id":o_id},function(e, studentgoals){
            studentgoals.forEach( function(agoal) {
                //console.log(agoal);
                var gid = agoal['goal_messurement_type'];
                console.log(gid);
                var go_id = new ObjectId(id);       
                console.log(go_id);         
                goaltype.find({_id:gid}, function(e, thisgoaltype) {
                    console.log(thisgoaltype);
                    agoal['goal_messurement_type'] = thisgoaltype
                    console.log(agoal);
                })
            })
            goaltypes.find({},{}, function(e, goaltypes){
                res.render('students/edit', {
                    "student" : docs, "goaltypes" : goaltypes, "goals": studentgoals, title: 'Students'
                });
            })
        })
    });
  }
  else
  {
    req.session.error = 'Please sign in!';
    res.redirect('/auth/signin');
  }       


});

/* POST to Update Student Service */
router.post('/updatestudent/:id', function(req, res) {

  if (req.isAuthenticated()) {
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var teacher = req.body.teacher;
    var campus = req.body.campus;
    var studentid = req.body.studentid;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var dob = req.body.dob;
    var grade = req.body.grade;
    var current_ard = req.body.current_ard;
    var scheduled_ard = req.body.scheduled_ard;
    var fie_date = req.body.fie_date;
    var slp_services = req.body.slp_services;
    var disibilities = req.body.disibilities;



    // Set our collection
    var collection = db.get('studentscollection');

    var ObjectId = require('mongodb').ObjectID
    var id = req.params.id;
    var o_id = new ObjectId(id);    

    // Submit to the DB
    collection.update(
    {
        "_id"   :   o_id
    },
    {
        "teacher"   : teacher,
        "studentid" : studentid,
        "campus"    : campus,
        "firstname" : firstname,
        "lastname" : lastname,
        "dob"       : dob,
        "grade"     : grade,
        "current_ard" : current_ard,
        "scheduled_ard" : scheduled_ard,
        "fie_date"      : fie_date,
        "slp_services"  : slp_services,
        "disibilities"   : disibilities
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("/students/edit/" + id);
        }
    });
  }
  else
  {
    req.session.error = 'Please sign in!';
    res.redirect('/auth/signin');
  }         


});

/* GET New Student page. */
router.get('/newstudent', function(req, res) {
  if (req.isAuthenticated()) {
    res.render('students/newstudent', { title: 'Add New Student' });
  }
  else
  {
    req.session.error = 'Please sign in!';
    res.redirect('/auth/signin');
  }       
    
});

/* POST to Add Student Service */
router.post('/addstudent', function(req, res) {

  if (req.isAuthenticated()) {
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var teacher = req.body.teacher;
    var campus = req.body.campus;
    var studentid = req.body.studentid;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var dob = req.body.dob;
    var grade = req.body.grade;
    var current_ard = req.body.current_ard;
    var scheduled_ard = req.body.scheduled_ard;
    var fie_date = req.body.fie_date;
    var slp_services = req.body.slp_services;
    var disibilities = req.body.disibilities;



    // Set our collection
    var collection = db.get('studentscollection');

    // Submit to the DB
    collection.insert({
        "teacher"   : teacher,
        "studentid" : studentid,
        "campus"    : campus,
        "firstname" : firstname,
        "lastname" : lastname,
        "dob"       : dob,
        "grade"     : grade,
        "current_ard" : current_ard,
        "scheduled_ard" : scheduled_ard,
        "fie_date"      : fie_date,
        "slp_services"  : slp_services,
        "disibilities"   : disibilities
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("studentlist");
        }
    });
  }
  else
  {
    req.session.error = 'Please sign in!';
    res.redirect('/auth/signin');
  }       


});

/* POST to Add Goal Service */
router.post('/addgoal/:id', function(req, res) {

    if (req.isAuthenticated()) {
        // Set our internal DB variable
        var db = req.db;

        // Get our form values. These rely on the "name" attributes
        var goal = req.body.goal;
        var goal_color = req.body.goal_color;
        var goal_messurement_type = req.body.goal_messurement_type;

        // Set our collection
        var collection = db.get('student_goals');


        var ObjectId = require('mongodb').ObjectID
        var id = req.params.id;
        var o_id = new ObjectId(id);     


        // Submit to the DB
        collection.insert({
            "student_object_id" : o_id,
            "goal"   : goal,
            "goal_messurement_type" : goal_messurement_type,
            "goal_color"    : goal_color
        }, function (err, doc) {
            if (err) {
                // If it failed, return error
                res.send("There was a problem adding the information to the database.");
            }
            else {
                // And forward to success page
            //res.send({message: "The goal has been saved!"});
            res.redirect('/students/edit/' + id + '#goals');
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
