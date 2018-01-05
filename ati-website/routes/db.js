var express = require('express');
var router = express.Router();
var dba = require('../custom_modules/db-access');
var gData = require('../custom_modules/getData');
dba.connectDB();
gData.setDba(dba);


router.get('/get/ageAndAti', function(req, res) {
	gData.selectAgeAndAti(req, res);
});

router.get('/get/all', function(req, res) {
	gData.selectAll(req, res);
});

router.get('/get/buckets', function(req, res) {
	gData.selectBuckets(req, res);
});

router.get('/get/complex', function(req, res) {
	gData.selectComplex(req, res);
});

router.get('/get/survey', function(req, res) {
	gData.selectSurvey(req, res);
});

module.exports = router;