"use strict";

var dba;		//the db-acces object that actually performs sql-statements

/**
* sets the dba
* called by db.js after creating a dba
* 
* @param newDba the dba of the db.js
*/
exports.setDba = function(newDba) {
	dba=newDba;
};

exports.updateSurvey = function (req, res) {
	let tmpString = 'UPDATE survey SET';
	let kommaNoetig = false;
	if (req.body.name) {
		tmpString += ' surveyName = \'' + req.body.name + '\'';
		kommaNoetig = true;
	}
	if (req.body.description) {
		if (kommaNoetig) {
			tmpString += ',';
		}
		tmpString += ' description = \'' + req.body.description + '\'';
	}
	if (req.body.maxProbands) {
		if (kommaNoetig) {
			tmpString += ',';
		}
		tmpString += ' maxProbands = ' + req.body.maxProbands;
	}
	if (req.body.status) {
		if (kommaNoetig) {
			tmpString += ',';
		}
		tmpString += ' surveyStatus = \'' + req.body.status + '\'';
	}
	if (req.body.begin) {
		if (kommaNoetig) {
			tmpString += ',';
		}
		tmpString += ' surveyBegin = ' + req.body.begin;
	}
	if (req.body.end) {
		if (kommaNoetig) {
			tmpString += ',';
		}
		tmpString += ' surveyend = ' + req.body.end;
	}
	tmpString += ' WHERE SurveyID = ' + req.body.SID + ';';
	dba.manipulateDB(tmpString, req, res);
};