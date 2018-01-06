"use strict";

var mysql = require('mysql');
var path	= require('path');
var fs	= require('fs');

var pool = mysql.createPool({
	connectionLimit : 100,
	host: "localhost",
	user: "ich",
	password: "meinpw",
	database : "AtiDB"
});

exports.manipulateDB = function (string, req, res) {
	pool.getConnection(function (err, con) {
		con.query(string, function (err, result) {
			if (err) {
				res.status(406).send('Invalid Parameters for the Database. Check the parameters of your request.');
				//console.log(err);
				return console.log('Err: Bad query. (db-acces.js:manipulateDB)');
			}
			var string = JSON.stringify(result);
			let json =  JSON.parse(string);
			res.send(json);
		});
		con.release();
	});
};

exports.manipulateDBTwice = function (stringOne, stringTwo, req, res) {
	pool.getConnection(function (err, con) {
		con.query(stringOne, function (err, result) {
			if (err) {
				res.status(406).send('Invalid Parameters for the Database. Check the parameters of your request.');
				//console.log(err);
				return console.log('Err: Bad query. (db-acces.js:manipulateDBTwice:One)');
			} else {
				con.query(stringTwo, function (err, result) {
					if (err) {
						res.status(406).send('Invalid Parameters for the Database. Check the parameters of your request.');
						console.log(err);
						return console.log('Err: Bad query. (db-acces.js:manipulateDBTwice:Two)');
					}
					res.send('OK');
				});
			}
		});
		
		con.release();
	});
};







