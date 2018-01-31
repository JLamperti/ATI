var express = require('express');
var router = express.Router();
var session = require('express-session');
var dba = require('../custom_modules/db-access.js');

/* GET profile page. */
router.get('/', function(req, res) {
	if (req.session.user && req.cookies.user_sid) {
      res.render('user', { title: 'ATI' });
   } else {
		 res.render('needToLogin');
      // res.redirect('login');
   }


});

/*update name*/
router.put('/changeName', function(req, res, next) {
  //TODO
});

router.get('/newSurvey', function(req, res, next) {
  res.render('newSurvey', {title:'ATI' });
});

router.get('/surveyDetails', function(req, res, next) {
  res.render('surveyDetails', {title:'ATI' });
});

/* GET profile page. */
router.get('/', function(req, res, next) {
  res.render('user', {title:'ATI' });
});


module.exports = router;
