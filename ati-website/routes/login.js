var express = require('express');
var router = express.Router();
//var session = require('express-session');
var rewriter = require('express-rewrite');
var bcrypt = require('bcrypt');
// var randomstring = require("randomstring");
var dba = require('../custom_modules/db-access.js');
var mailMan = require('../custom_modules/mailman.js');
var backURL = '/';
var hashPasses = 10;
var validDays = 3;


/* GET profile page. */
router.get('/', function(req, res, next) {
  backURL=req.header('Referer') || '/';
  console.log(req.cookies['locale']);
  if (req.session.user && req.cookies.user_sid) {
    res.redirect('logout');
  } else {
    res.render('login', { title: 'ATI', msg: ' ' });
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
    dba.performQuery("SELECT UserID,EMail,PW,bestaetigt FROM user WHERE EMail = '" + email + "'", function (err, result) {
      if (err || result == undefined) {			//in case of an error (mostlikely an invalid sql-statement) tell the client and log on the server
        return console.log('Err: Bad query. (login.js:38)'+ err.toString());	//for more detailed err-log de-comment the line above
      }
      var string = JSON.stringify(result);
      let json =  JSON.parse(string);
      // res.send( req.body.newName == undefined);
      // res.send(json);
      // console.log(json[0].bestaetigt);

      // check if user exists in database and password is correct
      if (Object.keys(json).length != 0 && bcrypt.compareSync(password,json[0].PW)) {
        if (json[0].bestaetigt != 0) { //if user email is not validated yet
          req.session.user = json[0].UserID;
          res.redirect(backURL);
        } else {
          res.render('login', { title: 'ATI', msg: 'validate-email' });
        }

      } else {
        res.render('login', { title: 'ATI', msg: 'bad-login' });
      }

    });
  // it is enough to check whether or not one field from this form is defined, because all fields are required.
  } else if (newName != undefined) {
    // res.send(req.body)
    if (newPassword == newPasswordConf) {

      dba.performQuery("SELECT EMail,PW FROM user WHERE EMail = '" + newEmail + "'",function (err, result) {
        if (err || result == undefined) {			//in case of an error (mostlikely an invalid sql-statement) tell the client and log on the server
          return console.log('Err: Bad query. (login.js:67)' + err.toString());	//for more detailed err-log de-comment the line above
        }
        let string = JSON.stringify(result);
        let json =  JSON.parse(string);

        // if json object is empty, no user with this email address exists yet.
        if (Object.keys(json).length == 0) {
          // let query = "INSERT INTO user (UserName, EMail, PW) VALUES ('" + newName +"','" + newEmail + "','" + bcrypt.hashSync(newPassword, hashPasses) + "')";
          let query = "INSERT INTO user (UserName, EMail, PW, bestaetigt) VALUES ('" + newName +"','" + newEmail + "','" + bcrypt.hashSync(newPassword, hashPasses) + "', 1)"; // TODO remove when email is activated
          // console.log(query);
          dba.performQuery(query, function (err, result) {
            if (err || result == undefined) {
                return console.log('Err: Bad query. (login.js:79)' + err.toString());
            } else {

              res.redirect('/login'); // TODO remove when email is active

              // // current Date
              // let date = new Date();
              // date.setTime( date.getTime() + validDays * 86400000 );// calculating a date in x days
              // // convert date do yyyy-mm-dd
              // let dateString = date.getFullYear() + '-' + date.getMonth()+1 + '-' + date.getDate();
              // // console.log(dateString);
              // let query = "INSERT INTO bestaetigungslinks (UID, url,  expirationDate) VALUES ( (SELECT UserID FROM user WHERE EMail='" + newEmail + "') , 'aaa' , '"+dateString+"' )"+
              //                 "ON DUPLICATE KEY UPDATE url=RANDSTRING(32), expirationDate='"+dateString+"'";
              // dba.performQuery(query, function (err, result) {
              //   if (err || result == undefined) {
              //       return console.log('Err: Bad query. (login.js:94)' + err.toString());
              //   } else {
              //
              //     // TODO EMail temporarily disabled
              //
              //
              //     // mailMan.sendValidationMail(newEmail, req, res);
              //
              //     res.render('message', {msg: 'valid-sent'});
              //   }
              // });
            }
          });
        } else {
          res.render('login', { title: 'ATI', msg: 'email-blocked' });
        }
      });

    } else {
      res.render('login', { title: 'ATI', msg: 'passwords do not match!' });
    }
  }

  });

// forgot password
// router.get('/reset' , function(req, res){
//   res.render('sendResetLink', {msg: 'hidden'});
// });

// Handle inputform for lost password
// router.post('/reset', function(req, res) {
//   var email = req.body.email;
//   console.log(email);
//
//   if (email != undefined) {
//     // current Date
//     let date = new Date();
//     date.setTime( date.getTime() + validDays * 86400000 );// calculating a date in x days * ms in a Day (24*60*60*1000)
//     // convert date do yyyy-mm-dd
//     let dateString = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
//     console.log(dateString);
//     let query = "INSERT INTO pwlinks (UID, url, expirationDate) VALUES ( (SELECT UserID FROM user WHERE EMail='" + email + "'),  'aaa' , '"+dateString+"' )"+
//                     "ON DUPLICATE KEY UPDATE url=RANDSTRING(32), expirationDate='"+dateString+"'";
//     dba.performQuery(query, function (err, result) {
//       if (err || result == undefined) {
//           return console.log('Err: Bad query. (login.js:140)' + err.toString());
//       } else {
//
//         // TODO EMail temporarily disabled
//
//         // mailMan.sendPWResetMail(email, req, res);
//
//         res.render('message', {msg: 'reset-sent'});
//       }
//     });
//   } else {
//     res.render('sendResetLink', {msg: 'visible'});
//   }
// });



