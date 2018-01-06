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
* Inserts a single proband into the database.
* Parameters have to be in the body of the request.
* Mandatory-paramters are Ati1 to Ati9 + AtiScore.
* optional-parameters are all other attributes of a proband except for the ID, 
* additionally SID (a survey-ID) can be used.
*/
exports.insertProband = function(req, res) {
	let temp = req.body;		//for quick access
	let stringOne = 'INSERT INTO proband (Ati1, Ati2, Ati3, Ati4, Ati5, Ati6, Ati7, Ati8, Ati9, AtiScore',						//prepare two strings for the sql-statement containing
		stringTwo = ') VALUES (' + temp.Ati1 + ', ' + temp.Ati2 + ', ' + temp.Ati3 + ', ' + temp.Ati4 + ', ' 					//the ati-values
			+ temp.Ati5 + ', ' + temp.Ati6 + ', ' + temp.Ati7 + ', ' + temp.Ati8 + ', ' + temp.Ati9 + ', ' + temp.AtiScore;
	if (temp.Token) {											//if a token is given, add it to the statement
		stringOne = stringOne + ', ProbandToken';
		stringTwo = stringTwo + ', \'' + temp.Token + '\'';
	}
	if (temp.Age) {												//repeat for all optional parameters
		stringOne = stringOne + ', Age';
		stringTwo = stringTwo + ', ' + temp.Age;
	}
	if (temp.Sex) {
		stringOne = stringOne + ', Sex';
		stringTwo = stringTwo + ', ' + temp.Sex;
	}
	if (temp.Education) {
		stringOne = stringOne + ', Education';
		stringTwo = stringTwo + ', ' + temp.Education;
	}
	if (temp.Smartphone) {
		stringOne = stringOne + ', Smartphone';
		stringTwo = stringTwo + ', ' + temp.Smartphone;
	}
	if (temp.Tablet) {
		stringOne = stringOne + ', Tablet';
		stringTwo = stringTwo + ', ' + temp.Tablet;
	}
	if (temp.Computer) {
		stringOne = stringOne + ', Computer';
		stringTwo = stringTwo + ', ' + temp.Computer;
	}
	if (temp.OnlineShopping) {
		stringOne = stringOne + ', OnlineShopping';
		stringTwo = stringTwo + ', ' + temp.OnlineShopping;
	}
	if (temp.SozialeNetzwerke) {
		stringOne = stringOne + ', SozialeNetzwerke';
		stringTwo = stringTwo + ', ' + temp.SozialeNetzwerke;
	}
	if (temp.Videotelefonie) {
		stringOne = stringOne + ', Videotelefonie';
		stringTwo = stringTwo + ', ' + temp.Videotelefonie;
	}
	if (temp.Videoplattformen) {
		stringOne = stringOne + ', Videoplattformen';
		stringTwo = stringTwo + ', ' + temp.Videoplattformen;
	}
	if (temp.Internetforen) {
		stringOne = stringOne + ', Internetforen';
		stringTwo = stringTwo + ', ' + temp.Internetforen;
	}
	if (temp.Smartwatch) {
		stringOne = stringOne + ', Smartwatch';
		stringTwo = stringTwo + ', ' + temp.Smartwatch;
	}
	let tmpString = stringOne + stringTwo + ');';				//finalize the statement by combining the two strings
	if (temp.SID) {												//if a SID is given, 
		dba.manipulateDBTwice(tmpString,						//perform two sql-statements, insert the proband and insert the proband into the survey
			'INSERT INTO partOf (PID, SID) VALUES (LAST_INSERT_ID(), ' + temp.SID + ');', req, res);
	} else {													//if no SID is given, just perform the one statement
		dba.manipulateDB(tmpString, req, res);
	}
};

/**
* insert a survey and make a user the admin of it.
* parameters are in the body of the request.
* mandatory-paramter is UID (user-ID).
* optional-paramters are Name, Description, MaxProbands, Status, Begin, End
*/
exports.insertSurvey = function(req, res) {
	let temp = req.body;		//for quick access
	let stringOne = 'INSERT INTO survey (SurveyName',		//prepare two strings for the statement
		stringTwo = ') VALUES (';
	if (temp.Name) {				//if a nyme is given, use it
		stringTwo += '\'' + temp.Name + '\'';
	} else {						//else default to 'survey'
		stringTwo += '\'survey\'';
	}
	if (temp.Description) {			//if a description is given, use it
		stringOne += ', Description';
		stringTwo += ', \'' + temp.Description + '\'';
	}
	if (temp.MaxProbands) {			//repeat for all optional parameters
		stringOne += ', MaxProbands';
		stringTwo += ', ' + temp.MaxProbands;
	}
	if (temp.Status) {
		stringOne += ', SurveyStatus';
		stringTwo += ', \'' + temp.Status + '\'';
	}
	if (temp.Begin) {
		stringOne += ', SurveyBegin';
		stringTwo += ', ' + temp.Begin;
	}
	if (temp.End) {
		stringOne += ', SurveyEnd';
		stringTwo += ', ' + temp.End;
	}
	let tmpString = stringOne + stringTwo + ');';		//finalize the first statement (for isnert the survey)
	dba.manipulateDBTwice(tmpString,					//perform both statements
		'INSERT INTO adminOf (SID, UID) VALUES (LAST_INSERT_ID(), ' + temp.UID + ');', req, res);
};




