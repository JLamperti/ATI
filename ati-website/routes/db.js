var express = require('express');
var router = express.Router();
var dba = require('../custom_modules/db-access');
var gData = require('../custom_modules/getData');
var pData = require('../custom_modules/postData');
var uData = require('../custom_modules/updateData');
var dData = require('../custom_modules/deleteData');
var iData = require('../custom_modules/importData');
var eData = require('../custom_modules/exportData');
gData.setDba(dba);
pData.setDba(dba);
uData.setDba(dba);
dData.setDba(dba);
iData.setDba(dba);
eData.setDba(dba);


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

router.get('/countProbandInSurvey', function(req, res) {
	gData.selectCountProbandInSurvey(req, res);
});

router.get('/sexAndAti', function(req, res) {
	gData.selectSexAndAti(req, res);
});

router.get('/exportCSV', function(req, res) {
	eData.exportCSV(req, res);
});

router.get('/links', function(req, res) {
	gData.selectLinks(req, res);
});

router.get('/educationAndAti', function(req, res) {
	gData.selectEducationAndAti(req, res);
});

router.get('/survey', function(req, res) {
	gData.selectSurvey(req, res);
});

router.get('/surveyAndLinkByUrl', function(req, res) {
	gData.selectSurveyAndLinkByUrl(req, res);
});

router.get('/surveyByUser', function(req, res) {
	gData.selectSurveyByUser(req, res);
});

router.get('/std', function(req, res) {
	gData.selectStd(req, res);
});

router.get('/user', function(req, res) {
	gData.selectUser(req, res);
});


//post-requests

router.post('/importCSV', function(req, res) {
	iData.importCSV(req, res);
});

router.post('/link', function(req, res) {
	pData.insertLink(req, res);
});

router.post('/proband', function(req, res) {
	pData.insertProband(req, res);
});

router.post('/probandLink', function(req, res) {
	pData.insertProbandLink(req, res);
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

router.put('/user', function(req, res) {
	uData.updateUser(req, res);
});


//delete-requests

router.delete('/user', function(req, res) {
	dData.deleteUser(req, res);
});

module.exports = router;