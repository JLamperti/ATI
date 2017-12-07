var express = require('express');
var router = express.Router();

/* GET profile page. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*update name*/
router.put('/changeName', function(req, res, next) {
  //TODO
});

module.exports = router;
