var express = require('express');
var router = express.Router();

/* GET results listing. */
router.get('/', function(req, res, next) {
  res.render('result', { title: 'ATI', atiScore: 5 });
});

module.exports = router;
