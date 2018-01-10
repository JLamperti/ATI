var express = require('express');
var router = express.Router();


/*update name*/
router.put('/changeName', function(req, res, next) {
  //TODO
});
/* GET profile page. */
router.get('/', function(req, res, next) {
  res.render('profile', {title:'ATI' });
});

module.exports = router;
