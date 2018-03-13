var express = require('express');
var router = express.Router();
var session = require('express-session');
var dba = require('../custom_modules/db-access.js');

/* GET profile page. */
router.get('/', function(req, res) {
  if (req.session.user && req.cookies.user_sid) {
    res.render('user', {
      title: 'ATI'
    });
  } else {
    res.render('needToLogin');
    // res.redirect('login');
  }


});



router.get('/newSurvey', function(req, res, next) {
  if (req.session.user && req.cookies.user_sid) {
    res.render('newSurvey', {
      title: 'ATI'
    });
  } else {
    res.render('needToLogin');
    // res.redirect('login');
  }
});


router.get('/surveyDetails/:id([0-9]{1,20})', function(req, res, next) {
  if (req.session.user && req.cookies.user_sid) {
    dba.performQuery('SELECT IF (' + req.query.SID + ' in (SELECT surveyID FROM survey), true, false) AS b;', function(err, result) {
      if (err) {
        res.status(404).send('Survey not found.');
        return console.log('Survey not found');
      }
      if (JSON.parse(JSON.stringify(result))[0].b == 1) {
        dba.performQuery('SELECT IF(UID=' + req.session.user + ', true, false) AS b FROM Survey WHERE surveyID=' + req.query.SID + ';', function(err, result) {
          if (err || result == undefined) {
            res.status(500).send('Something went wrong');
            return console.log('user.js:get surveyDetails ' + err.toString());
          }
          let string = JSON.stringify(result);
          let json = JSON.parse(string);
          if (json[0].b) {
            res.render('surveyDetails', {
              title: 'ATI',
              surveyId: id
            });
          } else {
            res.status(403).send('Not permitted for you.');
          }
        });
      } else {
        res.status(404).send('Survey not found');
      }
    });
  } else {
    res.render('needToLogin');
  }
});
if (req.session.user && req.cookies.user_sid) {
  let id = req.params.id;
  res.render('surveyDetails', {
    title: 'ATI',
    surveyId: id
  });
} else {
  res.render('needToLogin');
  // res.redirect('login');
}
});

/* GET profile page. */
router.get('/', function(req, res, next) {
  res.render('user', {
    title: 'ATI'
  });
});


module.exports = router;
