"use strict";

var mysql = require('mysql');
var path	= require('path');
var fs	= require('fs');

//chose the db to connect to
var con = mysql.createConnection({
	host: "localhost",
	user: "ich",
	password: "meinpw"
});

//connect to the db
con.connect(function(err) {
	if (err) throw err;
	console.log("Database Connected!");
});

//allow other moduls to make this connect to the db
exports.connectDB = function() {
	con.query("USE AtiDB;", function (err, result) {
		if (err) throw err;
		console.log("AtiDB wird genutzt.");
	});
};

//takes a String containing an sql-statement and performs it
exports.manipulateDB = function (string, req, res) {
	try {
		con.query(string, function (err, result) {
			if (err) {
				res.status(406).send('Invalid Parameters for the Database. Check the parameters of your request.');
				return console.log('Err: Bad query. (db-acces.js:manipulateDB)');
			}
			var string = JSON.stringify(result);
			let json =  JSON.parse(string);
			res.send(json);
		});
	} catch(err) {
		res.status(500).send('Something went wrong!');
		return console.log(err);
	}
};







