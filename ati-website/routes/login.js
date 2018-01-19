var express = require('express');
var router = express.Router();
//var session = require('express-session');
var rewriter = require('express-rewrite');
var bcrypt = require('bcrypt');
var dba = require('../custom_modules/db-access.js');
var backURL = '/';


/* GET profile page. */
router.get('/', function(req, res, next) {
  backURL=req.header('Referer') || '/';
  if (req.session.user && req.cookies.user_sid) {
    res.redirect('logout');
  } else {
    res.render('login', { title: 'ATI', messageA: ' ',  messageB: ' ' });
  }
});

router.post('/',function(req, res) {

  console.log(backURL);
  var email = req.body.email,
      password = req.body.password;
  var newName = req.body.newName,
      newEmail = req.body.newEmail,
      newPassword = req.body.newPassword,
      newPasswordConf = req.body.newPasswordConf;

  if (email != undefined) {
    dba.performQuery("SELECT EMail,PW FROM user WHERE EMail = '" + email + "'",function (err, result) {
      if (err || result == undefined) {			//in case of an error (mostlikely an invalid sql-statement) tell the client and log on the server
        return console.log('Err: Bad query. (db-acces.js:manipulateDB)');	//for more detailed err-log de-comment the line above
      }
      var string = JSON.stringify(result);
      let json =  JSON.parse(string);
      //res.send( req.body.newName == undefined);
      if (Object.keys(json).length != 0 && bcrypt.compareSync(password,json[0].PW)) {
        req.session.user = json[0].EMail;
        res.redirect(backURL);
      } else {
        res.render('login', { title: 'ATI', messageA: 'bad login', messageB: ' ' });
      }

    });
  // it is enough to check whether or not one field from this form is defined, because all fields are required.
  } else if (newName != undefined) {
    // res.send(req.body)
    if (newPassword == newPasswordConf) {

      dba.performQuery("SELECT EMail,PW FROM user WHERE EMail = '" + newEmail + "'",function (err, result) {
        if (err || result == undefined) {			//in case of an error (mostlikely an invalid sql-statement) tell the client and log on the server
          return console.log('Err: Bad query. (db-acces.js:manipulateDB)');	//for more detailed err-log de-comment the line above
        }
        var string = JSON.stringify(result);
        let json =  JSON.parse(string);

        // if json object is empty, no user with this email address exists yet.
        if (Object.keys(json).length == 0) {
          let query = "INSERT INTO user (UserName, EMail, PW) VALUES ('" + newName +"','" + newEmail + "','" + bcrypt.hashSync(newPassword, 10) + "')";
          // console.log(query);
          dba.performQuery(query, function (err, result) {
            if (err || result == undefined) {
                return console.log('Err: Bad query. (db-acces.js:manipulateDB)');
            } else {
              req.session.user = newEmail;
              res.redirect(backURL);
            }
          });
        }
      });

      // res.render('login', { title: 'ATI', messageA: ' ', messageB: 'Sory, das geht noch nicht.. Funktion kommt bald' });
    } else {
      res.render('login', { title: 'ATI', messageA: ' ', messageB: 'passwords do not match!' });
    }
  }

  });

//create new Account
// router.post('/new', function(req, res, next) {
//   var name = req.body.newName,
//       email = req.body.newEmail,
//       password = req.body.newPassword,
//       passwordConf = req.body.newPasswordConf;
//
//       if (password === passwordConf) {
//
//       } else {
//         req.url='/';
//         res.render('login', { title: 'ATI', messageA: 'passwords do not match!' });
//       }
//       next();
// });

/*update name*/
router.put('/changeName', function(req, res, next) {
  //TODO
});

module.exports = router;
