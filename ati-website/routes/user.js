var express = require('express');
var router = express.Router();


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
