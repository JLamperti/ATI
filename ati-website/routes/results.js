var express = require('express');
var router = express.Router();
var dba = require('../custom_modules/db-access');
var gData = require('../custom_modules/getData');
dba.connectDB();
gData.setDba(dba);

/* GET results listing. */
router.get('/', function(req, res, next) {
  res.render('result', { title: 'ATI' });
});

router.get('/get/all', function(req, res) {
	gData.selectAll(req, res);
});

module.exports = router;
