var express = require('express');
var router = express.Router();
var session = require('express-session');
var dba = require('../custom_modules/db-access.js');

/* GET profile page. */
router.get('/', function(req, res) {
	if (req.session.user && req.cookies.user_sid) {
      res.render('profile', { title: 'ATI' });
   } else {
      res.redirect('login');
   }



	//dba.respondAfterAut("SELECT probandToken AS comperator FROM allesOhneDuplikate WHERE probandId=11;",
	//	"test", 'result', req, res);
  //res.send('respond with a resource');
});

/*update name*/
router.put('/changeName', function(req, res, next) {
  //TODO
});

module.exports = router;
