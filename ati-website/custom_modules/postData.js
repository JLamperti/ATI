"use strict";

var dba;

exports.setDba = function(newDba) {
	dba=newDba;
};

exports.insertProband = function(req, res) {
	console.log('body: ' + req.body);
	console.log('Age: ' + req.body.Age);
	console.log('Agge: ' + req.body.Agge);
	console.log('Token: ' + req.body.Token);
	//if (!temp.Ati1 || !temp.Ati2 || !temp.Ati3 || !temp.Ati4 || !temp.Ati5 || !temp.Ati6 || !temp.Ati7 || !temp.Ati8 || !temp.Ati9 || !temp.AtiScore) {
	//	res.status(406).send('Invalid 
	let temp = req.body;
	let stringOne = 'INSERT INTO proband (Ati1, Ati2, Ati3, Ati4, Ati5, Ati6, Ati7, Ati8, Ati9, AtiScore',
		stringTwo = ') VALUES (' + temp.Ati1 + ', ' + temp.Ati2 + ', ' + temp.Ati3 + ', ' + temp.Ati4 + ', ' 
			+ temp.Ati5 + ', ' + temp.Ati6 + ', ' + temp.Ati7 + ', ' + temp.Ati8 + ', ' + temp.Ati9 + ', ' + temp.AtiScore;
	if (temp.Token) {
		stringOne = stringOne + ', ProbandToken';
		stringTwo = stringTwo + ', \'' + temp.Token + '\'';
	}
	if (temp.Age) {
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
	let tmpString = stringOne + stringTwo + ');';
	if (temp.SID) {
		dba.manipulateDBTwice(tmpString,
			'INSERT INTO partOf (PID, SID) VALUES (LAST_INSERT_ID(), ' + temp.SID + ');', req, res);
	} else {
		dba.manipulateDB(tmpString, req, res);
	}
};