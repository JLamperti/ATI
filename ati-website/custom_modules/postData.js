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
* Dates need to have the format yyyy-dd-mm.
*/
exports.insertLink = function(req, res) {
	var crypto = require('crypto');
 	var value = new Date().getTime() + 'x' + req.body.SID;
 	var hash = crypto.createHash('md5').update(value).digest('hex');
 	let stringOne = 'INSERT INTO link (url, SID';
 	let stringTwo = ') VALUES (\'' + hash + '\', ' + req.body.SID;
 	if (req.body.date) {
 		stringOne += ', ExpirationDate';
 		stringTwo += ', \'' + req.body.date + '\'';
 	}
 	if (req.body.uses) {
 		stringOne += ', UsesLeft';
 		stringTwo += ', ' + req.body.uses;
 	}
 	let tmpString = stringOne + stringTwo + ');';
 	dba.manipulateDB(tmpString, req, res);
 };

/**
* Inserts a single proband into the database.
* Parameters have to be in the body of the request.
* Mandatory-paramters are Ati1, Ati2, Ati3i, Ati4, Ati5, Ati6i, Ati7, Ati8i, Ati9, AtiScore.
* optional-parameters are all other attributes of a proband except for the ID, which are:
* Age, Sex, Education, EducationComment, Smartphone, Tablet, Computer, OnlineShopping, SozialeNetzwerke, 
* Videotelefonie, Videoplattformen, Internetforen, Smartwatch.
* Additionally a SID (a survey-ID) can be used to make the proband part of that survey.
*/
exports.insertProband = function(req, res) {
	let temp = req.body;		//for quick access
	let stringOne = 'INSERT INTO proband (Ati1, Ati2, Ati3i, Ati4, Ati5, Ati6i, Ati7, Ati8i, Ati9, AtiScore',						//prepare two strings for the sql-statement containing
		stringTwo = ') VALUES (' + temp.Ati1 + ', ' + temp.Ati2 + ', ' + temp.Ati3i + ', ' + temp.Ati4 + ', ' 					//the ati-values
			+ temp.Ati5 + ', ' + temp.Ati6i + ', ' + temp.Ati7 + ', ' + temp.Ati8i + ', ' + temp.Ati9 + ', ' + temp.AtiScore;
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
	if (temp.EducationComment) {
		stringOne = stringOne + ', EducationComment';
		stringTwo = stringTwo + ', \'' + temp.EducationComment + '\'';
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
* Inserts a single proband into the database and connects it with a user.
* Parameters have to be in the body of the request.
* Mandatory-paramters are Ati1, Ati2, Ati3i, Ati4, Ati5, Ati6i, Ati7, Ati8i, Ati9, AtiScore and UID
* optional-parameters are all other attributes of a proband except for the ID, which are:
* Age, Sex, Education, EducationComment, Smartphone, Tablet, Computer, OnlineShopping, SozialeNetzwerke, 
* Videotelefonie, Videoplattformen, Internetforen, Smartwatch.
*/
exports.insertProbandUser = function(req, res) {
	let temp = req.body;		//for quick access
	let stringOne = 'INSERT INTO proband (Ati1, Ati2, Ati3i, Ati4, Ati5, Ati6i, Ati7, Ati8i, Ati9, AtiScore',						//prepare two strings for the sql-statement containing
		stringTwo = ') VALUES (' + temp.Ati1 + ', ' + temp.Ati2 + ', ' + temp.Ati3i + ', ' + temp.Ati4 + ', ' 					//the ati-values
			+ temp.Ati5 + ', ' + temp.Ati6i + ', ' + temp.Ati7 + ', ' + temp.Ati8i + ', ' + temp.Ati9 + ', ' + temp.AtiScore;
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
	if (temp.Education) {
		stringOne = stringOne + ', EducationComment';
		stringTwo = stringTwo + ', \'' + temp.EducationComment + '\'';
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
	dba.manipulateDBTwice(tmpString,						//perform two sql-statements, insert the proband and insert the probandID into the User
		'UPDATE User SET PID = LAST_INSERT_ID() WHERE UserID= ' + req.body.UID + ';', req, res);
	
};

/**
* insert a survey and make a user the admin of it.
* parameters are in the body of the request.
* mandatory-paramter is UID (user-ID).
* optional-paramters are Name, Description, MaxProbands, Status, Begin, End, inviteText, takeEducation, takeAge, takeSex
* Dates need to have the format yyyy-dd-mm
*/
exports.insertSurvey = function(req, res) {
	let temp = req.body;		//for quick access
	let stringOne = 'INSERT INTO survey (UID, SurveyName',		//prepare two strings for the statement
		stringTwo = ') VALUES (' + temp.UID + ', ';
	if (temp.Name) {				//if a name is given, use it
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
		stringTwo += ', \'' + temp.Begin + '\'';
	}
	if (temp.End) {
		stringOne += ', SurveyEnd';
		stringTwo += ', \'' + temp.End + '\'';
	}
	if (temp.inviteText) {
		stringOne += ', inviteText';
		stringTwo += ', \'' + temp.inviteText + '\'';
	}
	if (temp.takeAge) {
		stringOne += ', takeAge';
		stringTwo += ', ' + temp.takeAge;
	}
	if (temp.takeEducation) {
		stringOne += ', takeEducation';
		stringTwo += ', ' + temp.takeEducation;
	}
	if (temp.takeSex) {
		stringOne += ', takeSex';
		stringTwo += ', ' + temp.takeSex;
	}
	let tmpString = stringOne + stringTwo + ');';		//finalize the statement
	dba.manipulateDB(tmpString, req, res);				//performe sthe statement
};

/**
* inserts a user
* 
* parameters are in the body
* must-have parameters are name, email, pw.
* optional parameter are PID to link a proband to the user and scientist, developer and teacher to assign roles.
*/
exports.insertUser = function(req, res) {
	let stringOne = 'INSERT INTO user (userName, eMail, pw';
	let stringTwo = ') VALUES (\''
		+ req.body.name + '\', \'' + req.body.email + '\', \'' +  req.body.pw + '\'';
	if (req.body.PID) {
		stringOne += ', PID';
		stringTwo += ', ' + req.body.PID;
	}
	if (req.body.scientist) {
		stringOne += ', isScientist';
		stringTwo += ', ' + req.body.scientist;
	}
	if (req.body.developer) {
		stringOne += ', isDeveloper';
		stringTwo += ', ' + req.body.developer;
	}
	if (req.body.teacher) {
		stringOne += ', isTeacher';
		stringTwo += ', ' + req.body.teacher;
	}
	dba.manipulateDB(stringOne + stringTwo + ');', req, res);
};




