var express = require('express');
var router = express.Router();


/* GET manual_data_entry page. */
router.get('/manual_data_sheet', function(req, res) {

  if (req.isAuthenticated()) {
    var db = req.db;
    var collection = db.get('studentscollection');
    collection.find({},{},function(e,students){
        res.render('student_reports/manual_data_sheet', {
            "students" : students, title: 'Manual Data Sheet Report'
        });
    });
  }
  else
  {
    req.session.error = 'Please sign in!';
    res.redirect('/auth/signin');
  }      

});


/* GET generated report. */
router.get('/generate_manual_data_sheet/:id', function(req, res) {

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
                res.render('student_reports/show_manual_data_sheet', {
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


module.exports = router;