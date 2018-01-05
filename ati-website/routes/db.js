var express = require('express');
var router = express.Router();
var dba = require('../custom_modules/db-access');
var gData = require('../custom_modules/getData');
var pData = require('../custom_modules/postData');
//dba.connectDB();
gData.setDba(dba);
pData.setDba(dba);


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

router.post('/post/proband', function(req, res) {
	pData.insertProband(req, res);
});

module.exports = router;