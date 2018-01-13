var express = require('express');
var router = express.Router();
var dba = require('../custom_modules/db-access');
var gData = require('../custom_modules/getData');
var pData = require('../custom_modules/postData');
var uData = require('../custom_modules/updateData');
gData.setDba(dba);
pData.setDba(dba);
uData.setDba(dba);


/*
* For info on what the routes do see the functions
*/


//get-requests

router.get('/ageAndAti', function(req, res) {
	gData.selectAgeAndAti(req, res);
});

router.get('/all', function(req, res) {
	gData.selectAll(req, res);
});

router.get('/avg', function(req, res) {
	gData.selectAvg(req, res);
});

router.get('/buckets', function(req, res) {
	gData.selectBuckets(req, res);
});

router.get('/complex', function(req, res) {
	gData.selectComplex(req, res);
});

router.get('/survey', function(req, res) {
	gData.selectSurvey(req, res);
});

router.get('/surveyByUser', function(req, res) {
	gData.selectSurveyByUser(req, res);
});

router.get('/user', function(req, res) {
	gData.selectUser(req, res);
});


//post-requests

router.post('/proband', function(req, res) {
	pData.insertProband(req, res);
});

router.post('/probandUser', function(req, res) {
	pData.insertProbandUser(req, res);
});

router.post('/survey', function(req, res) {
	pData.insertSurvey(req, res);
});

router.post('/user', function(req, res) {
	pData.insertUser(req, res);
});


//update-requests

router.put('/survey', function(req, res) {
	uData.updateSurvey(req, res);
});

module.exports = router;