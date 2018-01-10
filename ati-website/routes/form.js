var express = require('express'),
  cookieParser = require('cookie-parser');
var router = express.Router();

router.use(cookieParser());
/* GET the questionaire */
router.get('/', function(req, res) {
  res.render('questionnaire');
});

module.exports = router;
