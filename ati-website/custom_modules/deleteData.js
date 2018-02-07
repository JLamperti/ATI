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
	if (req.session.user && req.cookies.user_sid) {
		dba.manipulateDB('DELETE FROM user WHERE UserID = ' + req.session.user + ';', req, res);
	} else {
		res.status(401).send('You need to be logged in to do this.');
	}
};

/**
* deletes a link
* mandatory-parameter in body: url
*/
exports.deleteLink = function (req, res) {
	dba.manipulateDB('DELETE FROM link WHERE url = ' + req.body.url + ';', req, res);
};










