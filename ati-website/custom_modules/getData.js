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
* selects age and the ati score of all probands except for duplicates (token)
*/
exports.selectAgeAndAti = function(req, res) {
	dba.manipulateDB("SELECT Age, AtiScore FROM allesOhneDuplikate;", req, res);
};

/**
* selects everything of all probands except for duplicates (token)
*/
exports.selectAll = function(req, res) {
	dba.manipulateDB("SELECT * FROM allesOhneDuplikate;", req, res);
};

/**
* selects the average of the handed parameters or all if none is handed
* from either a survey or all probands without duplicates
* 
* parameters:
* sel[] the parameters to select (valid options are atiScore, sex, age (planned education))
* fromSurv the id of the survey to select the probands from
*/
exports.selectAvg = function (req, res) {
	let tmpString;			//prepare a string for the statement
	if (req.query.sel != null) {			//if sel parameters are given, select only them
		tmpString = 'SELECT AVG(' + req.query.sel[0] + ')';
		let i = 1;
		while (i < req.query.sel.length) {
			tmpString += ', AVG(' + req.query.sel[i] + ')';
		}
	} else {			//else selct all parameters
		tmpString = 'SELECT AVG(atiScore), AVG(age), AVG(sex)';
	}
	if (req.query.fromSurv == null) {			//if no survey is given, use all probands
		tmpString += ' FROM AllesOhneDuplikate;';
	} else {									//else use the survey given
		tmpString += ' FROM Proband WHERE probandId IN (\
				SELECT PID \
				FROM partOf \
				WHERE SID=' + req.query.fromSurv + ');';
	}
	dba.manipulateDB(tmpString, req, res);		//perform the statement
};

/**
* selects the amount of probands (without duplicates by token) with an atiScore of 1-<2, 2-<3, ...
*/
exports.selectBuckets = function(req, res) {
	dba.manipulateDB("SELECT * FROM bucketsOhneDuplikate", req, res);
};

/**
* allows for a selection of custom parameters meeting custom conditions from a specific survey or all probands without (token).
* without any parameters this default behaves like selectAll.
* The paramenters are in the url.
* 
* parameters:
* sel[] the parameters to select (valid options are Ati1 to Ati9, AtiScore,
* 	ProbandToken, Age, Sex, Education, Smartphone, Tablet, Computer, OnlineShopping, 
* 	SozialeNetzwerke, Videotelefonie, Videoplattformen, Internetforen, Smartwatch)
* crit[] the conditions to meet (e.g. Age>20, Token='blabla', ...)
* fromSurv the id of the survey to select the probands from
*/
exports.selectComplex = function(req, res) {
	let tmpString = 'SELECT *';			//create an initial string for the sql-statement
	let temp = req.query;				//for easy access 
	if (temp.sel != null) {									//if there is at least one sel
		tmpString = 'SELECT ' + temp.sel[0];				//add the sel to the statement
		let i = 1;
		while (i<temp.sel.length) {							//repeat for evey sel
			tmpString = tmpString + ', ' + temp.sel[i];
			i++;
		}
	}
	if (temp.fromSurv == null) {								//if no survey is states
		tmpString = tmpString + ' FROM allesOhneDuplikate';		//select from all probands without duplicates
	} else {
		tmpString = tmpString + ' FROM Proband';				//else select from all probands (with duplicates) and specify later
	}
	if (temp.crit != null) {								//is there is at least one condition to meet
		tmpString = tmpString + ' WHERE ' + temp.crit[0];	//add the crit to the statement
		let i = 1;
		while (i<temp.crit.length) {						//repeat for every crit
			tmpString = tmpString + ' AND ' + temp.crit[i];
			i++
		}
	}
	if (temp.fromSurv != null) {								//if a survey is stated
		if (temp.crit == null) {								//add the survey to the statement (differs depending on wether or not there are crit)
			tmpString = tmpString + ' WHERE probandId IN (\
				SELECT PID \
				FROM partOf \
				WHERE SID=' + temp.fromSurv + ')';
		} else {
			tmpString = tmpString + ' AND probandId IN (\
				SELECT PID \
				FROM partOf \
				WHERE SID=' + temp.fromSurv +')';
		}
	}
	tmpString = tmpString + ';';				//finalize the statement
	dba.manipulateDB(tmpString, req, res);		//perform the statement
};

/**
* selects a survey
* 
* parameter (must-have, in url):
* SID the ID of the survey to select
*/
exports.selectSurvey = function(req, res) {
	dba.manipulateDB("SELECT * FROM survey WHERE surveyId=" + req.query.SID + ";", req, res);
};

/**
* select all surveys a specific user administrates
* 
* parameter (must-have, in url):
* UID the user-ID
*/
exports.selectSurveyByUser = function(req, res) {
	dba.manipulateDB("SELECT * FROM survey WHERE SurveyID IN \
	(SELECT SID FROM adminOf WHERE UID=" + req.query.UID + ");", req, res);
};

/**
* selects everything except the password from a user specified by the userID
* 
* paramter (must-have, in url):
* UID the userID
*/
exports.selectUser = function(req, res) {
	dba.manipulateDB('SELECT userID, userName, eMail, PID FROM \
		user WHERE userID = ' + req.query.UID + ';', req, res);
};












