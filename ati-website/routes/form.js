var express = require('express'),
  cookieParser = require('cookie-parser');
var router = express.Router();

router.use(cookieParser());
/* GET the questionaire */
router.get('/form', function(req, res) {
  res.render('questionair');
});

module.exports = router;