// handle the password resets
// router.get('/reset/:token([A-Za-z0-9]{32})', function(req,res) {
//   // var token = req.url.substring(7);
//   var token = req.params.token;
//   console.log("validation token: " + token);
//
//   // check whether or not this token actually exists
//   let query = "SELECT UserID,EMail,PW FROM user,pwlinks WHERE pwlinks.url = '"+ token +"' AND UID = UserID";
//   dba.performQuery(query, function (err, result) {
//     if (err || result == undefined) {
//         return console.log('Err: Bad query. (login.js:167)' + err.toString());
//     } else {
//
//       let string = JSON.stringify(result);
//       let json =  JSON.parse(string);
//
//       // if json object is not empty, token is valid.
//       if (Object.keys(json).length != 0) {
//
//         res.render('pwreset', { title: 'ATI', validation_token: token, msg: 'hidden'});
//
//
//       } else {
//         console.log("invalid link " + token);
//         // next();
//         res.redirect('/');
//         // res.render('message', {msg: "Ihr Account wurde erfolgreich aktiviert."});
//       }
//     }
//   });
// });
//
// router.post('/reset/:token([A-Za-z0-9]{32})/rs', function(req, res) {
//   var token = req.params.token;
//   console.log("validation token: " + token);
//
//   var newPassword = req.body.newPassword,
//       newPasswordConf = req.body.newPasswordConf;
//
//
//   if (newPassword != newPasswordConf) {
//     res.render('pwreset' , { title: 'ATI', validation_token: token, msg: 'visible'});
//     return;
//   }
//   // check whether or not this token actually exists
//   let query = "SELECT UserID,EMail,PW FROM user,pwlinks WHERE pwlinks.url = '"+ token +"' AND UID = UserID";
//   dba.performQuery(query, function (err, result) {
//     if (err || result == undefined) {
//         return console.log('Err: Bad query. (login.js:205)' + err.toString());
//     } else {
//
//       let string = JSON.stringify(result);
//       let json =  JSON.parse(string);
//
//       // if json object is not empty, token is valid.
//       if (Object.keys(json).length != 0) {
//
//
//
//         let query = "UPDATE user SET user.PW='" + bcrypt.hashSync(newPassword, hashPasses) + "', user.bestaetigt = 1 WHERE UserID = " + json[0].UserID;
//         dba.performQuery(query, function(err, result) {
//           if (err || result == undefined) {
//             return console.log('Err: Bad query. (login.js:219)' + err.toString());
//           } else {
//             // login cookie setzten.
//             req.session.user = json[0].UserID;
//
//             // delete Token after usage
//             let query = "DELETE FROM pwlinks WHERE url = '"+ token +"'";
//             dba.performQuery(query, function (err, result) {
//               if (err || result == undefined) {
//                 return console.log('Err: Bad query. (login.js:228)' + err.toString());
//               } else {
//                 console.log("PWToken " + token + " used and removed from database.");
//
//                 console.log(json[0].Email);
//                 // res.redirect('/user');
//               }
//             });
//
//             res.redirect('/user');
//           }
//         });
//
//
//       } else {
//         console.log("invalid link " + token);
//         // next();
//         res.redirect('/');
//         // res.render('message', {msg: "Ihr Account wurde erfolgreich aktiviert."});
//       }
//     }
//   });
// });
//
// // For handling validation urls
// router.get('/:token([A-Za-z0-9]{32})', function(req, res) {
//   // var token = req.url.substring(1);
//   var token = req.params.token;
//   console.log("vallidation token: " + token);
//
//   // check whether or not this token actually exists
//   let query = "SELECT EMail,PW,bestaetigt FROM user,bestaetigungslinks WHERE bestaetigungslinks.url = '"+ token +"' AND UID = UserID";
//   dba.performQuery(query, function (err, result) {
//     if (err || result == undefined) {
//         return console.log('Err: Bad query. (login.js:262)' + err.toString());
//     } else {
//
//       let string = JSON.stringify(result);
//       let json =  JSON.parse(string);
//
//       // if json object is not empty, token is valid.
//       if (Object.keys(json).length != 0) {
//
//         // activate User account corresponding to this Token
//         let query = "UPDATE user,bestaetigungslinks SET user.bestaetigt = 1 WHERE bestaetigungslinks.url = '"+ token +"' AND UID = UserID";
//         dba.performQuery(query, function (err, result) {
//           if (err || result == undefined) {
//             console.log('Err: Bad query. (login.js:275)');
//           }
//             // delete Token after usage
//           let query = "DELETE FROM bestaetigungslinks WHERE url = '"+ token +"'";
//           dba.performQuery(query, function (err, result) {
//             if (err || result == undefined) {
//               return console.log('Err: Bad query. (login.js:273)' + err.toString());
//             } else {
//               console.log("Token " + token + " used and removed from database.");
//               //login cookie setzten.
//               // req.session.user = json[0].Email;
//               console.log(json[0].EMail);
//               // res.redirect('/user');
//               res.render('message', {msg: 'activate'});
//             }
//           });
//
//         });
//       } else {
//         console.log("invalid link " + token);
//
//         res.redirect('/');
//         
//       }
//     }
//   });
// });

//TODO when email is active, activate funtions

module.exports = router;
