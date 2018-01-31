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
* deletes a survey
* mandatory-parameter in body: SID
*/
exports.deleteSurvey = function (req, res) {
	dba.manipulateDB('DELETE FROM survey WHERE SurveyID = ' + req.body.SID + ';', req, res);
};

/**
* deletes a user
* mandatory-parameter in body: UID
*/
exports.deleteUser = function (req, res) {
	dba.manipulateDB('DELETE FROM user WHERE UserID = ' + req.body.UID + ';', req, res);
};










