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
* exports the data of a survey as a .csv file inside a .zip.
* mandatory-parameter (in the url): SID (a survey-ID)
* 
* example-usage: /db/exportCSV?SID=1
*/
exports.exportCSV = function(req, res) {
	let string = 'SELECT * FROM Proband WHERE probandId IN (SELECT PID FROM partOf WHERE SID=' + req.query.SID + ');';
	dba.exportDataCSV(string, req, res);
};
	
	
	
	
	
	
	
	