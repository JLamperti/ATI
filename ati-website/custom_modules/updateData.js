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

/**
* updates a survey
* 
* parameters have to be in the body
* mandatory-parameters: SID
* optional-parameters: description, name, maxProbands, status, begin, end, inviteText
* dates need to have the format yyyy-dd-mm
* 
* for details on what a specific line does compare to other functions (e.g. in postData.js)
*/
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
		kommaNoetig = true;
	}
	if (req.body.maxProbands) {
		if (kommaNoetig) {
			tmpString += ',';
		}
		tmpString += ' maxProbands = ' + req.body.maxProbands;
		kommaNoetig = true;
	}
	if (req.body.status) {
		if (kommaNoetig) {
			tmpString += ',';
		}
		tmpString += ' surveyStatus = \'' + req.body.status + '\'';
		kommaNoetig = true;
	}
	if (req.body.begin) {
		if (kommaNoetig) {
			tmpString += ',';
		}
		tmpString += ' surveyBegin = ' + req.body.begin;
		kommaNoetig = true;
	}
	if (req.body.end) {
		if (kommaNoetig) {
			tmpString += ',';
		}
		tmpString += ' surveyend = ' + req.body.end;
	}
	if (req.body.inviteText) {
		if (kommaNoetig) {
			tmpString += ',';
		}
		tmpString += ' inviteText = \'' + req.body.inviteText + '\'';
	}
	if (req.body.takeSex) {
		if (kommaNoetig) {
			tmpString += ',';
		}
		tmpString += ' takeSex = ' + req.body.takeSex;
	}
	if (req.body.takeAge) {
		if (kommaNoetig) {
			tmpString += ',';
		}
		tmpString += ' takeAge = ' + req.body.takeAge;
	}
	if (req.body.takeEducation) {
		if (kommaNoetig) {
			tmpString += ',';
		}
		tmpString += ' takeEducation = ' + req.body.takeEducation;
	}
	tmpString += ' WHERE SurveyID = ' + req.body.SID + ';';
	dba.manipulateDB(tmpString, req, res);
};

/**
* updates a user
* 
* parameters have to be in the body
* mandatory-parameters: UID
* optional-parameters: name, email, pw, PID
* 
* for info on a specif line compare to other functions (e.g. in postData.js)
*/
exports.updateUser = function (req, res) {
	let tmpString = 'UPDATE user SET';
	let kommaNoetig = false;
	if (req.body.name) {
		tmpString += ' userName = \'' + req.body.name + '\'';
		kommaNoetig = true;
	}
	if (req.body.email) {
		if (kommaNoetig) {
			tmpString += ',';
		}
		tmpString += ' eMail = \'' + req.body.email + '\'';
		kommaNoetig = true;
	}
	if (req.body.pw) {
		if (kommaNoetig) {
			tmpString += ',';
		}
		tmpString += ' pw = \'' + req.body.pw + '\'';
		kommaNoetig = true;
	}
	if (req.body.PID) {
		if (kommaNoetig) {
			tmpString += ',';
		}
		tmpString += ' PID = ' + req.body.PID;
	}
	if (req.body.scientist) {
		if (kommaNoetig) {
			tmpString += ',';
		}
		tmpString += ' IsScientist = ' + req.body.scientist;
	}
	if (req.body.developer) {
		if (kommaNoetig) {
			tmpString += ',';
		}
		tmpString += ' IsDeveloper = ' + req.body.developer;
	}
	if (req.body.teacher) {
		if (kommaNoetig) {
			tmpString += ',';
		}
		tmpString += ' IsTeacher = ' + req.body.teacher;
	}
	tmpString += ' WHERE UserID = ' + req.body.UID + ';';
	dba.manipulateDB(tmpString, req, res);
	
};







