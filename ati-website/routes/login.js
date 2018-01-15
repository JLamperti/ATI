var express = require('express');
var router = express.Router();
//var session = require('express-session');
var bcrypt = require('bcrypt');
var dba = require('../custom_modules/db-access.js');


/* GET profile page. */
router.get('/', function(req, res, next) {
   res.render('login', { title: 'ATI' });
});

router.post('/',function(req, res) {

  var email = req.body.email,
      password = req.body.password;

  dba.performQuery("SELECT EMail,PW FROM user WHERE EMail = '" + email + "'",function (err, result) {
      if (err) {			//in case of an error (mostlikely an invalid sql-statement) tell the client and log on the server
        return console.log('Err: Bad query. (db-acces.js:manipulateDB)');	//for more detailed err-log de-comment the line above
      }
      var string = JSON.stringify(result);
      let json =  JSON.parse(string);
      //res.send(json);
      if (bcrypt.compareSync(password,json[0].PW)) {
        req.session.user = json;
      }

      res.redirect('profile');
    });

  });


/*update name*/
router.put('/changeName', function(req, res, next) {
  //TODO
});

module.exports = router;
